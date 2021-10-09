const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");
const fs = require("fs");

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
    const trace = `/tmp/trace-${url.hostname}.json`;
    await page.tracing.start({ path: trace, screenshots: true });

    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    await page.tracing.stop();

    await browser.close();

    res.statusCode = 200;
    const rs = fs.createReadStream(trace);
    res.setHeader("Content-Type", `application/json`);
    res.setHeader("Content-Disposition", `attachment; ${trace}`);
    rs.pipe(res);
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.json({
      error: err.toString(),
    });
  }
};
