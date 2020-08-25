(async () => {
  try {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://www.baidu.com');
    const ignContext = await browser.createIncognitoBrowserContext();
    const ignPage = await ignContext.newPage();
    await ignPage.goto('https://www.npmjs.com');
    console.log(await browser.pages());
    console.log('---------');
    console.log(browser.process());
  } catch (err) {
    console.warn('catch the error!');
    throw Error(err);
  }
})()