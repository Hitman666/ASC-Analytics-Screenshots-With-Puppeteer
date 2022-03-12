const ACCOUNT = 'your.email@address.com';
const PASSWORD = 'YourVeryMuchSuperStrongPa$$word';
const LOGIN_FRAME = '#aid-auth-widget-iFrame';
const ASC_URL = 'https://appstoreconnect.apple.com/';
const ANALYTICS_URL = 'https://appstoreconnect.apple.com/analytics';
const APP_CRASHES_URL = 'theSpecificUrlToYourSpecificApp'; //figure this out by copying the URL manually

const puppeteer = require('puppeteer');
const readline = require('readline');

const log = (msg) => {
    console.log(msg);
}

const clickSignInButton = async (frame) => {
    log('Clicked the Sign In button');

    const element = await frame.waitForSelector(
        '#stepEl > sign-in > #signin > .container > #sign-in:not(disabled)'
    );

    await element.click();
};

const clickTrustBrowser = async (frame) => {
    log('Clicked the Trust Browser button');
    
    const selector = 'button.trust-browser';
    const element = await frame.waitForSelector(selector);
    await element.click();
};

const askForVerificationCode = () => {
    log('Asking for verification code');
  
    const readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => {
        readlineInterface.question(
            'Please enter your code: ',
            answer => {
                console.log(`Thanks, you entered: ${answer}`);
                readlineInterface.close();
                resolve(answer);
            }
    );
  });
};

const login = async (page, user, password) => {
    log('Login page');
    const frameElement = await page.$(LOGIN_FRAME);
    if (!frameElement) {
        throw new Error(`Missing frame ${LOGIN_FRAME}`);
    }

    const frame = await frameElement.contentFrame();
    if (!frame) {
        throw new Error(`Missing frame ${LOGIN_FRAME}`);
    }

    const ACCOUNTInputSelector = '#account_name_text_field';
    await frame.waitForSelector(ACCOUNTInputSelector);

    await frame.focus(ACCOUNTInputSelector);
    await page.keyboard.type(user);

    await clickSignInButton(frame);

    const passwordInputSelector = '#password_text_field';
    await frame.waitForSelector(passwordInputSelector);
    await frame.waitForTimeout(2000);

    await frame.focus(passwordInputSelector);
    await page.keyboard.type(password);
    await clickSignInButton(frame);

    const verifyDeviceSelector = 'verify-phone';
    await frame.waitForSelector(`${verifyDeviceSelector}`);
    const isVerifyDevice = await frame.$(verifyDeviceSelector);
    
    if (isVerifyDevice) {
        log('Verify phone step');
        const verificationCode = await askForVerificationCode();
        await page.keyboard.type(verificationCode);
        await clickTrustBrowser(frame);
    }
};

const main = async () => {
    const browser = await puppeteer.launch({
        // set this to false if you want to open a browser instance and see what your
        // script is doing, where it's clicking, what it's filling out, etc.
        headless: false 
    });

    const page = await browser.newPage();
    await page.setViewport({
        // settings for my personal need, set this as you wish
        width: 1440,
        height: 815,
        deviceScaleFactor: 1,
    });
    
    log(`Oppening ${ASC_URL}`);
    await page.goto(ASC_URL);
  
    await page.waitForSelector(`${LOGIN_FRAME}`);
    await login(page, ACCOUNT, PASSWORD);

    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.waitForSelector('.main-nav-label');

    await page.goto(`${ANALYTICS_URL}`);
    await page.goto(`${APP_CRASHES_URL}`);

    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.waitForSelector('#appanalytics');
    // sometimes the selector will load, but not the whole content, so you may
    // want to play with the waitForTimeout. The argument is in mili seconds
    //await page.waitForTimeout(5000); 

    await page.screenshot({ path: 'app_analytics_crashes.png' });
  
    log('Closing the browser page');
    await browser.close();
};

main().catch(error => console.error(error));