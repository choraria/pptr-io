const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");
const url = require('url');

module.exports = async (req, res) => {
  try {

    let urlToScreenshot;;
    try {
      urlToScreenshot = new URL({ toString: () => req.query.url });
    } catch (e) {
      res.statusCode = 400;
      res.json({
        error: "Invalid URL"
      });
    }

    const browser = await puppeteer.launch({
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    await page.goto(urlToScreenshot, {
      waitUntil: 'networkidle2',
    });
    const file = await page.screenshot({
      type: "png",
    });
    await browser.close();

    res.statusCode = 200;
    res.setHeader("Content-Type", `image/png`);
    res.end(file);
    
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.json({
      error: err.toString(),
    });
  }
};
