import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to add tenant_id to queries
export function withTenant(tenantId: string) {
  return {
    eq: (column: string, value: any) => ({
      select: (columns = '*') => ({
        from: (table: string) => supabase
          .from(table)
          .select(columns)
          .eq('tenant_id', tenantId)
          .eq(column, value)
      })
    })
  };
}

export default supabase;
