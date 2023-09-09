import { Page, chromium } from 'playwright';

const runInBrowser = async <T>(func: (page: Page) => Promise<T>) => {
  const browser = await chromium.launch({ headless: false });
  try {
    const page = await browser.newPage();
    return await func.apply(undefined, [page]);
  } finally {
    await browser.close();
  }
};

export default runInBrowser;
