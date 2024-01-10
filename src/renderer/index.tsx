import ReactDOM from 'react-dom/client';
import './index.css';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import GetTheme from './Services/Themes';

const root = ReactDOM.createRoot(
  document.getElementById('root') ?? document.createElement('div'),
);
const theme = createTheme(GetTheme());

root.render(
  <App />,
  //   <ThemeProvider theme={theme}>
  //     <CssBaseline />
  //     <MemoryRouter>
  //       <App />
  //     </MemoryRouter>
  //   </ThemeProvider>,
);
