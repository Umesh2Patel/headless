const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://logrocket.com');
    await page.screenshot({path: 'LR.png'});

    browser.close();
})();