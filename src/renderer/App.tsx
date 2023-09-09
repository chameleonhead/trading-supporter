import { useContext } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { CurrencyPair } from 'types';
import AppContext from './AppContext';

function Margins() {
  const { items, addCurrencyPair, removeCurrencyPair } = useContext(AppContext);
  return (
    <div>
      <div className="flex justify-between">
        <h1>証拠金</h1>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>通貨ペア</th>
              <th>レート</th>
              <th>最大注文数量</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) =>
              item.result ? (
                <tr key={item.currency}>
                  <td>{item.currency}</td>
                  <td className="text-right">{item.result.rate}</td>
                  <td className="text-right">{item.result.maxLots}</td>
                  <td className="p-0">
                    <button
                      type="button"
                      onClick={() => removeCurrencyPair(item.currency)}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={item.currency}>
                  <td>{item.currency}</td>
                  <td colSpan={2}>Loading...</td>
                  <td className="p-0">
                    <button
                      type="button"
                      onClick={() => removeCurrencyPair(item.currency)}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              )
            )}
            <tr>
              <td colSpan={4}>
                <select
                  value=""
                  onChange={(e) => {
                    if (
                      e.target.value &&
                      !items.find((i) => i.currency === e.target.value)
                    ) {
                      addCurrencyPair(e.target.value as CurrencyPair);
                    }
                  }}
                >
                  <option>------</option>
                  <option value="USD/JPY">USD/JPY</option>
                  <option value="EUR/JPY">EUR/JPY</option>
                  <option value="AUD/JPY">AUD/JPY</option>
                  <option value="GBP/JPY">GBP/JPY</option>
                  <option value="NZD/JPY">NZD/JPY</option>
                  <option value="CAD/JPY">CAD/JPY</option>
                  <option value="CHF/JPY">CHF/JPY</option>
                  <option value="ZAR/JPY">ZAR/JPY</option>
                  <option value="EUR/USD">EUR/USD</option>
                  <option value="GBP/USD">GBP/USD</option>
                  <option value="NZD/USD">NZD/USD</option>
                  <option value="AUD/USD">AUD/USD</option>
                  <option value="USD/CHF">USD/CHF</option>
                  <option value="EUR/CHF">EUR/CHF</option>
                  <option value="GBP/CHF">GBP/CHF</option>
                  <option value="EUR/GBP">EUR/GBP</option>
                  <option value="AUD/NZD">AUD/NZD</option>
                  <option value="AUD/CAD">AUD/CAD</option>
                  <option value="AUD/CHF">AUD/CHF</option>
                  <option value="CAD/CHF">CAD/CHF</option>
                  <option value="EUR/AUD">EUR/AUD</option>
                  <option value="EUR/CAD">EUR/CAD</option>
                  <option value="EUR/DKK">EUR/DKK</option>
                  <option value="EUR/NOK">EUR/NOK</option>
                  <option value="EUR/NZD">EUR/NZD</option>
                  <option value="EUR/SEK">EUR/SEK</option>
                  <option value="GBP/AUD">GBP/AUD</option>
                  <option value="GBP/CAD">GBP/CAD</option>
                  <option value="GBP/NZD">GBP/NZD</option>
                  <option value="NZD/CAD">NZD/CAD</option>
                  <option value="NZD/CHF">NZD/CHF</option>
                  <option value="USD/CAD">USD/CAD</option>
                  <option value="USD/DKK">USD/DKK</option>
                  <option value="USD/NOK">USD/NOK</option>
                  <option value="USD/SEK">USD/SEK</option>
                  <option value="AUD/HKD">AUD/HKD</option>
                  <option value="AUD/SGD">AUD/SGD</option>
                  <option value="CAD/HKD">CAD/HKD</option>
                  <option value="CAD/SGD">CAD/SGD</option>
                  <option value="CHF/HKD">CHF/HKD</option>
                  <option value="CHF/ZAR">CHF/ZAR</option>
                  <option value="EUR/CZK">EUR/CZK</option>
                  <option value="EUR/HKD">EUR/HKD</option>
                  <option value="EUR/HUF">EUR/HUF</option>
                  <option value="EUR/PLN">EUR/PLN</option>
                  <option value="EUR/SGD">EUR/SGD</option>
                  <option value="EUR/TRY">EUR/TRY</option>
                  <option value="EUR/ZAR">EUR/ZAR</option>
                  <option value="GBP/HKD">GBP/HKD</option>
                  <option value="GBP/PLN">GBP/PLN</option>
                  <option value="GBP/SGD">GBP/SGD</option>
                  <option value="GBP/ZAR">GBP/ZAR</option>
                  <option value="HKD/JPY">HKD/JPY</option>
                  <option value="NZD/HKD">NZD/HKD</option>
                  <option value="NZD/SGD">NZD/SGD</option>
                  <option value="SGD/CHF">SGD/CHF</option>
                  <option value="SGD/JPY">SGD/JPY</option>
                  <option value="TRY/JPY">TRY/JPY</option>
                  <option value="USD/CNH">USD/CNH</option>
                  <option value="USD/CZK">USD/CZK</option>
                  <option value="USD/HKD">USD/HKD</option>
                  <option value="USD/HUF">USD/HUF</option>
                  <option value="USD/MXN">USD/MXN</option>
                  <option value="USD/PLN">USD/PLN</option>
                  <option value="USD/SGD">USD/SGD</option>
                  <option value="USD/THB">USD/THB</option>
                  <option value="USD/TRY">USD/TRY</option>
                  <option value="USD/ZAR">USD/ZAR</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Margins />} />
      </Routes>
    </Router>
  );
}
