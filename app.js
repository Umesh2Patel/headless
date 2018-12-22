const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 8080;
const validUrl = require('valid-url');
const CREDS = require('./creds');

var parseUrl = function(url) {
    url = decodeURIComponent(url);
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = 'http://' + url;
    }

    return url;
};

var parseP = function(p) {
    p = decodeURIComponent(p);
    return p;
};

app.get('/', function(req, res) {
    var urlToScreenshot = parseUrl(req.query.url);

    if (validUrl.isWebUri(urlToScreenshot)) {
        console.log('Screenshotting: ' + urlToScreenshot);
        (async() => {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.goto(urlToScreenshot);
            await page.screenshot().then(function(buffer) {
                res.setHeader('Content-Disposition', 'attachment;filename="' + urlToScreenshot + '.png"');
                res.setHeader('Content-Type', 'image/png');
                res.send(buffer)
            });

            await browser.close();
        })();
    } else {
        res.send('Invalid url: ' + urlToScreenshot);
    }

});

app.get('/okc', async function(req, res) {
    try {

        var p = parseP(req.query.p);
        const browser = await puppeteer.launch({
            // headless: false
            args: ['--no-sandbox', '--disable-setuid-sandbox']
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
        await page.keyboard.type(p);

        await page.click(BUTTON_SELECTOR);

        // await page.waitForNavigation();
        await page.waitFor(3*1000);

        await page.click(doubletake)
            .catch((e) => console.log('err: ' + e));
        // await page.waitForNavigation();
        for (i = 0; i < 200; i++) {
            await page.waitFor(3*1000);

            await page.click(like);
            await page.waitFor(2*1000);

            await page.click(likedProf);
            await page.waitFor(3*1000);

            let pages = await browser.pages();

            await pages[2].waitFor(msgBtn);
            await pages[2].click(msgBtn);
            await pages[2].waitFor(1000);

            await pages[2].waitFor(msgBox);
            await pages[2].type(msgBox, CREDS.msg, {delay: 20});
            await pages[2].waitFor(1*1000);

            await pages[2].click(send);
            await pages[2].waitFor(3*1000);

            await pages[2].click(closeBtn);
            await pages[2].waitFor(1000);

            await pages[2].close();
            console.log("count"+ i);

        }
        browser.close();
        res.send({ hello: "world" });

    } catch(err){
        console.log ("error: ", err)
    }

});

const server = app.listen(process.env.PORT || 8080, err => {
    if (err) return console.error(err);
    const port = server.address().port;
    console.info(`App listening on port ${port}`);
});