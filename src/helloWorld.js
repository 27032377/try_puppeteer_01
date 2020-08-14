const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      timeout: 60000,
      devtools: false
    });

    const page = await browser.newPage();

    await page.goto('https://www.baidu.com');

    await page.screenshot({ path: path.resolve(__dirname, 'assets/images/example.png') });

    const browserWSEndpoint = browser.wsEndpoint();

    browser.disconnect();

    const browser2 = await puppeteer.connect({
      browserWSEndpoint
    })

    const page2 = await browser2.newPage();

    await page2.goto('https://npmjs.com');

    await page2.emulateMediaType('screen');

    // page.pdf 只能在无头模式(headless: true)下运行
    await page2.pdf({ path: path.resolve(__dirname, 'assets/pdfs/example.pdf') });

    await browser2.close();

    console.log('finish');
  } catch (err) {
    console.warn('error');
    console.log(err);
  }
})()