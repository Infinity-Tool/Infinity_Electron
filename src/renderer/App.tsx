import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './Pages/Welcome';
import GetTheme from './themes';
import Begin from './Pages/Begin';
import Layout from './Layout';

export default function App() {
  const theme = createTheme(GetTheme());

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Welcome />} />
            <Route path="/begin" element={<Begin />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
