import { prisma } from '../../src/server/db';
import { apiError, methodNotAllowed } from '../../src/server/api';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const contacts = await prisma.contact.findMany({ orderBy: [{ type: 'asc' }, { position: 'asc' }] });
    return res.status(200).json(contacts);
  } catch (error) {
    return apiError(res, error);
  }
}
