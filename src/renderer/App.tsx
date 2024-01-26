import { Routes, Route, MemoryRouter } from 'react-router-dom';
import Layout from './Components/Layout';
import { AppRoutes } from './Services/Constants';
import { HttpContextProvider } from './Services/http/HttpContext';
import { ThemeProvider } from '@emotion/react';
import { createTheme, CssBaseline } from '@mui/material';
import GetTheme from './Services/Themes';
import { QueryClient, QueryClientProvider } from 'react-query';
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
import { SelectionContextProvider } from './Services/SelectionContext';
import Step4_VanillaPois from './Pages/Step4_VanillaPois';
import PreInstallationOptions from './Pages/PreInstallationOptions';

export function AppContext(props: any) {
  const theme = createTheme(GetTheme());
  const queryClient = new QueryClient();

  return (
    <HttpContextProvider>
      <SelectionContextProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {props.children}
          </ThemeProvider>
        </QueryClientProvider>
      </SelectionContextProvider>
    </HttpContextProvider>
  );
}

export default function App() {
  return (
    <AppContext>
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
            <Route
              path={AppRoutes.vanillaPois}
              element={<Step4_VanillaPois />}
            />
            <Route path={AppRoutes.optionalMods} element={<OptionalMods />} />
            <Route path={AppRoutes.options} element={<Options />} />
            <Route
              path={AppRoutes.preInstallation}
              element={<PreInstallationOptions />}
            />
            <Route path={AppRoutes.installation} element={<Installation />} />
            <Route path={AppRoutes.finished} element={<Finished />} />
            <Route path={AppRoutes.canceled} element={<Canceled />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AppContext>
  );
}
