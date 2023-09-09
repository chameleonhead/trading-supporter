import { ReactNode, createContext, useEffect, useMemo, useState } from 'react';
import { CurrencyPair, MarginResult } from 'types';

type MarginResultItem = {
  currency: CurrencyPair;
  amount: number;
  result?: MarginResult;
};

type AppContextType = {
  items: MarginResultItem[];
  addCurrencyPair: (currencyPair: CurrencyPair) => void;
  removeCurrencyPair: (currencyPair: CurrencyPair) => void;
};

type MarginPreference = {
  currencyPairs: string[];
  amount: number;
};

const AppContext = createContext<AppContextType>({
  items: [],
  addCurrencyPair: () => {},
  removeCurrencyPair: () => {},
});

export type AppContextProviderProps = {
  children: ReactNode;
};

export function AppContextProvider({ children }: AppContextProviderProps) {
  const [context, setContext] = useState<Pick<AppContextType, 'items'>>({
    items: [],
  });
  const [marginPreference, setMarginPreference] = useState<MarginPreference>(
    useMemo(() => {
      const marginPreferenceJson = localStorage.getItem('margin-preference');
      if (marginPreferenceJson) {
        return JSON.parse(marginPreferenceJson) as MarginPreference;
      }
      return {
        currencyPairs: ['USD/JPY'],
        amount: 1000000,
      };
    }, [])
  );
  useEffect(() => {
    setContext({
      items: marginPreference.currencyPairs.map((currencyPair) => ({
        currency: currencyPair as CurrencyPair,
        amount: marginPreference.amount,
      })),
    });
    const requests = marginPreference.currencyPairs.map((currencyPair) => ({
      currency: currencyPair as CurrencyPair,
      amount: marginPreference.amount,
    }));
    // calling IPC exposed from preload script
    window.electron.ipcRenderer.once('fetch-margin-response', (...args) => {
      // eslint-disable-next-line no-console
      console.log('on-response', args);
      setContext({ items: args as MarginResultItem[] });
    });
    window.electron.ipcRenderer.sendMessage(
      'fetch-margin-request',
      ...requests
    );
  }, [marginPreference]);
  const value = useMemo(() => {
    return {
      ...context,
      addCurrencyPair: (currencyPair: CurrencyPair) => {
        setMarginPreference((pref) => ({
          ...pref,
          currencyPairs: [...pref.currencyPairs, currencyPair],
        }));
      },
      removeCurrencyPair: (currencyPair: CurrencyPair) => {
        setMarginPreference((pref) => ({
          ...pref,
          currencyPairs: pref.currencyPairs.filter((p) => p !== currencyPair),
        }));
      },
    };
  }, [context]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContext;