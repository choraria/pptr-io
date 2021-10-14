import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";
import { VercelRequest, VercelResponse } from "@vercel/node";

const ALLOWED_FILE_TYPES = ["jpeg", "webp", "png"] as const;
type ALLOWED_FILE_TYPES = typeof ALLOWED_FILE_TYPES[number];

module.exports = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    const url = req.query.url as string;
    const fullPage: boolean = req.query.fullPage ? (req.query.fullPage.toString().toLowerCase() === "true" ? true : false) : false;
    const screenshotFileType: string = req.query.type ? req.query.type.toString?.().toLowerCase() : "png";
    const fileType: ALLOWED_FILE_TYPES = ALLOWED_FILE_TYPES.includes(screenshotFileType as ALLOWED_FILE_TYPES) ? screenshotFileType as ALLOWED_FILE_TYPES : "png";

    const browser: puppeteer.Browser = await puppeteer.launch({
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      ignoreHTTPSErrors: true,
    });
    const page: puppeteer.Page = await browser.newPage();

    await page.setViewport({
      width: Number(req.query.width) || 1920,
      height: Number(req.query.height) || 1080,
      deviceScaleFactor: Number(req.query.deviceScaleFactor) || 1,
    });

    await page.goto(url, {
      waitUntil: "networkidle0",
    });
    const file: string | void | Buffer = await page.screenshot({
      type: fileType,
      fullPage: fullPage,
    });
    await browser.close();

    res.statusCode = 200;
    res.setHeader("Content-Type", `image/${fileType}`);
    res.end(file);
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.json({
      error: err.toString(),
    });
    res.end();
  }
};
