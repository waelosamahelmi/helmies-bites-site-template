import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useTenant } from '../contexts/tenant-context';

export function useCategories() {
  const { tenant } = useTenant();

  return useQuery({
    queryKey: ['categories', tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) return [];

      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('tenant_id', tenant.id)
        .eq('is_active', true)
        .order('display_order');

      return data || [];
    },
    enabled: !!tenant?.id,
  });
}

export function useMenuItems() {
  const { tenant } = useTenant();

  return useQuery({
    queryKey: ['menu-items', tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) return [];

      const { data } = await supabase
        .from('menu_items')
        .select('*')
        .eq('tenant_id', tenant.id)
        .eq('is_available', true);

      return data || [];
    },
    enabled: !!tenant?.id,
  });
}