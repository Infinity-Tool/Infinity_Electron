import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { InfinityThemeContextProvider } from './Services/theme/ThemeContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') ?? document.createElement('div'),
);

root.render(
  <InfinityThemeContextProvider>
    <App />
  </InfinityThemeContextProvider>,
);
