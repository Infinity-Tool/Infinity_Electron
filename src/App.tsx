import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import GetTheme from "./Services/Themes";
import Layout from "./Components/Layout";
import { AppRoutes } from "./Services/Constants";
//pages
import Welcome from "./Pages/Welcome";
import Agreement from "./Pages/Agreement";
import Options from "./Pages/Options";
import Selection from "./Pages/Selection";

export default function App() {
  const theme = createTheme(GetTheme());

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path={AppRoutes.welcome} element={<Welcome />} />
            <Route path={AppRoutes.agreement} element={<Agreement />} />
            <Route path={AppRoutes.options} element={<Options />} />
            <Route path={AppRoutes.selection} element={<Selection />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
