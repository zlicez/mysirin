import { withAdmin } from '../../../../src/server/auth';
import { prisma } from '../../../../src/server/db';
import { sanitizeNewsHtml } from '../../../../src/server/content';
import { serializeAdminNews } from '../../../../src/server/serializers';
import { newsSchema, validationMessage } from '../../../../src/server/validation';
import { apiError, methodNotAllowed } from '../../../../src/server/api';

export default withAdmin(async function handler(req, res) {
  const id = Number(req.query.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Некорректный ID' });
  try {
    if (req.method === 'GET') {
      const news = await prisma.news.findUnique({
        where: { id },
        include: { gallery: { orderBy: { position: 'asc' } } },
      });
      if (!news) return res.status(404).json({ message: 'Новость не найдена' });
      return res.status(200).json(serializeAdminNews(news));
    }
    if (req.method === 'PUT') {
      const parsed = newsSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: validationMessage(parsed.error) });
      const data = parsed.data;
      const news = await prisma.$transaction(async (tx) => {
        await tx.newsImage.deleteMany({ where: { newsId: id } });
        return tx.news.update({
          where: { id },
          data: {
            title: data.title,
            text: sanitizeNewsHtml(data.text),
            status: data.status,
            coverImage: data.coverImage || null,
            publishedAt: data.publishedAt,
            gallery: { create: data.gallery.map((filename, position) => ({ filename, position })) },
          },
          include: { gallery: { orderBy: { position: 'asc' } } },
        });
      });
      return res.status(200).json(serializeAdminNews(news));
    }
    if (req.method === 'DELETE') {
      await prisma.news.delete({ where: { id } });
      return res.status(204).end();
    }
    return methodNotAllowed(res, ['GET', 'PUT', 'DELETE']);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'Новость не найдена' });
    return apiError(res, error);
  }
});
