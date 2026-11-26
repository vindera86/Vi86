const puppeteer = require('puppeteer-core');

const URL = process.env.URL || 'http://localhost:5173';
const OUT = 'C:/Users/Diana/Desktop/nv86-automix';

const AUDIT_FN = () => {
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
    let node = el, acc = null;
    while (node && node !== document.documentElement) {
      const c = parse(getComputedStyle(node).backgroundColor);
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
    let color = parse(cs.color);
    if (!color) continue;
    const bg = effectiveBg(el);
    if (color.a < 1) color = blend(color, bg);
    if ((el.className || '').toString().includes('bg-clip-text')) continue;
    const r = ratio(color, bg);
    const fs = parseFloat(cs.fontSize);
    const bold = parseInt(cs.fontWeight, 10) >= 600;
    const large = fs >= 24 || (fs >= 18.66 && bold);
    const min = large ? 3 : 4.5;
    if (r < min) {
      out.push({
        text: text.slice(0, 40),
        cls: (el.className || '').toString().slice(0, 120),
        contrast: Math.round(r * 100) / 100,
        need: min,
        color: cs.color,
        bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
      });
    }
  }
  return out;
};

function report(name, bad) {
  const seen = new Set();
  const uniq = bad.filter((x) => {
    const k = x.cls + '|' + x.color + '|' + x.bg;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  console.log(`\n### ${name}: ${bad.length} low-contrast nodes / ${uniq.length} unique`);
  uniq.sort((a, b) => a.contrast - b.contrast).slice(0, 12).forEach((x) => {
    console.log(`  ${x.contrast} (need ${x.need}) ${x.color} on ${x.bg} | "${x.text}" | ${x.cls}`);
  });
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1453, height: 950 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('header button')).find((x) => /Ночь|День/i.test(x.innerText));
    if (b) b.click();
  });
  await new Promise((r) => setTimeout(r, 700));

  // 1. grid cards
  await page.evaluate(() => window.scrollTo(0, 1200));
  await new Promise((r) => setTimeout(r, 700));
  report('LIGHT / cards', await page.evaluate(AUDIT_FN));
  await page.screenshot({ path: OUT + '/light-cards.png' });

  // 2. table view
  const switched = await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('header button')).find((x) => /Таблица/i.test(x.innerText));
    if (b) { b.click(); return true; }
    return false;
  });
  await new Promise((r) => setTimeout(r, 900));
  if (switched) {
    report('LIGHT / table view', await page.evaluate(AUDIT_FN));
    await page.screenshot({ path: OUT + '/light-table.png' });
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('header button')).find((x) => /Карточки/i.test(x.innerText));
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 700));
  }

  // 3. detail modal (with blueprint screens)
  const opened = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('article button')).find((b) => /Техкарта/i.test(b.innerText));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await new Promise((r) => setTimeout(r, 900));
  if (opened) {
    report('LIGHT / detail modal', await page.evaluate(AUDIT_FN));
    await page.screenshot({ path: OUT + '/light-modal.png' });

    // timing/blueprint tab if present
    await page.evaluate(() => {
      const tab = Array.from(document.querySelectorAll('dialog button')).find((b) => /ГРМ/i.test(b.innerText));
      if (tab) tab.click();
    });
    await new Promise((r) => setTimeout(r, 700));
    report('LIGHT / modal blueprint tab', await page.evaluate(AUDIT_FN));
    await page.screenshot({ path: OUT + '/light-modal-blueprint.png' });
  }

  await browser.close();
})();
