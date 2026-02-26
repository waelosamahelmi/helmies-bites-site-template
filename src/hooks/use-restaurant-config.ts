import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useTenant } from '../contexts/tenant-context';

export interface RestaurantConfig {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  theme: 'light' | 'dark';
  delivery_fee: number;
  minimum_order: number;
  currency: string;
  locale: string;
  timezone: string;
}

export function useRestaurantConfig() {
  const { tenant } = useTenant();

  return useQuery({
    queryKey: ['restaurant-config', tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) return null;

      const { data } = await supabase
        .from('restaurant_configs')
        .select('*')
        .eq('tenant_id', tenant.id)
        .single();

      return data as RestaurantConfig | null;
    },
    enabled: !!tenant?.id,
  });
}

export function convertRestaurantConfigToDatabaseConfig(config: Partial<RestaurantConfig>) {
  // This function would convert UI-friendly config format to database format
  // Implementation depends on your specific database schema
  return {
    ...config,
    updated_at: new Date().toISOString(),
  };
}