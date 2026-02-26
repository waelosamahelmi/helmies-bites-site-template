import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useTenant } from '../contexts/tenant-context';

export function useLocationsByRegion() {
  const { tenant } = useTenant();

  return useQuery({
    queryKey: ['locations', tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) return [];

      const { data } = await supabase
        .from('branches')
        .select('*')
        .eq('tenant_id', tenant.id)
        .eq('is_active', true);

      return data || [];
    },
    enabled: !!tenant?.id,
  });
}