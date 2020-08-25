const puppeteer = require('puppeteer');

try {
  (async () => {
    // return promise instanceof Browser
    const browser = await puppeteer.launch({
      timeout: 0,
      headless: false
    });

    // 当 Puppeteer 从 Chromium 实例断开连接时触发。
    browser.on('disconnected', ev => {
      console.info('Browser has disconnected!');
      // console.log(ev); // undefined
    })

    // 当目标的 url 改变时被触发
    browser.on('targetChanged', ev => {
      console.info('Browser\'s target was changed!');
      // console.log(ev);
    })

    // 当目标被创建时触发，e.g window.open browser.newPage
    browser.on('targetcreated', ev => {
      console.info('Browser created a new target!');
      // console.log(ev); // browser.target()
    })

    browser.on('targetdestroyed', ev => {
      console.info('Browser was destroyed!');
      // console.log(ev); // browser.target()
    })

    const page = await browser.newPage();

    await page.goto('https://www.baidu.com');

    const wsPoint = browser.wsEndpoint();

    console.log('get the browserContext');
    console.log(browser.browserContexts());

    browser.disconnect();

    const browser2 = await puppeteer.connect({
      browserWSEndpoint: wsPoint
    })

    // 当 Puppeteer 从 Chromium 实例断开连接时触发。
    browser2.on('disconnected', ev => {
      console.info('Browser2 has disconnected!');
      // console.log(ev); // undefined
    })

    // 当目标的 url 改变时被触发
    browser2.on('targetChanged', ev => {
      console.info('Browser2\'s target was changed!');
      // console.log(ev);
    })

    // 当目标被创建时触发，e.g window.open browser.newPage
    browser2.on('targetcreated', ev => {
      console.info('Browser2 created a new target!');
      // console.log(ev); // browser.target()
    })

    browser2.on('targetdestroyed', ev => {
      console.info('Browser2 was destroyed!');
      // console.log(ev); // browser.target()
    })

    const page2 = await browser2.newPage();

    await page2.goto('https://www.npmjs.com');

    page2.close();
  })()
} catch (err) {
  console.warn('Puppeteer Launch Error!');
  throw Error(err);
}