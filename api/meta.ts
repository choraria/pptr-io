import puppeteer, { Page } from "puppeteer-core";
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

    const metaData: { [key: string]: string } = await page.evaluate((): { [key: string]: string } => {
      const data: { [key: string]: string } = {};
      const metaTags: NodeListOf<HTMLMetaElement> = document.querySelectorAll("meta");
      metaTags.forEach((tag: HTMLMetaElement, i: number) => {
        const key: string = tag.getAttribute('name') ? tag.getAttribute('name') : (tag.getAttribute('property') ? tag.getAttribute('property') : (tag.getAttribute('http-equiv') ? tag.getAttribute('http-equiv') : tag.getAttribute('itemprop')));
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
    res.end();
  }
};
