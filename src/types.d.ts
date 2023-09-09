export type CurrencyPair = 'USD/JPY';
export type MarginRequest = {
  currency: CurrencyPair;
  amount: number;
};
export type MarginResult = {
  currency: CurrencyPair;
  amount: number;
  rate: string;
  maxLots: string;
  lastUpdated: Date;
};
