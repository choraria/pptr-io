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
    const trace = `/tmp/trace-${url.hostname}.json`;
    await page.tracing.start({ path: trace, screenshots: true });

    await page.goto(url, {
      waitUntil: "networkidle2",
    });

    await page.tracing.stop();

    await browser.close();

    res.statusCode = 200;
    res.setHeader("Content-Type", `application/json`);
    res.type('application/json').sendFile(trace);
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.json({
      error: err.toString(),
    });
  }
};
