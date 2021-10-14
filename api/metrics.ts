import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";
import { VercelRequest, VercelResponse } from "@vercel/node";

module.exports = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    const url = req.query.url as string;

    const browser: puppeteer.Browser = await puppeteer.launch({
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      ignoreHTTPSErrors: true,
    });
    const page: puppeteer.Page = await browser.newPage();

    await page.goto(url);
    const metrics: puppeteer.Metrics = await page.metrics();
    await browser.close();

    res.statusCode = 200;
    res.setHeader("Content-Type", `application/json`);
    res.end(JSON.stringify(metrics));
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.json({
      error: err.toString(),
    });
    res.end();
  }
};
