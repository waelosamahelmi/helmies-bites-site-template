import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface Tenant {
  id: string;
  slug: string;
  name: string;
  name_en?: string;
  description?: string;
  description_en?: string;
  status: string;
}

interface TenantContextType {
  tenant: Tenant | null;
  config: any | null;
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
  tenantSlug: string | null;
}

export function TenantProvider({ children, tenantSlug }: TenantProviderProps) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTenant() {
      if (!tenantSlug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get tenant by slug
        const { data: tenantData, error: tenantError } = await supabase
          .from('tenants')
          .select('*')
          .eq('slug', tenantSlug)
          .eq('status', 'active')
          .single();

        if (tenantError || !tenantData) {
          throw new Error('Tenant not found');
        }

        setTenant(tenantData);

        // Get restaurant config
        const { data: configData } = await supabase
          .from('restaurant_config')
          .select('*')
          .eq('tenant_id', tenantData.id)
          .single();

        setConfig(configData);

        // Set tenant context for API calls
        supabase.realtime.setAuth({
          tenant_id: tenantData.id,
        });
      } catch (err: any) {
        console.error('Error loading tenant:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTenant();
  }, [tenantSlug]);

  return (
    <TenantContext.Provider value={{ tenant, config, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

export default TenantContext;
