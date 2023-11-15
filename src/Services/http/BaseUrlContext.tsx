import { createContext, useContext } from "react";
import StorageKeys from "Services/StorageKeys";
import useLocalStorage from "Services/useLocalStorage";
import useSessionStorage from "Services/useSessionStorage";

export class HttpContext {
  public baseUrl: string = "";
  public devMode: any;
  public setDevMode: any;
  public devModeKey: any;
  public setDevModeKey: any;
}

export const httpContext = createContext(new HttpContext());

export const useHttpContext = () => {
  const context = useContext(httpContext);

  if (!context) {
    throw new Error("useBaseContext must be used within a BaseUrlProvider");
  }

  return context;
};

export const HttpContextProvider = ({ children }: any): any => {
  const [devMode, setDevMode] = useSessionStorage(
    StorageKeys.devModeEnabled,
    false
  );
  const [devModeKey, setDevModeKey] = useLocalStorage(
    StorageKeys.devModeKey,
    ""
  );

  const baseUrl: string = devMode
    ? `https://storage.cloud.google.com/infinity-compopack-dev/${devModeKey}`
    : "https://infinity-tool.github.io/Infinity_Assets";

  const value: HttpContext = {
    baseUrl,
    devMode,
    setDevMode,
    devModeKey,
    setDevModeKey,
  };

  return <httpContext.Provider value={value}>{children}</httpContext.Provider>;
};
