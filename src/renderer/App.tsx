import { Routes, Route, MemoryRouter } from 'react-router-dom';
import Layout from './Components/Layout';
import { AppRoutes } from './Services/Constants';
import { HttpContextProvider } from './Services/http/HttpContext';
//pages
import Welcome from './Pages/Welcome';
import Agreement from './Pages/Agreement';
import Options from './Pages/Options';
import Canceled from './Pages/Canceled';
import Finished from './Pages/Finished';
import Installation from './Pages/Installation';
import CitiesAndSettlements from './Pages/Step1_CitiesAndSettlements';
import StandalonePois from './Pages/Step2_SinglePoiSelection';
import OptionalMods from './Pages/Step3_OptionalMods';
import { ThemeProvider } from '@emotion/react';
import { createTheme, CssBaseline } from '@mui/material';
import GetTheme from './Services/Themes';

export function AppContext(props: any) {
  const theme = createTheme(GetTheme());

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AppContext>
      <HttpContextProvider>
        <MemoryRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path={AppRoutes.welcome} element={<Welcome />} />
              <Route path={AppRoutes.agreement} element={<Agreement />} />
              <Route
                path={AppRoutes.citiesAndSettlements}
                element={<CitiesAndSettlements />}
              />
              <Route
                path={AppRoutes.singlePoiSelection}
                element={<StandalonePois />}
              />
              <Route path={AppRoutes.optionalMods} element={<OptionalMods />} />
              <Route path={AppRoutes.options} element={<Options />} />
              <Route path={AppRoutes.installation} element={<Installation />} />
              <Route path={AppRoutes.finished} element={<Finished />} />
              <Route path={AppRoutes.canceled} element={<Canceled />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </HttpContextProvider>
    </AppContext>
  );
}
