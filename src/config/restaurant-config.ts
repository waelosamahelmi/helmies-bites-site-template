import { RestaurantConfig } from "@/hooks/use-restaurant-config";

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