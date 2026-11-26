const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testAll() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080 });

  const artifactDir = 'C:\\Users\\Diana\\.gemini\\antigravity\\brain\\440a2f15-881f-4a44-8d90-5231f5dc3345\\screenshots';
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // 1. Open Sonata EF modal
  console.log('Searching for Sonata EF...');
  await page.type('input[placeholder*="Поиск по марке"]', 'Sonata EF');
  await new Promise(r => setTimeout(r, 400));

  console.log('Opening Sonata EF detail modal...');
  const cardBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('article button')).find(b => b.innerText.includes('Техкарта авто'));
  });
  if (cardBtn && cardBtn.asElement()) {
    await cardBtn.asElement().click();
    await new Promise(r => setTimeout(r, 600));

    // Switch to "ГРМ и навесные ремни" tab
    console.log('Switching to Timing & Belts tab...');
    await page.evaluate(() => {
      const tab = Array.from(document.querySelectorAll('dialog button')).find(b => b.innerText.includes('ГРМ и навесные'));
      if (tab) tab.click();
    });
    await new Promise(r => setTimeout(r, 500));

    const timingModalPath = path.join(artifactDir, 'screenshot-timing-belts-modal.png');
    await page.screenshot({ path: timingModalPath });
    console.log('Timing & Belts modal screenshot saved:', timingModalPath);

    // Switch to "Дворники & Крепления" tab
    console.log('Switching to Wipers tab in modal...');
    await page.evaluate(() => {
      const tab = Array.from(document.querySelectorAll('dialog button')).find(b => b.innerText.includes('Дворники'));
      if (tab) tab.click();
    });
    await new Promise(r => setTimeout(r, 500));

    const wipersModalPath = path.join(artifactDir, 'screenshot-wipers-modal.png');
    await page.screenshot({ path: wipersModalPath });
    console.log('Wipers modal screenshot saved:', wipersModalPath);

    // Open Wiper Mounts catalog
    console.log('Opening Wiper Mounts catalog...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('dialog button')).find(b => b.innerText.includes('Все крепления'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    const mountsCatalogPath = path.join(artifactDir, 'screenshot-mounts-catalog.png');
    await page.screenshot({ path: mountsCatalogPath });
    console.log('Mounts catalog screenshot saved:', mountsCatalogPath);

    // Close Wiper Catalog
    await page.evaluate(() => {
      const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Понятно'));
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 300));

    // Close main modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('dialog button[title*="Закрыть"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));
  }

  // 2. Clear search
  await page.evaluate(() => {
    const clearBtn = document.querySelector('button[title="Очистить"]');
    if (clearBtn) clearBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));

  // 3. Switch to Table View (testing larger size and no overlapping actions)
  console.log('Switching to Table View...');
  await page.evaluate(() => {
    const tableBtn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Таблица'));
    if (tableBtn) tableBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const tablePath = path.join(artifactDir, 'screenshot-table-enlarged.png');
  await page.screenshot({ path: tablePath });
  console.log('Enlarged Table View screenshot saved:', tablePath);

  // 4. Test Day Mode (Light Theme) in Table View
  console.log('Switching to Light Mode in Table View...');
  await page.evaluate(() => {
    const themeBtn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('День') || b.innerText.includes('Ночь'));
    if (themeBtn) themeBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const lightTablePath = path.join(artifactDir, 'screenshot-light-table.png');
  await page.screenshot({ path: lightTablePath });
  console.log('Light Mode Table View screenshot saved:', lightTablePath);

  // 5. Light Mode in Grid View
  console.log('Switching to Grid View in Light Mode...');
  await page.evaluate(() => {
    const gridBtn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Карточки'));
    if (gridBtn) gridBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const lightGridPath = path.join(artifactDir, 'screenshot-light-grid.png');
  await page.screenshot({ path: lightGridPath });
  console.log('Light Mode Grid View screenshot saved:', lightGridPath);

  // 6. Light Mode in Car Detail Modal
  console.log('Opening Car Detail Modal in Light Mode...');
  const firstCarBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('article button')).find(b => b.innerText.includes('Техкарта авто'));
  });
  if (firstCarBtn && firstCarBtn.asElement()) {
    await firstCarBtn.asElement().click();
    await new Promise(r => setTimeout(r, 600));

    const lightModalPath = path.join(artifactDir, 'screenshot-light-modal.png');
    await page.screenshot({ path: lightModalPath });
    console.log('Light Mode Modal screenshot saved:', lightModalPath);
  }

  await browser.close();
  console.log('All tests completed successfully!');
}

testAll().catch(err => {
  console.error('Error during testing:', err);
  process.exit(1);
});
