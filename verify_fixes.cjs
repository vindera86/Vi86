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

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // 1. Switch to Light Mode first
  console.log('Switching to Light Mode...');
  await page.evaluate(() => {
    const themeBtn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('День') || b.innerText.includes('Ночь'));
    if (themeBtn) themeBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 2. Open Lada Vesta NG modal by clicking "Техкарта авто"
  console.log('Opening Lada Vesta NG "Техкарта авто"...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('article button')).filter(b => b.innerText.includes('Техкарта'));
    if (btns[3]) {
      btns[3].click();
    } else if (btns[0]) {
      btns[0].click();
    }
  });
  await new Promise(r => setTimeout(r, 700));

  // 3. Switch to "ГРМ и навесные ремни" tab
  console.log('Switching to Timing & Belts tab...');
  await page.evaluate(() => {
    const tab = Array.from(document.querySelectorAll('dialog button')).find(b => b.innerText.includes('ГРМ и навесные'));
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const timingLightPath = path.join(artifactDir, 'screenshot-timing-light-fixed.png');
  await page.screenshot({ path: timingLightPath });
  console.log('Fixed Timing & Belts in Light Mode screenshot saved:', timingLightPath);

  // 4. Switch to "Дворники & Крепление" tab
  console.log('Switching to Wipers tab...');
  await page.evaluate(() => {
    const tab = Array.from(document.querySelectorAll('dialog button')).find(b => b.innerText.includes('Дворники'));
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const wipersLightPath = path.join(artifactDir, 'screenshot-wipers-light-fixed.png');
  await page.screenshot({ path: wipersLightPath });
  console.log('Fixed Wipers in Light Mode screenshot saved:', wipersLightPath);

  // 5. Switch to "Свечи зажигания" tab
  console.log('Switching to Plugs tab...');
  await page.evaluate(() => {
    const tab = Array.from(document.querySelectorAll('dialog button')).find(b => b.innerText.includes('Свечи зажигания'));
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const plugsLightPath = path.join(artifactDir, 'screenshot-plugs-light-fixed.png');
  await page.screenshot({ path: plugsLightPath });
  console.log('Fixed Plugs in Light Mode screenshot saved:', plugsLightPath);

  await browser.close();
  console.log('Verification script completed!');
})();
