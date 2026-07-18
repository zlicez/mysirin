import puppeteer from 'puppeteer-core';
import path from 'path';

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
const errors = [];

page.on('pageerror', (error) => errors.push(`pageerror: ${error.stack || error.message}`));
page.on('console', async (message) => {
  if (message.type() === 'error' && !message.text().includes('404 (Not Found)')) {
    const details = await Promise.all(message.args().map(async (argument) => {
      try {
        return await argument.evaluate((value) => {
          if (value instanceof Error) return value.stack || value.message;
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value);
        });
      } catch {
        return argument.toString();
      }
    }));
    errors.push(`console: ${details.join(' ') || message.text()}`);
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

  await page.waitForSelector('a[href="/admin/crew"]');
  await page.click('a[href="/admin/crew"]');
  await page.waitForFunction(() => location.pathname === '/admin/crew');
  await page.waitForNetworkIdle();
  console.log(`/admin/crew: ${page.url()}`);
  const crewPhotoStatus = await page.evaluate(async () => {
    const crew = await fetch('/api/admin/crew').then((response) => response.json());
    const member = crew.find((item) => item.photoImage);
    if (!member) return 0;
    return fetch(`/${member.photoImage}`).then((response) => response.status);
  });
  if (crewPhotoStatus !== 200) throw new Error(`Saved crew photo is unavailable: HTTP ${crewPhotoStatus}`);

  await page.click('a[href="/admin/news"]');
  await page.waitForFunction(() => location.pathname === '/admin/news');
  await page.waitForNetworkIdle();
  try {
    await page.waitForSelector('a[href="/admin/news/new"]', { timeout: 5000 });
  } catch {
    console.error(`news page body: ${await page.evaluate(() => document.body.innerText)}`);
    console.error(errors.join('\n'));
    throw new Error('News list did not render after client-side navigation');
  }
  await page.click('a[href="/admin/news/new"]');
  await page.waitForFunction(() => location.pathname === '/admin/news/new');
  await page.waitForNetworkIdle();
  console.log(`/admin/news/new: ${page.url()}`);

  const newsTitle = `Browser smoke ${Date.now()}`;
  await page.type('form input:not([type="date"]):not([type="file"])', newsTitle);
  const coverInput = await page.$('input[type="file"]');
  await coverInput.uploadFile(testImage);
  await page.waitForSelector('img[src*="/api/media/"]');
  await page.$eval('form', (form) => form.requestSubmit());
  await page.waitForFunction(() => location.pathname === '/admin/news' && new URLSearchParams(location.search).get('saved') === 'created');
  await page.waitForNetworkIdle();
  const createdNews = await page.evaluate(async (title) => {
    const items = await fetch('/api/admin/news').then((response) => response.json());
    return items.find((item) => item.title === title);
  }, newsTitle);
  if (!createdNews || createdNews.status !== 'PUBLISHED') throw new Error('Created news was not saved as published');
  const coverStatus = await page.evaluate((coverImage) => fetch(`/${coverImage}`).then((response) => response.status), createdNews.coverImage);
  if (coverStatus !== 200) throw new Error(`Saved news cover is unavailable: HTTP ${coverStatus}`);
  const publicNewsVisible = await page.evaluate(async (id) => {
    const result = await fetch('/api/news?count=100&start=0').then((response) => response.json());
    return result.data.some((item) => item.id === id);
  }, createdNews.id);
  if (!publicNewsVisible) throw new Error('Published news is missing from the public API');
  const publicNewsPage = await browser.newPage();
  publicNewsPage.on('pageerror', (error) => errors.push(`public news pageerror: ${error.stack || error.message}`));
  await publicNewsPage.goto(`${baseUrl}/news`, { waitUntil: 'networkidle0' });
  const renderedNews = await publicNewsPage.evaluate((title) => ({
    hasTitle: document.body.innerText.includes(title),
    hasLoadedCover: Array.from(document.images).some((image) => image.src.includes('/api/media/') && image.complete && image.naturalWidth > 0),
  }), newsTitle);
  await publicNewsPage.close();
  if (!renderedNews.hasTitle || !renderedNews.hasLoadedCover) throw new Error('Created news did not render on /news');
  const cleanupStatus = await page.evaluate(async (id) => {
    const response = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
    return response.status;
  }, createdNews.id);
  if (cleanupStatus !== 204) throw new Error(`Could not clean up test news: HTTP ${cleanupStatus}`);
  console.log(`/admin/news/${createdNews.id}: image loaded, published, created and removed`);

  const publicPage = await browser.newPage();
  publicPage.on('pageerror', (error) => errors.push(`public pageerror: ${error.stack || error.message}`));
  await publicPage.goto(`${baseUrl}/team`, { waitUntil: 'networkidle0' });
  const loadedCrewPhoto = await publicPage.evaluate(() => Array.from(document.images).some((image) => image.src.includes('/api/media/') && image.complete && image.naturalWidth > 0));
  if (!loadedCrewPhoto) throw new Error('Saved crew photo did not render on the public team page');
  await publicPage.close();
  console.log('/team: saved crew photo rendered');

  const homePage = await browser.newPage();
  await homePage.setViewport({ width: 1920, height: 1080 });
  homePage.on('pageerror', (error) => errors.push(`home pageerror: ${error.stack || error.message}`));
  await homePage.goto(baseUrl, { waitUntil: 'networkidle0' });
  const homeLayout = await homePage.evaluate(() => {
    const aboutTitle = Array.from(document.querySelectorAll('h2')).find((node) => node.textContent.includes('МЫ'));
    const about = aboutTitle?.parentElement;
    const paragraphs = Array.from(about?.querySelectorAll('p') || []).map((node) => node.getBoundingClientRect());
    const paragraphsDoNotOverlap = paragraphs.every((rect, index) => index === 0 || rect.top >= paragraphs[index - 1].bottom);
    const teamCards = Array.from(document.querySelectorAll('a[href^="/team/"]'))
      .slice(0, 6)
      .map((card) => card.getBoundingClientRect());
    const firstRowAligned = teamCards.length === 6
      && Math.abs(teamCards[0].top - teamCards[1].top) < 2
      && Math.abs(teamCards[1].top - teamCards[2].top) < 2;
    const secondRowAligned = teamCards.length === 6
      && Math.abs(teamCards[3].top - teamCards[4].top) < 2
      && Math.abs(teamCards[4].top - teamCards[5].top) < 2;
    const originalWideNarrowPattern = teamCards.length === 6
      && teamCards[0].width > teamCards[1].width * 1.8
      && teamCards[5].width > teamCards[4].width * 1.8;
    return {
      paragraphsDoNotOverlap,
      teamGridPreserved: firstRowAligned && secondRowAligned && originalWideNarrowPattern,
      teamCardCount: teamCards.length,
    };
  });
  await homePage.close();
  if (!homeLayout.paragraphsDoNotOverlap) throw new Error('About paragraphs overlap at 1920px');
  if (!homeLayout.teamGridPreserved) throw new Error(`Original team grid is not preserved (${homeLayout.teamCardCount} found)`);
  console.log('/: about copy does not overlap and original team grid is preserved at 1920px');

  const anonymousContext = await browser.createBrowserContext();
  const anonymousPage = await anonymousContext.newPage();
  anonymousPage.on('pageerror', (error) => errors.push(`anonymous pageerror: ${error.stack || error.message}`));
  for (const path of ['/admin/crew', '/admin/news/new']) {
    await anonymousPage.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle0' });
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`anonymous ${path}: ${anonymousPage.url()}`);
  }
  await anonymousContext.close();

  if (errors.length) throw new Error(errors.join('\n'));
  console.log('Admin browser smoke test passed');
} finally {
  await browser.close();
}
