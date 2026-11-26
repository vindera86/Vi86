const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  await page.evaluate(() => {
    const tableBtn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Таблица'));
    if (tableBtn) tableBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Scroll down so table header is clearly in view below navbar
  await page.evaluate(() => {
    window.scrollBy(0, 360);
  });
  await new Promise(r => setTimeout(r, 400));

  await page.screenshot({ path: 'C:\\Users\\Diana\\.gemini\\antigravity\\brain\\440a2f15-881f-4a44-8d90-5231f5dc3345\\screenshots\\screenshot-table-perfect.png' });
  await browser.close();
  console.log('Scrolled table screenshot saved successfully!');
})();
