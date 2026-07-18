import test from 'node:test';
import assert from 'node:assert/strict';
import { createSessionToken, sessionCookie, verifySessionToken } from '../src/server/auth';
import { sanitizeNewsHtml } from '../src/server/content';
import { serializeCrew, serializeNews } from '../src/server/serializers';
import { applicationSchema, newsSchema } from '../src/server/validation';

test('admin session token can be verified and rejects tampering', () => {
  const token = createSessionToken({ id: 42 });
  assert.equal(verifySessionToken(token).userId, 42);
  assert.equal(verifySessionToken(`${token}broken`), null);
});

test('admin cookie follows the actual request protocol in auto mode', () => {
  const previousMode = process.env.COOKIE_SECURE;
  process.env.COOKIE_SECURE = 'auto';
  try {
    assert.doesNotMatch(
      sessionCookie('token', { headers: { 'x-forwarded-proto': 'http' } }),
      /; Secure/
    );
    assert.match(
      sessionCookie('token', { headers: { 'x-forwarded-proto': 'https' } }),
      /; Secure/
    );
  } finally {
    if (previousMode === undefined) delete process.env.COOKIE_SECURE;
    else process.env.COOKIE_SECURE = previousMode;
  }
});

test('news HTML keeps formatting and removes scripts and unsafe links', () => {
  const html = sanitizeNewsHtml('<h2>Заголовок</h2><script>alert(1)</script><a href="javascript:bad()">ссылка</a>');
  assert.match(html, /<h2>Заголовок<\/h2>/);
  assert.doesNotMatch(html, /script|javascript/i);
});

test('legacy news and crew contracts contain expected image arrays', () => {
  const news = serializeNews({
    id: 1, title: 'Тест', text: '<p>Текст</p>', publishedAt: new Date('2026-01-01T00:00:00Z'),
    coverImage: 'uploads/cover.webp', gallery: [{ filename: 'uploads/1.webp' }],
  });
  assert.equal(news.pre_images[0].filename, 'api/media/cover.webp');
  assert.equal(news.images.length, 1);

  const crew = serializeCrew({
    id: 2, fullname: 'Иван Иванов', vacancy: 'Педагог', position: 1,
    photoImage: 'uploads/photo.webp', bannerImage: null, gallery: [],
  });
  assert.equal(crew.photo[0].filename, 'api/media/photo.webp');
  assert.deepEqual(crew.banner, []);
});

test('request validation rejects invalid ages and accepts a complete news item', () => {
  assert.equal(applicationSchema.safeParse({
    fullname_applicant: 'Иван Иванов', fullname_student: 'Пётр Иванов', age_student: 1,
    contact: '+79990000000', place: 'Москва',
  }).success, false);

  assert.equal(newsSchema.safeParse({
    title: 'Новая публикация', text: '<p>Текст</p>', status: 'DRAFT', coverImage: '',
    publishedAt: new Date().toISOString(), gallery: [],
  }).success, true);
});
