(async () => {
  try {
    const puppeteer = require('puppeteer');
    const devices = puppeteer.devices;

    // 更多设备
    // node_modules\puppeteer\lib\cjs\puppeteer\common\DeviceDescriptors.js
    const iPhone6 = devices['iPhone 6'];

    const browser = await puppeteer.launch({
      headless: false,
      devtools: true
    })

    const page = await  browser.newPage();

    // 生成 iPhone 6 模拟器
    // await page.emulate(iPhone6);

    const emulate = {
      viewport: {
        width: 1080,
        height: 2000,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        isLandscape: true
      },
      userAgent: ''
    }
    await page.emulate(emulate);
    await page.goto('https://www.baidu.com');
  } catch (err) {
    throw Error(err);
  }
})()