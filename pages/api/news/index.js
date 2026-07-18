import { prisma } from '../../../src/server/db';
import { serializeNews } from '../../../src/server/serializers';
import { apiError, methodNotAllowed } from '../../../src/server/api';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const count = Math.min(Math.max(Number(req.query.count) || 12, 1), 100);
    const start = Math.max(Number(req.query.start) || 1, 1);
    const where = { status: 'PUBLISHED', publishedAt: { lte: new Date() } };
    const [rows, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: { gallery: { orderBy: { position: 'asc' } } },
        orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
        skip: start - 1,
        take: count,
      }),
      prisma.news.count({ where }),
    ]);
    return res.status(200).json({ data: rows.map(serializeNews), count: total });
  } catch (error) {
    return apiError(res, error);
  }
}
