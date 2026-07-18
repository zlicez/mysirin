import { prisma } from '../../src/server/db';
import { apiError, methodNotAllowed } from '../../src/server/api';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const slides = await prisma.homeSlide.findMany({
      where: { active: true },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
    });
    return res.status(200).json(slides);
  } catch (error) {
    return apiError(res, error);
  }
}
