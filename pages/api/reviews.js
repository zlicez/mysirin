import { prisma } from '../../src/server/db';
import { apiError, methodNotAllowed } from '../../src/server/api';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const rows = await prisma.review.findMany({
      where: { active: true },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
    });
    const reviews = rows.map((review) => ({
      id: review.id,
      text: review.text,
      photo: review.photoImage ? [{ filename: review.photoImage }] : [],
      fullname: review.fullname,
      vacancy: review.vacancy,
    }));
    return res.status(200).json([reviews]);
  } catch (error) {
    return apiError(res, error);
  }
}
