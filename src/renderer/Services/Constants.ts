import { any } from 'async';

export const InfinityAssetsPath =
  'https://storage.googleapis.com/infinity-assets-dev';

export enum AppRoutes {
  welcome = '/',
  agreement = '/agreement',
  options = '/options',
  citiesAndSettlements = '/cities-and-settlements',
  singlePoiSelection = '/standalone-pois',
  optionalMods = '/optional-mods',
  vanillaPois = '/vanilla-pois',
  installation = '/installation',
  finished = '/finished',
  canceled = '/canceled',
}

export enum installFlow {
  any = 'any',
  modded = 'modded',
  vanilla = 'vanilla',
}

export const RoutesMeta: Record<
  AppRoutes,
  { title: string; value: number; installFlow: installFlow }
> = {
  [AppRoutes.welcome]: {
    title: 'Welcome',
    value: 0,
    installFlow: installFlow.any,
  },
  [AppRoutes.agreement]: {
    title: 'Agreement',
    value: 1,
    installFlow: installFlow.any,
  },
  [AppRoutes.options]: {
    title: 'Options',
    value: 2,
    installFlow: installFlow.any,
  },
  // Step 1
  [AppRoutes.citiesAndSettlements]: {
    title: 'Cities & Settlements',
    value: 3,
    installFlow: installFlow.modded,
  },
  // Step 2
  [AppRoutes.singlePoiSelection]: {
    title: 'Single POI Selection',
    value: 4,
    installFlow: installFlow.modded,
  },
  // Step 3
  [AppRoutes.optionalMods]: {
    title: 'Optional Mods',
    value: 5,
    installFlow: installFlow.modded,
  },
  // Step 4
  [AppRoutes.vanillaPois]: {
    title: 'Vanilla POIs',
    value: 3,
    installFlow: installFlow.vanilla,
  },
  [AppRoutes.installation]: {
    title: 'Installation',
    value: 6,
    installFlow: installFlow.any,
  },
  [AppRoutes.finished]: {
    title: 'Finished',
    value: 7,
    installFlow: installFlow.any,
  },
  [AppRoutes.canceled]: {
    title: 'Canceled',
    value: 8,
    installFlow: installFlow.any,
  },
};
