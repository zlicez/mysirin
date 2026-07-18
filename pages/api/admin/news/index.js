import { withAdmin } from '../../../../src/server/auth';
import { prisma } from '../../../../src/server/db';
import { sanitizeNewsHtml } from '../../../../src/server/content';
import { serializeAdminNews } from '../../../../src/server/serializers';
import { newsSchema, validationMessage } from '../../../../src/server/validation';
import { apiError, methodNotAllowed } from '../../../../src/server/api';

function publicationDateForCreate(selectedDate) {
  const now = new Date();
  const isToday = selectedDate.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
  return isToday && selectedDate > now ? now : selectedDate;
}

export default withAdmin(async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const news = await prisma.news.findMany({
        include: { gallery: { orderBy: { position: 'asc' } } },
        orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
      });
      return res.status(200).json(news.map(serializeAdminNews));
    }
    if (req.method === 'POST') {
      const parsed = newsSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: validationMessage(parsed.error) });
      const data = parsed.data;
      const news = await prisma.news.create({
        data: {
          title: data.title,
          text: sanitizeNewsHtml(data.text),
          // A newly created item is expected to appear on the public site immediately.
          // It can still be unpublished later from the edit form.
          status: 'PUBLISHED',
          coverImage: data.coverImage || null,
          publishedAt: publicationDateForCreate(data.publishedAt),
          gallery: {
            create: data.gallery.map((filename, position) => ({ filename, position })),
          },
        },
        include: { gallery: { orderBy: { position: 'asc' } } },
      });
      return res.status(201).json(serializeAdminNews(news));
    }
    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (error) {
    return apiError(res, error);
  }
});
