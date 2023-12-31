import { ReactNode, createContext, useEffect, useMemo, useState } from 'react';
import { CurrencyPair, MarginResult } from 'types';

type MarginResultItem = {
  currency: CurrencyPair;
  amount: number;
  result?: MarginResult;
};

type AppContextType = {
  items: MarginResultItem[];
  amount: number;
  setAmount: (amount: number) => void;
  addCurrencyPair: (currencyPair: CurrencyPair) => void;
  removeCurrencyPair: (currencyPair: CurrencyPair) => void;
  update: () => void;
};

type MarginPreference = {
  currencyPairs: string[];
  amount: number;
};

const AppContext = createContext<AppContextType>({
  items: [],
  amount: 0,
  setAmount: () => {},
  addCurrencyPair: () => {},
  removeCurrencyPair: () => {},
  update: () => {},
});

export type AppContextProviderProps = {
  children: ReactNode;
};

export function AppContextProvider({ children }: AppContextProviderProps) {
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
  const [context, setContext] = useState<
    Pick<AppContextType, 'items' | 'amount'>
  >({
    items: marginPreference.currencyPairs.map((currencyPair) => ({
      currency: currencyPair as CurrencyPair,
      amount: marginPreference.amount,
    })),
    amount: marginPreference.amount,
  });
  useEffect(() => {
    // calling IPC exposed from preload script
    const unsubscribe = window.electron.ipcRenderer.on(
      'fetch-margin-response',
      (...args) => {
        if (args.length === 0) {
          return;
        }
        if ((args[0] as { error: string }).error) {
          // eslint-disable-next-line no-console
          console.error((args[0] as { error: string }).error);
          return;
        }
        // eslint-disable-next-line no-console
        console.log('on-response', args);
        const results = args as MarginResult[];
        setContext((c) => ({
          items: c.items.map((item) => ({
            ...item,
            result: results.find((result) => result.currency === item.currency),
          })),
          amount: c.amount,
        }));
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    setContext({
      items: marginPreference.currencyPairs.map((currencyPair) => ({
        currency: currencyPair as CurrencyPair,
        amount: marginPreference.amount,
      })),
      amount: marginPreference.amount,
    });
    const requests = marginPreference.currencyPairs.map((currencyPair) => ({
      currency: currencyPair,
      amount: marginPreference.amount,
    }));
    window.electron.ipcRenderer.sendMessage(
      'fetch-margin-request',
      ...requests
    );
  }, [marginPreference]);
  const value = useMemo(() => {
    return {
      ...context,
      setAmount: (amount: number) => {
        setMarginPreference((pref) => {
          const newPref = {
            ...pref,
            amount,
          };
          localStorage.setItem('margin-preference', JSON.stringify(newPref));
          return newPref;
        });
      },
      addCurrencyPair: (currencyPair: CurrencyPair) => {
        setMarginPreference((pref) => {
          const newPref = {
            ...pref,
            currencyPairs: [...pref.currencyPairs, currencyPair].sort(),
          };
          localStorage.setItem('margin-preference', JSON.stringify(newPref));
          return newPref;
        });
      },
      removeCurrencyPair: (currencyPair: CurrencyPair) => {
        setMarginPreference((pref) => {
          const newPref = {
            ...pref,
            currencyPairs: pref.currencyPairs.filter((p) => p !== currencyPair),
          };
          localStorage.setItem('margin-preference', JSON.stringify(newPref));
          return newPref;
        });
      },
      update: () => {
        const requests = context.items.map((item) => ({
          currency: item.currency,
          amount: item.amount,
        }));
        window.electron.ipcRenderer.sendMessage(
          'fetch-margin-request',
          ...requests
        );
      },
    };
  }, [context]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContext;
