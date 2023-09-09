import { app } from 'electron';
import { Browser, Page, chromium } from 'playwright';

const browserPromise = chromium.launch({
  headless: app.isPackaged,
  timeout: 0,
});
const pagePromise = browserPromise.then((browser: Browser) =>
  browser.newPage()
);
let currentTask: null | { promise: Promise<any>; controller: AbortController } =
  null;
const runInBrowser = async <T>(
  func: (
    browser: Browser,
    page: Page,
    cancellation: AbortController
  ) => Promise<T>
) => {
  const browser = await browserPromise;
  const page = await pagePromise;
  if (currentTask) {
    currentTask.controller.abort();
    await currentTask.promise;
  }
  const controller = new AbortController();
  try {
    currentTask = {
      promise: func(browser, page, controller),
      controller,
    };
    return await currentTask.promise;
  } catch (e) {
    if (controller.signal.aborted) {
      throw e;
    }
    await page.reload();
    currentTask = {
      promise: func(browser, page, controller),
      controller,
    };
    return await currentTask.promise;
  } finally {
    currentTask = null;
  }
};

export default runInBrowser;
