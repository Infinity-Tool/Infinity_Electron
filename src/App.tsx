import { Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import { AppRoutes } from "./Services/Constants";
//pages
import Welcome from "./Pages/Welcome";
import Agreement from "./Pages/Agreement";
import Options from "./Pages/Options";
import CitiesAndSettlements from "Pages/Step1_CitiesAndSettlements";
import StandalonePois from "Pages/Step2_SinglePoiSelection";
import Installation from "Pages/Installation";
import Finished from "Pages/Finished";
import { HttpContextProvider } from "Services/http/HttpContext";
import OptionalMods from "Pages/Step3_OptionalMods";
import Canceled from "Pages/Canceled";

export default function App() {
  return (
    <HttpContextProvider>
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
    </HttpContextProvider>
  );
}
