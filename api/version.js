module.exports = async (req, res) => {
  const browser = res.locals.browser;
  const userAgent = await browser.userAgent();
  await browser.close();
  res.statusCode = 200;
  res.json({
    version: userAgent.toString(),
  });
}
