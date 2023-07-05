export const InfinityAssetsPath =
  "https://infinity-tool.github.io/Infinity_Assets";

export enum AppRoutes {
  welcome = "/",
  agreement = "/agreement",
  options = "/options",
  selection = "/selection",
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
  [AppRoutes.selection]: {
    title: "Selection",
    value: 3,
  },
  [AppRoutes.installation]: {
    title: "Installation",
    value: 4,
  },
  [AppRoutes.finished]: {
    title: "Finished",
    value: 5,
  },
};
