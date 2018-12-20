const puppeteer = require('puppeteer');
const CREDS = require('./creds');

async function run() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    // dom element selectors
    const USERNAME_SELECTOR = 'input.oknf-input.login2017-fields-field-input.login2017-username';
    const PASSWORD_SELECTOR = 'input.oknf-input.login2017-fields-field-input.login2017-password';
    const BUTTON_SELECTOR = 'input.login2017-actions-button';
    const doubletake = 'https://www.okcupid.com/doubletake';


    await page.goto('https://okcupid.com/login');
    await page.screenshot({ path: 'screenshots/okc.png' });

    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);

    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);

    await page.click(BUTTON_SELECTOR);

    await page.waitForNavigation();

    await page.goto(doubletake);
    await page.waitForNavigation();
    // await page.waitFor(5*1000);




    browser.close();
}

run();