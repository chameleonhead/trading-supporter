import { useContext } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AppContext from './AppContext';

function Margins() {
  const { items } = useContext(AppContext);
  return (
    <div>
      <h1>証拠金</h1>
      <div>
        <table>
          <thead>
            <tr>
              <th>通貨ペア</th>
              <th>レート</th>
              <th>最大注文数量</th>
              <th>最終更新</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.currency}>
                <td>{item.currency}</td>
                <td>{item.result?.rate}</td>
                <td>{item.result?.maxLots}</td>
                <td>{item.result?.lastUpdated?.toISOString()}</td>
              </tr>
            ))}
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
