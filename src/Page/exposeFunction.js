(async () => {
  try {
    const puppeteer = require('puppeteer');
    const fs = require('fs');

    const browser = await puppeteer.launch({
      headless: false,
      devtools: true
    })

    const page = await browser.newPage();
    await page.exposeFunction('readfile', async filePath => {
      return new Promise((resolve, reject) => {
        resolve(__dirname);
        // fs.readFile(filePath, 'utf8', (err, text) => {
        //   if (err) {
        //     reject(err);
        //   } else {
        //     resolve(text);
        //   }
        // })
      })
    })
    const dirname = await page.evaluate(async () => {
      const path = await window.readfile();
      return Promise.resolve(path);
    })
    console.log('dirname', dirname);
    await page.goto('http://localhost:3001');
  } catch(error) {
    throw Error(error);
  }
})()