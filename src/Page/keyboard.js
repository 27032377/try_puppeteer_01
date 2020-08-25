(async () => {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    slowMo: 1200
  })
  const page = await browser.newPage();
  await page.goto('http://localhost:3001');
  await page.focus('#keyboard');
  await page.keyboard.type('Hello World');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.up('Space');
  await page.keyboard.sendCharacter('keyboard emulate!');
  await page.keyboard.down('Backspace');
})()