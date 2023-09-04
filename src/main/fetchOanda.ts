import { chromium } from 'playwright';

const fetchOanda = ({ currency }: { currency: string }) => {
  return chromium.launch({ headless: false }).then(async (browser) => {
    const page = await browser.newPage();
    await page.goto('https://www.oanda.jp/lab-education/margin/');
    const frame = page.frameLocator('#oanda-widget-margin0');
    const form = frame.locator('.tab__inner form').nth(0);
    await form.locator('label').filter({ hasText: '法人' }).click();
    await form.locator('#formulate-global-1').fill('1000000');
    await form.getByRole('combobox').selectOption(currency);
    await form.locator('#formulate-global-3').fill('1');
    await form.locator('label').filter({ hasText: '買い' }).click();
    await form.getByRole('button', { name: '現在のレートを取得' }).click();
    await form.getByRole('button', { name: '計算する' }).click();
    const value = await frame
      .locator('.simulator__results-inner table tr')
      .nth(5)
      .locator('.simulator__results-value')
      .innerText();
    return { lots: value };
  });
};

export default fetchOanda;
