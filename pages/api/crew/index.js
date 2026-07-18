import { prisma } from '../../../src/server/db';
import { serializeCrew } from '../../../src/server/serializers';
import { apiError, methodNotAllowed } from '../../../src/server/api';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const crew = await prisma.crewMember.findMany({
      where: { active: true },
      include: { gallery: { orderBy: { position: 'asc' } } },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
    });
    return res.status(200).json(crew.map(serializeCrew));
  } catch (error) {
    return apiError(res, error);
  }
}
