import { Browser, Page, chromium } from 'playwright';

const browserPromise = chromium.launch({
  headless: true,
  timeout: 0,
});
const pagePromise = browserPromise.then((browser: Browser) =>
  browser.newPage()
);
const runInBrowser = async <T>(
  func: (browser: Browser, page: Page) => Promise<T>
) => {
  const browser = await browserPromise;
  const page = await pagePromise;
  return func.apply(undefined, [browser, page]);
};

export default runInBrowser;
