const puppeteer = require('puppeteer-core');

async function benchmark() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080 });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Rapid continuous scroll up and down loop (simulating vigorous user mouse-wheel scrolling)
  console.log('Starting 20-step continuous rapid scroll benchmark...');
  const tStart = Date.now();
  
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 16)); // 1 frame
  }
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => window.scrollBy({ top: -300, behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 16)); // 1 frame
  }

  const totalTime = Date.now() - tStart;
  console.log(`20 rapid scroll steps completed in ${totalTime}ms (avg per step: ${(totalTime / 20).toFixed(1)}ms)`);

  await browser.close();
  console.log('Benchmark completed successfully!');
}

benchmark().catch(err => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
