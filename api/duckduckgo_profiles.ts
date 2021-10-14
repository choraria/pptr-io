import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";
import { VercelRequest, VercelResponse } from "@vercel/node";

module.exports = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    const search = req.query.search as string;
    const url: string = `https://duckduckgo.com/?q=${search}`;

    const browser: puppeteer.Browser = await puppeteer.launch({
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      ignoreHTTPSErrors: true,
    });
    const page: puppeteer.Page = await browser.newPage();

    await page.goto(url);

    const profiles: { [key: string]: string } = await page.$$eval(".about-profiles__link", (items: Element[]): { [key: string]: string } => {
      const data: { [key: string]: string } = {};
      items.forEach((item: Element): void => {
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
