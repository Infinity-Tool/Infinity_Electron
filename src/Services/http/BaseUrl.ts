// dev = https://storage.cloud.google.com/infinity-compopack-dev
// prod = https://infinity-tool.github.io/Infinity_Assets

import StorageKeys from "Services/StorageKeys";
import useLocalStorage from "Services/useLocalStorage";
import useSessionStorage from "Services/useSessionStorage";

export const getBaseUrl = () => {
  const [devMode] = useSessionStorage(StorageKeys.devModeEnabled, false);
  const [devModeKey] = useLocalStorage(StorageKeys.devModeKey, "");
};
