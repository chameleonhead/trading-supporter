import { Page } from 'playwright';
import { MarginRequest, MarginResult } from 'types';

const fetchOanda = async (
  page: Page,
  { currency, amount }: MarginRequest,
  cancellationController: AbortController
): Promise<MarginResult | null> => {
  if (cancellationController.signal.aborted) {
    return null;
  }
  if (page.mainFrame().url() !== 'https://www.oanda.jp/lab-education/margin/') {
    await page.goto('https://www.oanda.jp/lab-education/margin/', {
      waitUntil: 'domcontentloaded',
      timeout: 0,
    });
    if (cancellationController.signal.aborted) {
      return null;
    }
  }
  const frame = page.frameLocator('#oanda-widget-margin0');
  const form = frame.locator('.tab__inner form').nth(0);
  await form.locator('label').filter({ hasText: '法人' }).click({ timeout: 0 });
  if (cancellationController.signal.aborted) {
    return null;
  }
  await form.locator('#formulate-global-1').clear();
  await form.locator('#formulate-global-1').fill(String(amount));
  await form.getByRole('combobox').selectOption(currency);
  await form.locator('#formulate-global-3').clear();
  await form.locator('#formulate-global-3').fill('1');
  await form.locator('label').filter({ hasText: '買い' }).click();
  await form.getByRole('button', { name: '現在のレートを取得' }).click();
  if (cancellationController.signal.aborted) {
    return null;
  }
  await form.getByRole('button', { name: '計算する' }).click();
  const rate = await form.locator('#formulate-global-4').inputValue();
  const table = frame.locator('.simulator__results-inner table tr');
  const maxLots = await table
    .nth(5)
    .locator('.simulator__results-value')
    .innerText();
  return {
    currency,
    amount,
    rate,
    maxLots,
    lastUpdated: new Date(),
  };
};

export default fetchOanda;
