import { prisma } from '../../../src/server/db';
import { serializeNews } from '../../../src/server/serializers';
import { apiError, methodNotAllowed } from '../../../src/server/api';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const news = await prisma.news.findFirst({
      where: { id: Number(req.query.id), status: 'PUBLISHED', publishedAt: { lte: new Date() } },
      include: { gallery: { orderBy: { position: 'asc' } } },
    });
    if (!news) return res.status(404).json({ message: 'Новость не найдена' });
    return res.status(200).json(serializeNews(news));
  } catch (error) {
    return apiError(res, error);
  }
}
