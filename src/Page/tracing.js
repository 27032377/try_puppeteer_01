(async () => {
  try {
    const path = require('path');
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      slowMo: 800
    })
    const page = await browser.newPage();

    await page.tracing.start({
      path: path.resolve(__dirname, './json/trace.json')
    })
    await page.goto('http://localhost:3001');
    await page.tracing.stop();
  } catch (error) {
    throw Error(error);
  }
})()