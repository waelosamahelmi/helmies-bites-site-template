import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/theme-context';
import { TenantProvider } from './contexts/tenant-context';
import { LanguageProvider } from './contexts/language-context';
import { CartProvider } from './contexts/cart-context';
import { AuthProvider } from './contexts/auth-context';
import App from './App';
import './index.css';
import './lib/pwa-service';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Get tenant slug from environment or URL
const tenantSlug = import.meta.env.VITE_TENANT_SLUG || (() => {
  const host = window.location.host;
  const subdomain = host.split('.')[0];
  // Skip main domains
  if (['helmiesbites', 'bites', 'www', 'localhost', '127'].includes(subdomain)) {
    return null;
  }
  return subdomain;
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TenantProvider tenantSlug={tenantSlug}>
          <AuthProvider>
            <ThemeProvider>
              <LanguageProvider>
                <CartProvider>
                  <App />
                </CartProvider>
              </LanguageProvider>
            </ThemeProvider>
          </AuthProvider>
        </TenantProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
