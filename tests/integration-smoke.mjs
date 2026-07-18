import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
let cookie = '';
const cleanup = [];
let uploadedFile = '';

async function call(url, options = {}, authenticated = false) {
  const headers = { ...(options.headers || {}) };
  if (authenticated) headers.Cookie = cookie;
  const response = await fetch(`${base}${url}`, { ...options, headers });
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${url}: ${response.status} ${text.slice(0, 300)}`);
  return { response, body };
}

async function json(url, method, body, authenticated = false) {
  return call(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }, authenticated);
}

try {
  const login = await json('/api/admin/login', 'POST', {
    email: process.env.ADMIN_EMAIL || 'admin@mysirin.local',
    password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
  });
  cookie = login.response.headers.get('set-cookie')?.split(';')[0] || '';
  if (!cookie) throw new Error('Сервер не установил cookie сессии');

  await call('/api/admin/dashboard', {}, true);

  const sourceImage = await fs.readFile(path.join(process.cwd(), 'public', 'images', 'main', 'preview', 'background-1.png'));
  const form = new FormData();
  form.append('kind', 'cover');
  form.append('file', new Blob([sourceImage], { type: 'image/png' }), 'cover.png');
  const upload = await call('/api/admin/upload', { method: 'POST', body: form }, true);
  if (upload.body.width !== 1230 || upload.body.height !== 692) throw new Error('Неверный размер обложки');
  uploadedFile = path.join(process.cwd(), 'public', upload.body.filename);

  const news = (await json('/api/admin/news', 'POST', {
    title: 'Интеграционный тест',
    text: '<p>Первый абзац</p><script>alert(1)</script>',
    status: 'PUBLISHED',
    coverImage: upload.body.filename,
    publishedAt: new Date().toISOString(),
    gallery: [upload.body.filename],
  }, true)).body;
  cleanup.push(() => call(`/api/admin/news/${news.id}`, { method: 'DELETE' }, true));
  const publicNews = (await call(`/api/news/${news.id}`)).body;
  if (publicNews.text.includes('<script') || publicNews.pre_images.length !== 1) throw new Error('Контракт новости нарушен');

  const crew = (await json('/api/admin/crew', 'POST', {
    fullname: 'Тестовый Участник', vacancy: 'Педагог', subVacancy: '', education: '',
    experience: '', achievements: '', position: 999, photoImage: upload.body.filename,
    bannerImage: '', active: true, gallery: [],
  }, true)).body;
  cleanup.push(() => call(`/api/admin/crew/${crew.id}`, { method: 'DELETE' }, true));
  const publicCrew = (await call(`/api/crew/${crew.id}`)).body;
  if (!Array.isArray(publicCrew.photo) || publicCrew.photo.length !== 1) throw new Error('Контракт команды нарушен');

  const application = (await json('/api/courses', 'POST', {
    fullname_applicant: 'Тестовый Заявитель', fullname_student: 'Тестовый Ученик',
    age_student: 10, contact: 'integration-test@example.com', place: 'Тестовый адрес',
  })).body;
  cleanup.push(() => call(`/api/admin/applications/${application.id}`, { method: 'DELETE' }, true));
  const updated = (await json(`/api/admin/applications/${application.id}`, 'PATCH', { status: 'CONTACTED' }, true)).body;
  if (updated.status !== 'CONTACTED') throw new Error('Статус заявки не обновился');

  const slide = (await json('/api/admin/slides', 'POST', {
    title: '', alt: 'Тестовый слайд', image: upload.body.filename, position: 999, active: true,
  }, true)).body;
  cleanup.push(() => call(`/api/admin/slides/${slide.id}`, { method: 'DELETE' }, true));

  for (const page of ['/', '/about', '/team', '/news', '/admin/login']) {
    const result = await call(page);
    if (!String(result.body).includes('<!DOCTYPE html>') && !String(result.body).includes('<!doctype html>')) {
      throw new Error(`${page} не вернул HTML`);
    }
  }

  console.log('Integration smoke test: OK');
} finally {
  for (const remove of cleanup.reverse()) {
    try { await remove(); } catch (error) { console.error(`Cleanup: ${error.message}`); }
  }
  if (uploadedFile) {
    try { await fs.unlink(uploadedFile); } catch {}
  }
}
