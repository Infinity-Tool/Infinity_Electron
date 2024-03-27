import { createContext, useContext } from 'react';
import useLocalStorage from '../useLocalStorage';
import StorageKeys from '../StorageKeys';
import { darkTheme, lightTheme } from './Themes';
import { set } from 'lodash';

export class InfinityThemeContext {
  public theme: any;
  public themeMode: string;
  public toggleTheme: any;
  public toggleFontSize: any;
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
  const [fontSize, setFontSize] = useLocalStorage(StorageKeys.fontSize, 16);

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const toggleFontSize = () => {
    setFontSize(fontSize === 16 ? 20 : 16);
  };

  const theme = getTheme(themeMode);
  theme.typography.fontSize = fontSize;

  const value: InfinityThemeContext = {
    theme: theme,
    themeMode,
    toggleTheme,
    toggleFontSize,
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
