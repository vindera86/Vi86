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
  await new Promise((r) => setTimeout(r, 1000));

  // 1. typing responsiveness in the search field
  const typing = await page.evaluate(async () => {
    const input = document.querySelector('input[type="text"]');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    const frames = [];
    let last = performance.now();
    for (const ch of 'BCPR6E') {
      input.dispatchEvent(new Event('focus', { bubbles: true }));
      setter.call(input, (input.value || '') + ch);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((r) => requestAnimationFrame(r));
      const now = performance.now();
      frames.push(Math.round(now - last));
      last = now;
    }
    return { perKeystrokeMs: frames };
  });

  // reset search
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  // 2. body scroll while the modal is open
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('article button')).find((b) => /Техкарта/i.test(b.innerText));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 700));
  const scrollLock = await page.evaluate(async () => {
    const before = window.scrollY;
    window.scrollBy(0, 600);
    await new Promise((r) => setTimeout(r, 200));
    return { before, after: window.scrollY, dialogOpen: !!document.querySelector('dialog[open]') };
  });
  await page.evaluate(() => {
    const d = document.querySelector('dialog');
    if (d && d.open) d.close();
  });

  // 3. table horizontal overflow
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('header button')).find((x) => /Таблица/i.test(x.innerText));
    if (b) b.click();
  });
  await new Promise((r) => setTimeout(r, 700));
  const table = await page.evaluate(() => {
    const t = document.querySelector('table');
    if (!t) return null;
    const wrap = t.parentElement;
    return {
      tableWidth: Math.round(t.getBoundingClientRect().width),
      wrapperClientWidth: wrap ? wrap.clientWidth : null,
      wrapperScrollWidth: wrap ? wrap.scrollWidth : null,
      wrapperOverflowX: wrap ? getComputedStyle(wrap).overflowX : null,
    };
  });

  console.log(JSON.stringify({ typing, scrollLock, table }, null, 2));
  await browser.close();
})();
