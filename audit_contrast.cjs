const puppeteer = require('puppeteer-core');

const URL = process.env.URL || 'http://localhost:5174';

function audit(page) {
  return page.evaluate(() => {
    const parse = (c) => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1].split(',').map((x) => parseFloat(x.trim()));
      return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    };
    const blend = (top, bottom) => ({
      r: top.r * top.a + bottom.r * (1 - top.a),
      g: top.g * top.a + bottom.g * (1 - top.a),
      b: top.b * top.a + bottom.b * (1 - top.a),
      a: 1,
    });
    const lum = (c) => {
      const f = (v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
    };
    const ratio = (a, b) => {
      const l1 = lum(a), l2 = lum(b);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };

    const effectiveBg = (el) => {
      let node = el;
      let acc = null;
      while (node && node !== document.documentElement) {
        const cs = getComputedStyle(node);
        const c = parse(cs.backgroundColor);
        if (c && c.a > 0) {
          acc = acc ? blend(acc, c) : c;
          if (acc.a >= 1) return acc;
        }
        node = node.parentElement;
      }
      const bodyBg = parse(getComputedStyle(document.body).backgroundColor);
      return acc && bodyBg ? blend(acc, bodyBg) : bodyBg || { r: 255, g: 255, b: 255, a: 1 };
    };

    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const text = (n.textContent || '').trim();
      if (!text) continue;
      const el = n.parentElement;
      if (!el) continue;
      if (el instanceof SVGElement) continue; // SVG text is painted with fill=, not color
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue;
      if (rect.bottom < 0 || rect.top > 3000) continue;
      let color = parse(cs.color);
      if (!color) continue;
      const bg = effectiveBg(el);
      if (color.a < 1) color = blend(color, bg);
      // gradient text (bg-clip-text) -> skip
      if ((el.className || '').toString().includes('bg-clip-text')) continue;
      const r = ratio(color, bg);
      const fs = parseFloat(cs.fontSize);
      const bold = parseInt(cs.fontWeight, 10) >= 600;
      const large = fs >= 24 || (fs >= 18.66 && bold);
      const min = large ? 3 : 4.5;
      if (r < min) {
        out.push({
          text: text.slice(0, 45),
          cls: (el.className || '').toString().slice(0, 140),
          contrast: Math.round(r * 100) / 100,
          need: min,
          color: cs.color,
          bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
          fontSize: fs,
        });
      }
    }
    return out;
  });
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1453, height: 1000 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('header button')).find((x) => /Ночь|День/i.test(x.innerText));
    if (b) b.click();
  });
  await new Promise((r) => setTimeout(r, 900));
  // render full page
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0;
      const step = () => {
        window.scrollBy(0, 900);
        y += 900;
        if (y < document.body.scrollHeight + 2000) setTimeout(step, 60);
        else res();
      };
      step();
    });
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 500));

  const bad = await audit(page);
  // dedupe by cls+color
  const seen = new Set();
  const uniq = bad.filter((x) => {
    const k = x.cls + '|' + x.color + '|' + x.bg;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  console.log('total low-contrast text nodes: ' + bad.length + ', unique styles: ' + uniq.length);
  uniq.sort((a, b) => a.contrast - b.contrast).slice(0, 40).forEach((x) => {
    console.log(`${x.contrast} (need ${x.need}) ${x.color} on ${x.bg} | "${x.text}" | ${x.cls}`);
  });
  await browser.close();
})();
