import { getAdmin } from '../../../src/server/auth';
import { methodNotAllowed } from '../../../src/server/api';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  const admin = await getAdmin(req);
  if (!admin) return res.status(401).json({ message: 'Требуется авторизация' });
  return res.status(200).json(admin);
}
