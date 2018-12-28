const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const CREDS = require('./creds');
const app = express();
const port = process.env.PORT || 5000;
var okcUser = '';
var pwd = '';
var msg = '';

var okc = async function(body) {
    // p = decodeURIComponent(p);
    // return p;
    console.log(body);
    okcUser = body.postUser;
    pwd = body.postP;
    msg = body.postMsg;
    try {
        console.log("Entering  okc fun....");
        // var p = parseP(req.query.p);
        const browser = await puppeteer.launch({
            // headless: false,
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
        await page.keyboard.type(pwd);

        await page.click(BUTTON_SELECTOR);

        // await page.waitForNavigation();
        await page.waitFor(3*1000);

        await page.click(doubletake)
            .catch((e) => console.log('err: ' + e));
        // await page.waitForNavigation();
        for (i = 0; i < 200; i++) {
            await page.waitFor(3*1000);

            await page.waitFor(like);
            await page.click(like);
            await page.waitFor(2*1000);

            await page.click(likedProf);
            await page.waitFor(3*1000);

            let pages = await browser.pages();

            await pages[2].waitFor(msgBtn);
            await pages[2].click(msgBtn);
            await pages[2].waitFor(2*1000);

            await pages[2].waitFor(msgBox);
            await pages[2].type(msgBox, CREDS.msg, {delay: 20});
            await pages[2].waitFor(1*1000);

            await pages[2].click(send);
            await pages[2].waitFor(3*1000);

            await pages[2].click(closeBtn);
            await pages[2].waitFor(1000);

            await pages[2].close();
            console.log("count: "+ i);

        }
        browser.close();
        return { hello: "world" };
        // res.send({ hello: "world" });

    } catch(err){
        console.log("Exiting  okc fun.... with error");
        console.log ("error: ", err);
        return { hello: "world with error" };
    }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});
app.post('/api/world', (req, res) => {
    console.log(req.body);
    okcUser = req.body.postUser;
    pwd = req.body.postP;
    msg = req.body.postMsg;

    res.send(
        `I received your POST request. This is what you sent me: ${okcUser}` +
        `I received your POST request. This is what you sent me: ${req.body.postP}` +
        `I received your POST request. This is what you sent me: ${req.body.postMsg}`,
    );
});

app.post('/okc', function(req, res) {
    console.log("Entering  okc get API call....");
    var ok = okc(req.body);
    console.log("Exiting  okc get API call....");
    res.send("Okc called");

});

app.listen(port, () => console.log(`Listening on port ${port}`));