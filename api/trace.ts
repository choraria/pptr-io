import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";
import fs from "fs";
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
    const trace: string = `/tmp/trace-${new URL(url).hostname}.json`;
    await page.tracing.start({ path: trace, screenshots: true });

    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    await page.tracing.stop();

    await browser.close();

    res.statusCode = 200;
    const rs: fs.ReadStream = fs.createReadStream(trace);
    res.setHeader("Content-Type", `application/json`);
    res.setHeader("Content-Disposition", `attachment; ${trace}`);
    rs.pipe(res);
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.json({
      error: err.toString(),
    });
    res.end();
  }
};
