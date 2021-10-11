const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");

const ALLOWED_FORMATS = ["Letter", "Legal", "Tabloid", "Ledger", "A0", "A1", "A2", "A3", "A4", "A5", "A6"];
const ALLOWED_UNITS = ["px", "in", "cm", "mm"];

module.exports = async (req, res) => {
  try {
    const url = req.query.url;

    const scale = req.query.scale ? (Number(req.query.scale) <= 2 && Number(req.query.scale) >= 0.1 ? Number(req.query.scale) : 1) : 1;
    const landscape = req.query.landscape ? (req.query.landscape.toString().toLowerCase() === "true" ? true : false) : false;
    const format = ALLOWED_FORMATS.includes(req.query.format?.toString()) ? req.query.format.toString() : undefined;

    const widthRaw = req.query.width?.split(/([0-9.]+)/)?.filter(s => s !== "");
    let width;
    if(widthRaw?.length === 1 && Number(widthRaw[0])) {
      width = Number(widthRaw[0]);
    } else if(widthRaw?.length === 2 && Number(widthRaw[0]) && ALLOWED_UNITS.includes(widthRaw[1].toLowerCase())) {
      width = widthRaw.join("").toLowerCase();
    }
    
    const heightRaw = req.query.width?.split(/([0-9.]+)/)?.filter(s => s !== "");
    let height;
    if(heightRaw?.length === 1 && Number(heightRaw?.[0])) {
      height = Number(heightRaw[0]);
    } else if(heightRaw?.length === 2 && Number(heightRaw[0]) && ALLOWED_UNITS.includes(heightRaw[1].toLowerCase())) {
      height = heightRaw.join("").toLowerCase();
    }

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
      landscape: landscape,
      format: format !== undefined ? format : (!format && !width && !height ? "Letter" : undefined),
      height: height,
      width: width, 
      scale: scale
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
