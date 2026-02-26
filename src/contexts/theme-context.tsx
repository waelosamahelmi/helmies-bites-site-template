import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme } from '../lib/theme';
import { defaultTheme } from '../lib/theme-default';
import { useTenant } from './tenant-context';

interface ThemeContextType {
  theme: Theme;
  mode: 'light' | 'dark' | 'system';
  setMode: (mode: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: 'light' | 'dark' | 'system';
}

export function ThemeProvider({ children, defaultMode = 'system' }: ThemeProviderProps) {
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>(defaultMode);
  const [effectiveMode, setEffectiveMode] = useState<'light' | 'dark'>('light');
  const { config } = useTenant();

  useEffect(() => {
    // Determine effective mode
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setEffectiveMode(prefersDark ? 'dark' : 'light');
    } else {
      setEffectiveMode(mode);
    }

    // Listen for system theme changes
    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setEffectiveMode(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [mode]);

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const themeColors = config?.theme?.[effectiveMode] || defaultTheme[effectiveMode];

    Object.entries(themeColors).forEach(([key, value]: [string, any]) => {
      if (typeof value === 'string' && value.startsWith('#')) {
        const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(`--${cssVarName}`, value);
      }
    });
  }, [config, effectiveMode]);

  // Apply theme from config or default
  const theme = config?.theme ? config.theme : defaultTheme;

  const contextValue: ThemeContextType = {
    theme,
    mode,
    setMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
