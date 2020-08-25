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
    await page.type('#input', 'Hello World');
  } catch (error) {
    throw Error(error);
  }
})()