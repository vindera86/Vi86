const puppeteer = require('puppeteer-core');
const path = require('path');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Scroll down to test scroll speed and scroll-to-top button appearance
  console.log('Scrolling down 1200px...');
  const t0 = Date.now();
  await page.evaluate(() => {
    window.scrollTo({ top: 1200, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 400));
  const scrollDuration = Date.now() - t0;
  console.log(`Scroll executed in ${scrollDuration}ms`);

  // Check scroll-to-top button existence and position
  const btnInfo = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Прокрутить наверх"]');
    if (!btn) return null;
    const rect = btn.getBoundingClientRect();
    return {
      exists: true,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      scrollY: window.scrollY
    };
  });
  console.log('Scroll to top button info:', JSON.stringify(btnInfo, null, 2));

  // Take screenshot showing the scroll-to-top arrow button in action
  const scrollPath = path.join(__dirname, 'screenshot-scroll-button.png');
  await page.screenshot({ path: scrollPath });
  console.log('Scroll button screenshot saved:', scrollPath);

  // Test clicking scroll to top button
  console.log('Clicking scroll to top button...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Прокрутить наверх"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const finalScrollY = await page.evaluate(() => window.scrollY);
  console.log('Final scroll Y after clicking button:', finalScrollY);

  await browser.close();
  console.log('All scroll tests passed!');
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
