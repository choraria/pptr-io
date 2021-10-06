const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");

const ALLOWED_FILE_TYPES = ["jpeg", "webp", "png"];

module.exports = async (req, res) => {
  try {
    let url;
    try {
      url = new URL({ toString: () => req.query.url });
    } catch (e) {
      res.statusCode = 400;
      res.json({
        error: "Invalid URL",
      });
    }
    const fullPage =  req.query.fullPage.toString().toLowerCase() == "true" ? true : false;
    const screenshotFileType = req.query.type.toString().toLowerCase();
    const fileType = ALLOWED_FILE_TYPES.includes(screenshotFileType) ? screenshotFileType : "png";

    const browser = await puppeteer.launch({
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();

    await page.setViewport({
      width: Number(req.query.width) || 1920,
      height: Number(req.query.height) || 1080,
      deviceScaleFactor: Number(req.query.deviceScaleFactor) || 1,
    });

    await page.goto(url, {
      waitUntil: "networkidle2",
    });
    const file = await page.screenshot({
      type: fileType,
      fullPage: fullPage,
    });
    await browser.close();

    res.statusCode = 200;
    res.setHeader("Content-Type", `image/${fileType}`);
    res.end(file);
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.json({
      error: err.toString(),
    });
  }
};
