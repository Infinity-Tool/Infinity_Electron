import { useLocation, useNavigate } from "react-router";
import { AppRoutes, RoutesMeta } from "./Constants";
import { useMemo } from "react";

// TODO GO BACK
// export const GoBack = () => {
//     const router = useNavigate();
//     const location = useLocation();
//     const routesArray = Object.values(AppRoutes);

//     const currentRouteMeta = RoutesMeta[(location.pathname ?? AppRoutes.welcome) as AppRoutes];
//     const previousRouteValue = currentRouteMeta.value > 1 ? currentRouteMeta.value - 1 : 1;
//     const previousRoute = routesArray[previousRouteValue];
//     router.navigate(previousRoute.);
// }
