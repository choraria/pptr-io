const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");

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

    const browser = await puppeteer.launch({
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();

    await page.goto(url, {
      // waitUntil: "networkidle0",
    });
    
    const metaData = await page.evaluate(() => {
        const data = {};
        const metaTags = document.querySelectorAll('meta');
        metaTags.forEach((tag, i) => {
            const key = tag.getAttribute('name') ? tag.getAttribute('name') : (tag.getAttribute('property') ? tag.getAttribute('property') : (tag.getAttribute('http-equiv') ? tag.getAttribute('http-equiv') : tag.getAttribute('itemprop')));
            tag.getAttribute('charset') ? data["charset"] = tag.getAttribute('charset') : data[key == null ? i : key] = tag.getAttribute('content');
        });
        return data;
    });    

    await browser.close();

    res.statusCode = 200;
    res.setHeader("Content-Type", `application/json`);
    res.end(JSON.stringify(metaData));
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.json({
      error: err.toString(),
    });
  }
};
