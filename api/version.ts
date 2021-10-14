import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";
import { VercelRequest, VercelResponse } from "@vercel/node";

module.exports = async (req: VercelRequest, res: VercelResponse) => {
  const browser: puppeteer.Browser = await puppeteer.launch({
    args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath,
    ignoreHTTPSErrors: true,
  });
  const userAgent: string = await browser.userAgent();
  await browser.close();
  res.statusCode = 200;
  res.json({
    version: userAgent.toString(),
  });
  res.end();
};
