import { Browser, chromium } from 'playwright';

const runInBrowser = async <T>(func: (browser: Browser) => Promise<T>) => {
  const browser = await chromium.launch({ headless: true });
  try {
    return await func.apply(undefined, [browser]);
  } finally {
    await browser.close();
  }
};

export default runInBrowser;
