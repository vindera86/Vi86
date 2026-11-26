const puppeteer = require('puppeteer-core');

const URL = process.env.URL || 'http://localhost:5173';
const OUT = 'C:/Users/Diana/Desktop/nv86-automix';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox'],
    protocolTimeout: 240000,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1453, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  await page.screenshot({ path: OUT + '/perf-dark-top.png' });

  // light theme
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('header button')).find((x) => /Ночь|День/i.test(x.innerText));
    if (b) b.click();
  });
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: OUT + '/perf-light-top.png' });

  // mid scroll: check cards still render with content-visibility
  await page.evaluate(() => window.scrollTo(0, 1500));
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: OUT + '/perf-light-cards.png' });

  // deep scroll jump (content-visibility edge case)
  await page.evaluate(() => window.scrollTo(0, 3200));
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: OUT + '/perf-light-cards-deep.png' });

  // modal
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('article button')).find((b) => /Техкарта/i.test(b.innerText));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: OUT + '/perf-light-modal.png' });

  const sizes = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('article'));
    return {
      count: cards.length,
      heights: cards.slice(0, 8).map((c) => Math.round(c.getBoundingClientRect().height)),
    };
  });
  console.log(JSON.stringify(sizes));
  await browser.close();
})();
