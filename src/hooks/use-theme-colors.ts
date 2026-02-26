import { useMemo } from 'react';
import { useRestaurantConfig } from './use-restaurant-config';
import { useRestaurantSettings } from './use-restaurant-settings';

export function useThemeColors() {
  const { config } = useRestaurantConfig();
  const { settings } = useRestaurantSettings();

  return useMemo(() => {
    // Default theme colors
    const defaultColors = {
      primary: '#f97316', // orange-600
      secondary: '#f59e0b', // amber-600
      accent: '#dc2626', // red-600
    };

    // Override with restaurant config if available
    return {
      primary: config?.primary_color || defaultColors.primary,
      secondary: config?.secondary_color || defaultColors.secondary,
      accent: config?.accent_color || defaultColors.accent,
    };
  }, [config, settings]);
}