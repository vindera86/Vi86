const puppeteer = require('puppeteer-core');

const URL = process.env.URL || 'http://localhost:5173';

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
  await new Promise((r) => setTimeout(r, 1200));

  const grid = await page.evaluate(() => ({
    nodes: document.querySelectorAll('*').length,
    rows: document.querySelectorAll('tbody tr').length,
  }));

  const t0 = Date.now();
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('header button')).find((x) => /Таблица/i.test(x.innerText));
    if (b) b.click();
  });
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const switchMs = Date.now() - t0;
  await new Promise((r) => setTimeout(r, 800));

  const table = await page.evaluate(() => ({
    nodes: document.querySelectorAll('*').length,
    rows: document.querySelectorAll('tbody tr').length,
    bodyHeight: document.body.scrollHeight,
  }));

  const frames = await page.evaluate(async () => {
    const f = [];
    let last = performance.now();
    await new Promise((resolve) => {
      let n = 0;
      const step = () => {
        const t = performance.now();
        f.push(t - last);
        last = t;
        window.scrollBy(0, 200);
        if (++n < 60) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
    const s = f.sort((a, b) => a - b);
    const at = (q) => Math.round(s[Math.min(s.length - 1, Math.floor(s.length * q))]);
    return { median: at(0.5), p95: at(0.95), worst: Math.round(s[s.length - 1]), over32: s.filter((x) => x > 32).length };
  });

  console.log(JSON.stringify({ grid, tableSwitchMs: switchMs, table, tableScroll: frames }, null, 2));
  await browser.close();
})();
