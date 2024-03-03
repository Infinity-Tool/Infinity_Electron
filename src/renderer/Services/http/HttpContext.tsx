import { createContext, useContext } from 'react';
import StorageKeys from '../StorageKeys';
import useLocalStorage from '../useLocalStorage';

export class HttpContext {
  public baseUrl: string = '';
  public devMode: any;
  public setDevMode: any;
  public devModeKey: any;
  public setDevModeKey: any;
}

export const httpContext = createContext(new HttpContext());

export const useHttpContext = () => {
  const context = useContext(httpContext);

  if (!context) {
    throw new Error('useBaseContext must be used within a BaseUrlProvider');
  }

  return context;
};

export const HttpContextProvider = ({ children }: any): any => {
  const [devMode, setDevMode] = useLocalStorage(
    StorageKeys.devModeEnabled,
    false,
  );
  const [devModeKey, setDevModeKey] = useLocalStorage(
    StorageKeys.devModeKey,
    '',
  );

  const baseUrl: string = devMode
    ? `https://infinity-develop.syd1.cdn.digitaloceanspaces.com/${devModeKey}`
    : `https://infinity-production.sfo3.cdn.digitaloceanspaces.com`;

  const value: HttpContext = {
    baseUrl,
    devMode,
    setDevMode,
    devModeKey,
    setDevModeKey,
  };

  return <httpContext.Provider value={value}>{children}</httpContext.Provider>;
};
