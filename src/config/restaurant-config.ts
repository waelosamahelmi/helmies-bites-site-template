import { RestaurantConfig } from "@/hooks/use-restaurant-config";

// Helper to format operating hours
export function getFormattedHours(hours: Record<string, string> | undefined, language: string = 'fi'): string {
  if (!hours) return '';
  
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  const dayLabels: Record<string, Record<string, string>> = {
    fi: { monday: 'Ma', tuesday: 'Ti', wednesday: 'Ke', thursday: 'To', friday: 'Pe', saturday: 'La', sunday: 'Su' },
    en: { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' },
    sv: { monday: 'Mån', tuesday: 'Tis', wednesday: 'Ons', thursday: 'Tor', friday: 'Fre', saturday: 'Lör', sunday: 'Sön' }
  };
  
  const labels = dayLabels[language] || dayLabels.fi;
  
  return days
    .filter(day => hours[day])
    .map(day => `${labels[day]}: ${hours[day]}`)
    .join(', ');
}

export const defaultRestaurantConfig: Partial<RestaurantConfig> = {
  name: "Restaurant Name",
  description: "Delicious food made fresh daily",
  theme: "light",
  delivery_fee: 5.99,
  minimum_order: 20.00,
  currency: "USD",
  locale: "en-US",
  timezone: "America/New_York",
};

export const restaurantConfigSchema = {
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  theme: {
    type: String,
    enum: ["light", "dark"],
    required: true,
  },
  delivery_fee: {
    type: Number,
    required: true,
    min: 0,
  },
  minimum_order: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
  },
  locale: {
    type: String,
    required: true,
  },
  timezone: {
    type: String,
    required: true,
  },
};