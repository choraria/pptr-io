const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");

module.exports = async (req, res) => {
  try {
    const username = req.query.username;

    const browser = await puppeteer.launch({
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    const url = `https://www.instagram.com/${username}/?__a=1`;

    await page.goto(url);

    const data = await page.content();

    await browser.close();

    res.statusCode = 200;
    res.setHeader("Content-Type", `application/json`);
    res.end(JSON.stringify(data));
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.json({
      error: err.toString(),
    });
    res.end();
  }
};
