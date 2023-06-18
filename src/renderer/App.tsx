import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './Pages/Welcome';
import GetTheme from './themes';
import Layout from './Layout';
import Selection from './Pages/Selection';
import { routes } from './Constants';

export default function App() {
  const theme = createTheme(GetTheme());

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path={routes.welcome} element={<Welcome />} />
            <Route path={routes.selection} element={<Selection />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
