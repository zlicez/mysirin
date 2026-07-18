import path from 'path';
import { unlink } from 'fs/promises';
import puppeteer from 'puppeteer-core';

const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
const executablePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const email = process.env.ADMIN_EMAIL || 'admin@mysirin.local';
const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
const testImage = path.resolve('public/images/contactsInfo/img1.jpg');

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const page = await browser.newPage();
const browserErrors = [];
let createdId = null;
let createdAvatarFilename = null;

page.on('pageerror', (error) => browserErrors.push(error.stack || error.message));
page.on('console', (message) => {
  if (message.type() === 'error' && !message.text().includes('404 (Not Found)')) {
    browserErrors.push(message.text());
  }
});

try {
  await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'networkidle0' });
  await page.type('input[type="email"]', email);
  await page.type('input[type="password"]', password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('form button'),
  ]);

  await page.goto(`${baseUrl}/admin/reviews`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('#review-fullname');
  await page.waitForSelector('a[href="/admin/reviews"]');

  const suffix = Date.now();
  const author = `Тестовый автор ${suffix}`;
  const updatedAuthor = `Обновлённый автор ${suffix}`;
  const text = `Тестовый отзыв ${suffix}`;

  await page.type('#review-fullname', author);
  await page.type('#review-vacancy', 'Родитель ученицы');
  await page.type('#review-text', text);
  const avatarInput = await page.$('input[type="file"]');
  await avatarInput.uploadFile(testImage);
  await page.waitForSelector('img[src*="/api/media/"]');
  await page.$eval('form', (form) => form.requestSubmit());
  await page.waitForFunction(() => document.body.innerText.includes('Отзыв создан и добавлен в карусель.'));

  const created = await page.evaluate(async (expectedAuthor) => {
    const reviews = await fetch('/api/admin/reviews').then((response) => response.json());
    return reviews.find((review) => review.fullname === expectedAuthor);
  }, author);
  if (!created) throw new Error('Created review is missing from the admin API');
  createdId = created.id;
  createdAvatarFilename = created.photoImage;
  if (!created.photoImage) throw new Error('Created review has no saved avatar');

  const avatarResult = await page.evaluate(async ({ id, filename }) => {
    const imageResponse = await fetch(`/${filename}`);
    const publicReviews = await fetch('/api/reviews').then((response) => response.json());
    const publicReview = publicReviews?.[0]?.find((review) => review.id === id);
    return {
      imageStatus: imageResponse.status,
      publicReview,
    };
  }, { id: created.id, filename: created.photoImage });
  if (avatarResult.imageStatus !== 200) throw new Error(`Review avatar is unavailable: HTTP ${avatarResult.imageStatus}`);
  if (!avatarResult.publicReview) throw new Error('Created review is missing from the public carousel API');
  if (avatarResult.publicReview.photo?.[0]?.filename !== created.photoImage) {
    throw new Error('Public carousel API did not return the saved avatar');
  }

  await page.evaluate(({ id, expectedAuthor }) => {
    const expectedRow = Array.from(document.querySelectorAll('tbody tr'))
      .find((item) => item.textContent.includes(expectedAuthor));
    const button = expectedRow?.querySelectorAll('button');
    const editButton = Array.from(button || []).find((item) => item.textContent.trim() === 'Изменить');
    if (!editButton) throw new Error(`Edit button for review ${id} was not found`);
    editButton.click();
  }, { id: created.id, expectedAuthor: author });
  await page.waitForFunction((expectedAuthor) => (
    document.querySelector('#review-fullname')?.value === expectedAuthor
  ), {}, author);
  await page.click('#review-fullname', { clickCount: 3 });
  await page.type('#review-fullname', updatedAuthor);
  await page.$eval('form', (form) => form.requestSubmit());
  await page.waitForFunction(() => document.body.innerText.includes('Изменения отзыва сохранены.'));

  const updated = await page.evaluate(async (id) => {
    const reviews = await fetch('/api/admin/reviews').then((response) => response.json());
    return reviews.find((review) => review.id === id);
  }, created.id);
  if (updated?.fullname !== updatedAuthor) throw new Error('Review edit was not persisted');

  const homePage = await browser.newPage();
  await homePage.goto(baseUrl, { waitUntil: 'networkidle0' });
  await homePage.evaluate((expectedAuthor) => {
    const authorNode = Array.from(document.querySelectorAll('h2'))
      .find((node) => node.textContent.includes(expectedAuthor));
    authorNode?.scrollIntoView({ block: 'center' });
  }, updatedAuthor);
  await homePage.waitForFunction((avatarFilename) => (
    Array.from(document.images).some(
      (image) => image.src.includes(avatarFilename)
        && image.complete
        && image.naturalWidth > 0
    )
  ), {}, created.photoImage);
  const homeResult = await homePage.evaluate(({ expectedAuthor, avatarFilename }) => ({
    hasAuthor: document.body.innerText.includes(expectedAuthor),
    avatarLoaded: Array.from(document.images).some(
      (image) => image.src.includes(avatarFilename)
        && image.complete
        && image.naturalWidth > 0
        && image.naturalWidth === image.naturalHeight
    ),
    hasPiybeep: document.body.innerText.includes('Piybeep')
      || Boolean(document.querySelector('a[href*="piybeep.com"]')),
  }), { expectedAuthor: updatedAuthor, avatarFilename: created.photoImage });
  await homePage.close();
  if (!homeResult.hasAuthor) throw new Error('Updated review was not rendered on the home page');
  if (!homeResult.avatarLoaded) throw new Error('Review avatar was not rendered on the home page');
  if (homeResult.hasPiybeep) throw new Error('Piybeep attribution is still rendered in the footer');

  page.once('dialog', (dialog) => dialog.accept());
  await page.evaluate((expectedAuthor) => {
    const row = Array.from(document.querySelectorAll('tbody tr'))
      .find((item) => item.textContent.includes(expectedAuthor));
    const deleteButton = Array.from(row?.querySelectorAll('button') || [])
      .find((item) => item.textContent.trim() === 'Удалить');
    if (!deleteButton) throw new Error('Delete button was not found');
    deleteButton.click();
  }, updatedAuthor);
  await page.waitForFunction(async (id) => {
    const reviews = await fetch('/api/admin/reviews').then((response) => response.json());
    return !reviews.some((review) => review.id === id);
  }, {}, created.id);
  createdId = null;

  if (browserErrors.length) throw new Error(browserErrors.join('\n'));
  console.log('Reviews CMS browser smoke test passed');
} finally {
  if (createdId) {
    try {
      await page.evaluate((id) => fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' }), createdId);
    } catch {
      // The main failure is more useful than a cleanup failure.
    }
  }
  await browser.close();
  if (createdAvatarFilename?.startsWith('api/media/')) {
    await unlink(path.resolve('public', 'uploads', path.basename(createdAvatarFilename))).catch(() => {});
  }
}
