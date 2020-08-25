(async () => {
  try {
    const path = require('path');
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({
      headless: false,
      devtools: true
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3001');

    // 向页面中添加 script，返回的是该 Elementhandler
    await page.addScriptTag({
      path: path.resolve(__dirname, './js/addScript.js')
    })

    // 获取元素
    // const potBtn = await page.$('#post');
    // await potBtn.tap();

    // 点击元素
    await page.click('#post');
  } catch (err) {
    throw Error(err);
  }
})()