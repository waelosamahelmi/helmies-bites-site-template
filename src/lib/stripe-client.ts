import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripePublishableKey = (): string => {
  // Get from restaurant settings (fetched from database)
  // This will be populated from the database settings
  return import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
};

export const getStripe = (publishableKey?: string): Promise<Stripe | null> => {
  const key = publishableKey || getStripePublishableKey();

  if (!key) {
    console.warn('Stripe publishable key is not configured');
    return Promise.resolve(null);
  }

  if (!stripePromise) {
    stripePromise = loadStripe(key);
  }

  return stripePromise;
};

// Reset stripe instance (useful when switching between test/live keys)
export const resetStripe = () => {
  stripePromise = null;
};
