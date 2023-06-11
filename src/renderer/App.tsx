import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './Pages/Welcome';
import GetTheme from './themes';
import Begin from './Pages/Begin';

export default function App() {
  const theme = createTheme(GetTheme());

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/begin" element={<Begin />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
