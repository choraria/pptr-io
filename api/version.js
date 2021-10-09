const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");

module.exports = async (req, res) => {
  const browser = await puppeteer.launch({
    args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath,
    ignoreHTTPSErrors: true,
  });
  const userAgent = await browser.userAgent();
  await browser.close();
  res.statusCode = 200;
  res.json({
    version: userAgent.toString(),
  });
}
