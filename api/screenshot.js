const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");
const { merge, toBoolean } = require("../helpers/helpers");

const DEFAULT_VIEWPORT = { height: 1920, width: 1080, deviceScaleFactor: 1 };
const ALLOWED_FILE_TYPES = ["jpeg", "webp", "png"];
const DEFAULT_FILE_TYPE = "png";

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
    const fullPage = toBoolean(req.query.fullPage);
    const screenshotFileType = req.query.type;
    if (screenshotFileType && !ALLOWED_FILE_TYPES.includes(screenshotFileType)) {
      res.json({
        error: "invalid file type requested",
      });
    }
    const userViewPortInputParams = {
      height: Number(req.query.height),
      width: Number(req.query.width),
      deviceScaleFactor: Number(req.query.deviceScaleFactor),
    };
    const viewPortParams = merge(DEFAULT_VIEWPORT, userViewPortInputParams);
    const browser = await puppeteer.launch({
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();

    await page.setViewport(viewPortParams);

    await page.goto(url, {
      waitUntil: "networkidle2",
    });
    const file = await page.screenshot({
      type: screenshotFileType || DEFAULT_FILE_TYPE,
      fullPage: fullPage,
    });
    await browser.close();

    res.statusCode = 200;
    res.setHeader("Content-Type", `image/${screenshotFileType || DEFAULT_FILE_TYPE}`);
    res.end(file);
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.json({
      error: err.toString(),
    });
  }
};
