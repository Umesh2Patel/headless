const puppeteer = require('puppeteer');
const CREDS = require('./creds');

async function run() {
    const browser = await puppeteer.launch({
        // headless: false
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1200, height: 800 })
    // const page = await browser.on();
    // dom element selectors
    const USERNAME_SELECTOR = 'input.oknf-input.login2017-fields-field-input.login2017-username';
    const PASSWORD_SELECTOR = 'input.oknf-input.login2017-fields-field-input.login2017-password';
    const BUTTON_SELECTOR = 'input.login2017-actions-button';
    const doubletake = '#navigation > div.nav-left > ul > li:nth-child(2) > a > span';
    const doubletakeURL = 'https://www.okcupid.com/doubletake';
    const like = 'button.cardactions-action.cardactions-action--like';
    const likedProf = '#quickmatch-wrapper > div > div > span > div > div.qm-content > div > div.qm-content-queueholder > span > div > div > span > div.qmqueue-thumb.isLiked > a > div';
    const msgBtn = '#profile_actions > div > div > span > div > div > button.profile-buttons-actions-action.profile-buttons-actions-message > span:nth-child(2)';
    // let msgBox = '.inputcontainer textarea';
    const msgBox = 'textarea.messenger-composer';
    const send = '#global_messaging_V2 > div > div > div.messenger-main-window-container > div.messenger-toolbar > button > span';
    const closeBtn1= '#global_messaging_V2 > div > div > div.messenger-user-row.messenger-main-window-user-row > button.messenger-user-row-close > span';
    const closeBtn = '#global_messaging_V2 > div > div > div.messenger-user-row.messenger-main-window-user-row > button.messenger-user-row-close';
    // const closeBtnOLD = '#global_messaging_container > div.global_messaging.initial-render.no_messages > div.header.old_template > div.controls > button.close > i';



    await page.goto('https://okcupid.com/login');
    await page.screenshot({ path: 'screenshots/okc.png' });

    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);

    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);

    await page.click(BUTTON_SELECTOR);

    // await page.waitForNavigation();
    await page.waitFor(2*1000);

    await page.click(doubletake);
    // await page.waitForNavigation();
    for (i = 0; i < 200; i++) {
        await page.waitFor(2*1000);

        await page.click(like);
        await page.waitFor(2*1000);

        await page.click(likedProf);
        await page.waitFor(2*1000);

        let pages = await browser.pages();

        await pages[2].click(msgBtn);
        await pages[2].waitFor(1000);

        await pages[2].type(msgBox, CREDS.msg, {delay: 20});
        await pages[2].waitFor(1*1000);

        await pages[2].click(send);
        await pages[2].waitFor(3*1000);

        await pages[2].click(closeBtn);
        await pages[2].waitFor(1000);

        await pages[2].close();
        console.log("count"+ i);

    }
















    /*const aHandle0 = await pages[0].evaluateHandle(() => document.URL);
    const aHandle1 = await pages[1].evaluateHandle(() => document.URL);
    const aHandle2 = await pages[2].evaluateHandle(() => document.URL);*/


    /*await pages[1].evaluate( () => { /!* ... *!/ document.URL} );
    await pages[2].evaluate( () => { /!* ... *!/
        document.URL;
        page.click(msgBtn);
        page.waitFor(3*1000);
    } );*/

    /*async function changePage(url) {
        let pages = await browser.pages();
        let foundPage;
        for(let i = 0; i < pages.length; i += 1) {
            if(pages[i].url() === url) {
                foundPage = pages[i];//return the new working page
                break;
            }
        }
        return foundPage;
    }*/



    browser.close();
}

run();