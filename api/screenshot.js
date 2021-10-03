let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  // running on the Vercel platform.
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  // running locally.
  puppeteer = require("puppeteer");
}

module.exports = async (req, res) => {
  try {
    const url = req.query.url;
    const browser = await puppeteer.launch({
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.goto(url);
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
