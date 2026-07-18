import bcrypt from 'bcryptjs';
import { prisma } from '../../../src/server/db';
import { createSessionToken, sessionCookie } from '../../../src/server/auth';
import { apiError, methodNotAllowed } from '../../../src/server/api';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) return res.status(400).json({ message: 'Введите email и пароль' });

  try {
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    res.setHeader('Set-Cookie', sessionCookie(createSessionToken(user), req));
    return res.status(200).json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    return apiError(res, error);
  }
}
