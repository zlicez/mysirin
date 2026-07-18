import { clearSessionCookie } from '../../../src/server/auth';
import { methodNotAllowed } from '../../../src/server/api';

export default function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  res.setHeader('Set-Cookie', clearSessionCookie(req));
  return res.status(200).json({ ok: true });
}
