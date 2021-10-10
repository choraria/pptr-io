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

    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      pageRanges: "1",
      printBackground: true,
      landscape: true,
      format: "A4",
    });
    await browser.close();

    res.statusCode = 200;
    res.setHeader("Content-Type", `application/pdf`);
    res.end(pdf);
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.json({
      error: err.toString(),
    });
    res.end();
  }
};
