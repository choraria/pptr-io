import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";
import { VercelRequest, VercelResponse } from "@vercel/node";

const ALLOWED_FORMATS = ["Letter", "Legal", "Tabloid", "Ledger", "A0", "A1", "A2", "A3", "A4", "A5", "A6"] as const;
type ALLOWED_FORMAT = typeof ALLOWED_FORMATS[number];
const ALLOWED_UNITS = ["px", "in", "cm", "mm"] as const;
type ALLOWED_UNIT = typeof ALLOWED_UNITS[number];

module.exports = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    const url = req.query.url as string;

    const scale: number = req.query.scale ? (Number(req.query.scale) <= 2 && Number(req.query.scale) >= 0.1 ? Number(req.query.scale) : 1) : 1;
    const landscape: boolean = req.query.landscape ? (req.query.landscape.toString().toLowerCase() === "true" ? true : false) : false;
    const format: ALLOWED_FORMAT | undefined = ALLOWED_FORMATS.includes(req.query.format?.toString?.() as ALLOWED_FORMAT) ? req.query.format?.toString?.() as ALLOWED_FORMAT : undefined;

    const requestWidth: string | undefined = req.query.width?.toString?.();
    const widthRaw: string[] = requestWidth?.split(/([0-9.]+)/)?.filter((s) => s !== "");
    let width: string | number;
    if (widthRaw?.length === 1 && Number(widthRaw[0])) {
      width = Number(widthRaw[0]);
    } else if (widthRaw?.length === 2 && Number(widthRaw[0]) && ALLOWED_UNITS.includes((widthRaw[1].toLowerCase()) as ALLOWED_UNIT)) {
      width = widthRaw.join("").toLowerCase();
    }
    const requestHeight: string | undefined = req.query.height?.toString?.();
    const heightRaw: string[] = requestHeight?.split(/([0-9.]+)/)?.filter((s) => s !== "");
    let height: number | string;
    if (heightRaw?.length === 1 && Number(heightRaw?.[0])) {
      height = Number(heightRaw[0]);
    } else if (heightRaw?.length === 2 && Number(heightRaw[0]) && ALLOWED_UNITS.includes((heightRaw[1].toLowerCase()) as ALLOWED_UNIT)) {
      height = heightRaw.join("").toLowerCase();
    }

    const browser: puppeteer.Browser = await puppeteer.launch({
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      ignoreHTTPSErrors: true,
    });
    const page: puppeteer.Page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      pageRanges: "1",
      printBackground: true,
      landscape: landscape,
      format: (!format && !width && !height ? "Letter" : format) as puppeteer.PaperFormat,
      height: height,
      width: width,
      scale: scale,
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
