import { createContext, useContext } from 'react';
import useLocalStorage from '../useLocalStorage';
import StorageKeys from '../StorageKeys';
import { darkTheme, lightTheme } from './Themes';

export class InfinityThemeContext {
  public theme: any;
  public themeMode: string;
  public toggleTheme: any;
}

export const infinityThemeContext = createContext(new InfinityThemeContext());

export const useInfinityThemeContext = () => {
  const context = useContext(infinityThemeContext);

  if (!context) {
    throw new Error('useBaseContext must be used within a BaseUrlProvider');
  }

  return context;
};

export const InfinityThemeContextProvider = ({ children }: any): any => {
  // Get OS theme
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  const [themeMode, setThemeMode] = useLocalStorage(
    StorageKeys.theme,
    prefersDarkScheme.matches ? 'dark' : 'light',
  );

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const value: InfinityThemeContext = {
    theme: getTheme(themeMode),
    themeMode,
    toggleTheme,
  };

  return (
    <infinityThemeContext.Provider value={value}>
      {children}
    </infinityThemeContext.Provider>
  );
};

const getTheme = (themeMode: string) => {
  return themeMode === 'dark' ? darkTheme : lightTheme;
};
