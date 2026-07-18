import { prisma } from '../../../src/server/db';
import { serializeCrew } from '../../../src/server/serializers';
import { apiError, methodNotAllowed } from '../../../src/server/api';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const member = await prisma.crewMember.findFirst({
      where: { id: Number(req.query.id), active: true },
      include: { gallery: { orderBy: { position: 'asc' } } },
    });
    if (!member) return res.status(404).json({ message: 'Участник команды не найден' });
    return res.status(200).json(serializeCrew(member));
  } catch (error) {
    return apiError(res, error);
  }
}
