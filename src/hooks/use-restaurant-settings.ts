import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useTenant } from '../contexts/tenant-context';

export interface RestaurantSettings {
  id: string;
  tenant_id: string;
  name: string;
  logo_url?: string;
  theme: 'light' | 'dark';
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
}

export function useRestaurantSettings() {
  const { tenant } = useTenant();

  return useQuery({
    queryKey: ['restaurant-settings', tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) return null;

      const { data } = await supabase
        .from('restaurant_settings')
        .select('*')
        .eq('tenant_id', tenant.id)
        .single();

      return data as RestaurantSettings | null;
    },
    enabled: !!tenant?.id,
  });
}