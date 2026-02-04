const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 1400, height: 800 });
  await page.goto('http://localhost:3001/og-test', { waitUntil: 'networkidle0' });

  // Wait for fonts to load
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 1000));

  // Find the OG image container and screenshot it
  const element = await page.$('div[style*="width: 1200"]');
  if (element) {
    await element.screenshot({ path: 'public/og-image.png' });
    console.log('Saved to public/og-image.png');
  } else {
    // Fallback: clip specific area
    await page.screenshot({
      path: 'public/og-image.png',
      clip: { x: 100, y: 40, width: 1200, height: 630 }
    });
    console.log('Saved to public/og-image.png (clipped)');
  }

  await browser.close();
})();
