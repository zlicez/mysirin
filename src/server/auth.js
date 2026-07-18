import crypto from 'crypto';
import { prisma } from './db';

export const SESSION_COOKIE = 'sirin_admin';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function secret() {
  return process.env.AUTH_SECRET || 'local-development-secret-change-before-production';
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url');
}

export function createSessionToken(user) {
  const payload = Buffer.from(
    JSON.stringify({ userId: user.id, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  if (!token || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  const expected = sign(payload);
  const givenBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    givenBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(givenBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!parsed.userId || parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function secureCookieAttribute(req) {
  const mode = String(process.env.COOKIE_SECURE || 'auto').toLowerCase();
  if (mode === 'true') return '; Secure';
  if (mode === 'false') return '';

  const forwardedProto = String(req?.headers?.['x-forwarded-proto'] || '')
    .split(',')[0]
    .trim()
    .toLowerCase();
  return forwardedProto === 'https' || req?.socket?.encrypted ? '; Secure' : '';
}

export function sessionCookie(token, req) {
  const secure = secureCookieAttribute(req);
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${secure}`;
}

export function clearSessionCookie(req) {
  const secure = secureCookieAttribute(req);
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

export async function getAdmin(req) {
  const token = req.cookies?.[SESSION_COOKIE];
  const session = verifySessionToken(token);
  if (!session) return null;
  return prisma.adminUser.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true },
  });
}

export function isSameOrigin(req) {
  if (req.method === 'GET' || req.method === 'HEAD') return true;
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

export function withAdmin(handler) {
  return async function protectedHandler(req, res) {
    if (!isSameOrigin(req)) {
      return res.status(403).json({ message: 'Недопустимый источник запроса' });
    }
    const admin = await getAdmin(req);
    if (!admin) return res.status(401).json({ message: 'Требуется авторизация' });
    req.admin = admin;
    return handler(req, res);
  };
}
