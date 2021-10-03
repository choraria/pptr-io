const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");

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
    
    await page.setViewport({
      width: 1280,
      height: 1024,
      deviceScaleFactor: 1,
    });

    await page.goto(url, {
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
