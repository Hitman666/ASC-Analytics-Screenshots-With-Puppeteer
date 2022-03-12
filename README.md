# ASC Analytics Screenshots With Puppeteer

You can read the step by step blog originally post [on my blog](https://www.nikola-breznjak.com/blog/javascript/using-puppeteer-to-automate-screenshots-in-asc-analytics/).

## TL;DR

I was trying to automate my manual process of logging into ASC (App Store Connect) and taking a screenshot of the crashes, and preparing a report that I do weekly. This blog post explains the exact steps of how I achieved that.

## How to run this code?
- Make sure you have [Node.js](https://nodejs.org/en/) installed
- Clone this repo
- Install Puppeteer with `npm install puppeteer`
- Adjust the `apple.js` script with your credentials
- Run `node apple.js`

## Why Puppeteer?
I'm not affiliated with it in any way, and I also tried [Cypress](https://www.cypress.io/) and [CasperJS](https://www.casperjs.org/) but ran into rather weird problems during installation. Puppeteer just worked straight out of the box, and that's why I continued down that path.

## A simple example using Puppeteer

Here's a simple example to get you started; create a `google.js` file and paste this code in it:

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://google.com');
  await page.screenshot({ path: 'google-screenshot.png' });

  await browser.close();
})();
```

This script will navigate to https://google.com and save a screenshot in an image named `google-screenshot.png`.

Execute the script in the command line with: `node google.js` and you should get a PNG image of how the https://google.com page would look like in your browser:

![](https://i.imgur.com/jCUs4rU.png)

Mind you, the text you're seeing is [Croatian](https://en.wikipedia.org/wiki/Croatia), as that's my locale setting.

Looks a bit 'small', doesn't it? That's because Puppeteer sets an initial page size to `800 × 600 px`, which defines the screenshot size. The page size can be customized with [Page.setViewport()](https://github.com/puppeteer/puppeteer/blob/v13.5.1/docs/api.md#pagesetviewportviewport).

Here's the code example that's using `1920 x 1080 px` viewport size:

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  await page.goto('https://google.com');
  await page.screenshot({ path: 'google-screenshot.png' });

  await browser.close();
})();
```

Run it again with `node google.js`, and the screenshot should now look like this: 

![](https://i.imgur.com/dZqIrhR.png)

For more options (as I won't go into explaining every API call of the final code) make sure to check [their documentation](https://pptr.dev/).

## The Code™

You have the full code in the repo, and you can run it with `node apple.js`. Please make sure to edit the script with your credentials.

As noted in the blog post, this is a quick and dirty way, with lots of possible improvements ([PRs](https://github.com/Hitman666/ASC-Analytics-Screenshots-With-Puppeteer/compare) are welcome!):
- Cookie support (so you don't have to log in and insert the OTP every time)
- Typescript (for type safety, and [other benefits](https://www.google.com/search?q=why+is+typescript+better+than+javascript))

When you run this code, in the terminal you should see this output:

```
➜ node apple.js               
Oppening https://appstoreconnect.apple.com/
Login page
Clicked the Sign In button
Clicked the Sign In button
Verify phone step
Asking for verification code
Please enter your code: 866216
Thanks, you entered: 866216
Clicked the Trust Browser button
Closing the browser page
```

The OTP code to log in to Apple, in my case, was sent to me via an SMS.

The screenshot (blurred for obvious reasons), looks like this in my case:

![](https://i.imgur.com/8aO58hI.png)

## That's great, but what if my login requires CAPTCHA?
In my particular case, the login was rather simple (except for the fact that I had to select the frame and search within it for the element IDs).

But, what if your login requires you to enter the CAPTCHA? You know, those "are you human" popups that you get when logging into some website. Then I had a 'great idea' - what if you make a service where people actually read and type these CAPTCHAs for you?

> ⚠️ Now, let me be very clear - just because something is possible to do automatically, it doesn't give you the right to use that in a bad way (spammers be gone!). Do with this information what you wish, but don't come crying back saying "he made me do it".

Yes, no drumrolls needed, as almost everything today - this also already exists. CAPTCHA solving software exists and it's a thing, and I found a blog posts that reviews [10 CAPTCHA-solving software](https://prowebscraper.com/blog/top-10-captcha-solving-services-compared/).

One that caught my eye was [2captcha.com](https://2captcha.com/), and I found a [blog post](https://www.bloggersideas.com/2Captcha-Review/) that did a thorough teardown of the service. The reason that one caught my eye was that it seems that they offer their solution through libraries for most of the popular programming languages (Python, PHP, JS,Go, C#, Ruby).

### A trip down the memory lane
> Sorry for the sidetrack (and you can safely skip this section 😅), but I just remembered how, years ago, I attended a conference where Photomath's (the app that solves math problems and shows you the steps of how to solve them) CEO was talking about how they're solving the OCR problem (they supposedly had a breakthrough when they applied ML).
> 
> They built an awesome business, that's actually useful, and I saw that they recently integrated into Snapchat via their Snapchat Solver 🤯 . I digress, yes, but with that good 'tech', I see them integrated into everything and that makes me proud (since, at the time, they were a Croatian-based startup).

## Conclusion
Hope this straight-to-the-point post (with one slight detour 😅) showed you how you can make use of the amazing Puppeteer for your (legit) purposes.

Stay safe and code on 💪