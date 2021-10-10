const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");

module.exports = async (req, res) => {
  try {
    const search = req.query.search;
    const url = `https://duckduckgo.com/?q=${search}`;

    const browser = await puppeteer.launch({
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();

    await page.goto(url);

    const profiles = await page.$$eval(".about-profiles__link", (items) => {
      const data = {};
      items.forEach((item) => {
        data[item.getAttribute("title")] = item.getAttribute("href");
      });
      return Object.keys(data).length !== 0 ? data : { message: "No profiles found" };
    });

    await browser.close();

    res.statusCode = 200;
    res.setHeader("Content-Type", `application/json`);
    res.end(JSON.stringify(profiles));
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.json({
      error: err.toString(),
    });
    res.end();
  }
};
