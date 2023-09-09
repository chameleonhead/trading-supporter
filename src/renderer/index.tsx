import { createRoot } from 'react-dom/client';
import App from './App';
import { AppContextProvider } from './AppContext';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <AppContextProvider>
    <App />
  </AppContextProvider>
);
