(async () => {
  try {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      slowMo: 800
    })
    const page = await browser.newPage();
    await page.goto('http://localhost:3001');
    const keyboard = await page.$('#keyboard');

    const boundingBox = await keyboard.boundingBox();
    console.log(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);

    const boxModel = await keyboard.boxModel();
    console.log(boxModel);
  } catch (error) {
    throw Error(error);
  }
})()