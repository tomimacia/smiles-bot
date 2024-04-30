export const waitAndClick = async (page, selector, time) => {
  await page.waitForSelector(selector, { timeout: time });
  await page.click(selector);
};
export const delay = (time) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
};
