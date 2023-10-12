import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import GetTheme from "./Services/Themes";
import Layout from "./Components/Layout";
import { AppRoutes } from "./Services/Constants";
//pages
import Welcome from "./Pages/Welcome";
import Agreement from "./Pages/Agreement";
import Options from "./Pages/Options";
import Installation from "Pages/Installation";
import CitiesAndSettlements from "Pages/CitiesAndSettlements";
import StandalonePois from "Pages/SinglePoiSelection";

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
            <Route
              path={AppRoutes.citiesAndSettlements}
              element={<CitiesAndSettlements />}
            />
            <Route
              path={AppRoutes.singlePoiSelection}
              element={<StandalonePois />}
            />
            <Route path={AppRoutes.options} element={<Options />} />
            <Route path={AppRoutes.installation} element={<Installation />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
