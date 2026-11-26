const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080 });

  const artifactDir = 'C:\\Users\\Diana\\.gemini\\antigravity\\brain\\440a2f15-881f-4a44-8d90-5231f5dc3345\\screenshots';

  console.log('Navigating to http://localhost:5173 (Dark Mode)...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Open Lada Vesta NG modal in Dark Mode
  console.log('Opening Lada Vesta NG in Dark Mode...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('article button')).filter(b => b.innerText.includes('Техкарта'));
    if (btns[3]) btns[3].click();
  });
  await new Promise(r => setTimeout(r, 700));

  // Switch to Timing in Dark Mode
  await page.evaluate(() => {
    const tab = Array.from(document.querySelectorAll('dialog button')).find(b => b.innerText.includes('ГРМ и навесные'));
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const timingDarkPath = path.join(artifactDir, 'screenshot-timing-dark-fixed.png');
  await page.screenshot({ path: timingDarkPath });
  console.log('Dark Mode Timing screenshot saved:', timingDarkPath);

  await browser.close();
  console.log('Dark mode verification complete!');
})();
