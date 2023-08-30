export const InfinityAssetsPath =
  "https://storage.googleapis.com/infinity-assets-dev";

export enum AppRoutes {
  welcome = "/",
  agreement = "/agreement",
  options = "/options",
  citiesAndSettlements = "/cities-and-settlements",
  bigStructures = "/big-structures",
  standalonePois = "/standalone-pois",
  installation = "/installation",
  finished = "/finished",
}

export const RoutesMeta: Record<AppRoutes, { title: string; value: number }> = {
  [AppRoutes.welcome]: {
    title: "Welcome",
    value: 0,
  },
  [AppRoutes.agreement]: {
    title: "Agreement",
    value: 1,
  },
  [AppRoutes.options]: {
    title: "Options",
    value: 2,
  },
  [AppRoutes.citiesAndSettlements]: {
    title: "Cities and Settlements",
    value: 3,
  },
  [AppRoutes.bigStructures]: {
    title: "Big Structures",
    value: 4,
  },
  [AppRoutes.standalonePois]: {
    title: "Standalone POIs",
    value: 5,
  },
  [AppRoutes.installation]: {
    title: "Installation",
    value: 6,
  },
  [AppRoutes.finished]: {
    title: "Finished",
    value: 7,
  },
};
