const puppeteer = require('puppeteer-core');

const URL = process.env.URL || 'http://localhost:5173';
const LABEL = process.env.LABEL || 'run';

const KEYS = ['TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration', 'RecalcStyleCount', 'LayoutCount'];

const toMap = (metrics) => {
  const raw = Array.isArray(metrics) ? metrics : metrics.metrics;
  const o = {};
  for (const k of KEYS) {
    const hit = raw.find((x) => x.name === k);
    if (hit) o[k] = Math.round(hit.value * 1000) / 1000;
  }
  return o;
};
const diff = (a, b) => {
  const o = {};
  for (const k of KEYS) o[k] = Math.round((b[k] - a[k]) * 1000) / 1000;
  return o;
};

const FRAME_HELPER = `
  window.__frames = [];
  window.__startFrames = () => {
    window.__frames = [];
    let last = performance.now();
    const rec = () => {
      const now = performance.now();
      window.__frames.push(now - last);
      last = now;
      if (window.__recording) requestAnimationFrame(rec);
    };
    window.__recording = true;
    requestAnimationFrame(rec);
  };
  window.__stopFrames = () => {
    window.__recording = false;
    const s = [...window.__frames].sort((a, b) => a - b);
    const at = (q) => Math.round(s[Math.min(s.length - 1, Math.floor(s.length * q))]);
    return {
      frames: s.length,
      median: at(0.5),
      p95: at(0.95),
      worst: s.length ? Math.round(s[s.length - 1]) : 0,
      over32ms: s.filter((x) => x > 32).length,
    };
  };
`;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox'],
    protocolTimeout: 240000,
  });
  const page = await browser.newPage();
  const cdp = await page.target().createCDPSession();
  await cdp.send('Performance.enable');
  await page.setViewport({ width: 1453, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.addScriptTag({ content: FRAME_HELPER });
  await new Promise((r) => setTimeout(r, 1500));

  const result = { label: LABEL, nodes: await page.evaluate(() => document.querySelectorAll('*').length) };

  // ---------- scroll with 24 cards
  let m0 = toMap((await cdp.send('Performance.getMetrics')).metrics);
  let frames = await page.evaluate(async () => {
    window.__startFrames();
    for (let pass = 0; pass < 2; pass++) {
      for (let y = 0; y < 4600; y += 80) {
        window.scrollTo(0, y);
        await new Promise((r) => requestAnimationFrame(r));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => requestAnimationFrame(r));
    }
    return window.__stopFrames();
  });
  let m1 = toMap((await cdp.send('Performance.getMetrics')).metrics);
  result.scroll = { frames, cpu: diff(m0, m1) };

  // ---------- theme switch (dark -> light)
  m0 = toMap((await cdp.send('Performance.getMetrics')).metrics);
  const themeFrames = await page.evaluate(async () => {
    window.__startFrames();
    const btn = Array.from(document.querySelectorAll('header button')).find((x) => /Ночь|День/i.test(x.innerText));
    if (btn) btn.click();
    await new Promise((r) => setTimeout(r, 1200));
    return window.__stopFrames();
  });
  m1 = toMap((await cdp.send('Performance.getMetrics')).metrics);
  result.themeSwitch = { frames: themeFrames, cpu: diff(m0, m1) };

  // ---------- open detail modal (the heavy one)
  m0 = toMap((await cdp.send('Performance.getMetrics')).metrics);
  const modalFrames = await page.evaluate(async () => {
    window.__startFrames();
    const btn = Array.from(document.querySelectorAll('article button')).find((b) => /Техкарта/i.test(b.innerText));
    const t0 = performance.now();
    if (btn) btn.click();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const openMs = Math.round(performance.now() - t0);
    await new Promise((r) => setTimeout(r, 1000));
    return { openMs, ...window.__stopFrames() };
  });
  m1 = toMap((await cdp.send('Performance.getMetrics')).metrics);
  result.modalOpen = { frames: modalFrames, cpu: diff(m0, m1) };

  // close modal
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('dialog button')).find((x) => x.getAttribute('aria-label') === 'Закрыть' || /×|✕/i.test(x.innerText));
    if (b) b.click();
    const d = document.querySelector('dialog');
    if (d && d.open) d.close();
  });
  await new Promise((r) => setTimeout(r, 400));

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
