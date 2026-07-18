import { prisma } from '../../src/server/db';
import { apiError, methodNotAllowed } from '../../src/server/api';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const settings = await prisma.homeSetting.findUnique({ where: { id: 1 } });
    return res.status(200).json([{ url_video: settings?.urlVideo || '' }]);
  } catch (error) {
    return apiError(res, error);
  }
}
