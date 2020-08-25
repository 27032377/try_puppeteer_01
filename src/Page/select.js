(async () => {
  try {
    const puppeteer = require('puppeteer');

    const browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      slowMo: 1000
    })

    const page = await browser.newPage();
    await page.goto('http://localhost:3001');

    page.select('select#day', 'FRI');
  } catch (error) {
    throw Error(error);
  }
})()