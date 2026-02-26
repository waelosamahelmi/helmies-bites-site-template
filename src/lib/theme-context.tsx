import React, { createContext, useContext, useEffect, useState } from "react";
import { useRestaurantSettings } from "../hooks/use-restaurant-settings";
import { RestaurantConfig } from "../config/restaurant-config";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  const { config } = useRestaurantSettings();

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Apply restaurant config colors as CSS custom properties
    const applyThemeColors = () => {
      // Don't apply theme colors if config is not available
      if (!config || !config.theme) {
        return;
      }
      
      const themeColors = config.theme;
      const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      
      // Apply legacy colors (for backward compatibility)
      root.style.setProperty('--color-primary', themeColors.primary);
      root.style.setProperty('--color-secondary', themeColors.secondary);
      root.style.setProperty('--color-accent', themeColors.accent);
      root.style.setProperty('--color-success', themeColors.success);
      root.style.setProperty('--color-warning', themeColors.warning);
      root.style.setProperty('--color-error', themeColors.error);
      root.style.setProperty('--color-background', themeColors.background);
      root.style.setProperty('--color-foreground', themeColors.foreground);

      // Check if the new theme structure exists
      if (!themeColors.light || !themeColors.dark) {
        // Try to use the static config theme if it has the new structure
        if (false) { // Using false for now since we don't have theme config
          // const staticThemeColors = config?.theme;
          const currentTheme = isDark ? staticThemeColors.dark : staticThemeColors.light;
          
          if (currentTheme) {
            // Apply static theme colors
            root.style.setProperty('--background', currentTheme.background);
            root.style.setProperty('--foreground', currentTheme.foreground);
            root.style.setProperty('--card', currentTheme.card);
            root.style.setProperty('--card-foreground', currentTheme.cardForeground);
            root.style.setProperty('--popover', currentTheme.popover);
            root.style.setProperty('--popover-foreground', currentTheme.popoverForeground);
            root.style.setProperty('--primary', currentTheme.primary);
            root.style.setProperty('--primary-foreground', currentTheme.primaryForeground);
            root.style.setProperty('--secondary', currentTheme.secondary);
            root.style.setProperty('--secondary-foreground', currentTheme.secondaryForeground);
            root.style.setProperty('--muted', currentTheme.muted);
            root.style.setProperty('--muted-foreground', currentTheme.mutedForeground);
            root.style.setProperty('--accent', currentTheme.accent);
            root.style.setProperty('--accent-foreground', currentTheme.accentForeground);
            root.style.setProperty('--destructive', currentTheme.destructive);
            root.style.setProperty('--destructive-foreground', currentTheme.destructiveForeground);
            root.style.setProperty('--border', currentTheme.border);
            root.style.setProperty('--input', currentTheme.input);
            root.style.setProperty('--ring', currentTheme.ring);
            return;
          }
        }
        return;
      }

      // Apply the appropriate theme colors based on current mode
      const currentTheme = isDark ? themeColors.dark : themeColors.light;
      
      // Only apply theme colors if the current theme object exists
      if (!currentTheme) {
        console.warn(`Theme object not found for ${isDark ? 'dark' : 'light'} mode`);
        return;
      }
      
      // Set all CSS custom properties for Tailwind CSS
      root.style.setProperty('--background', currentTheme.background);
      root.style.setProperty('--foreground', currentTheme.foreground);
      root.style.setProperty('--card', currentTheme.card);
      root.style.setProperty('--card-foreground', currentTheme.cardForeground);
      root.style.setProperty('--popover', currentTheme.popover);
      root.style.setProperty('--popover-foreground', currentTheme.popoverForeground);
      root.style.setProperty('--primary', currentTheme.primary);
      root.style.setProperty('--primary-foreground', currentTheme.primaryForeground);
      root.style.setProperty('--secondary', currentTheme.secondary);
      root.style.setProperty('--secondary-foreground', currentTheme.secondaryForeground);
      root.style.setProperty('--muted', currentTheme.muted);
      root.style.setProperty('--muted-foreground', currentTheme.mutedForeground);
      root.style.setProperty('--accent', currentTheme.accent);
      root.style.setProperty('--accent-foreground', currentTheme.accentForeground);
      root.style.setProperty('--destructive', currentTheme.destructive);
      root.style.setProperty('--destructive-foreground', currentTheme.destructiveForeground);
      root.style.setProperty('--border', currentTheme.border);
      root.style.setProperty('--input', currentTheme.input);
      root.style.setProperty('--ring', currentTheme.ring);
    };

    applyThemeColors();

    // Listen for system theme changes when theme is set to "system"
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        root.classList.remove("light", "dark");
        root.classList.add(mediaQuery.matches ? "dark" : "light");
        applyThemeColors(); // Reapply colors when system theme changes
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, config]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};