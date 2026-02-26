import { createContext, useContext, useState, useEffect } from "react";
import { type RestaurantConfig } from "@/config/restaurant-config";
import { useRestaurantConfig, convertRestaurantConfigToDatabaseConfig } from "@/hooks/use-restaurant-config";

interface RestaurantContextType {
  config: RestaurantConfig;
  updateConfig: (updates: RestaurantConfig) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const { config: dbConfig, loading, error, updateConfig: updateDbConfig } = useRestaurantConfig();

  // Use database config if available, otherwise fallback to hardcoded config
  const config = dbConfig || {
  id: "default",
  tenant_id: "default",
  name: "Restaurant Name",
  theme: "light",
  delivery_fee: 5.99,
  minimum_order: 20.00,
  currency: "USD",
  locale: "en-US",
  timezone: "America/New_York",
};

  // Wrapper function to convert RestaurantConfig to DatabaseRestaurantConfig before saving
  const updateConfig = async (updates: RestaurantConfig) => {
    const dbUpdates = convertRestaurantConfigToDatabaseConfig(updates);
    await updateDbConfig(dbUpdates);
  };

  // Show loading state only briefly to avoid "Loading website..." getting stuck
  if (loading && !config) {
    // Set a maximum loading time - if loading takes more than 5 seconds, show fallback config
    const timeoutId = setTimeout(() => {
      console.warn('Restaurant config loading timeout, using fallback');
    }, 5000);

    return (
      <RestaurantContext.Provider value={{
        config: {
  id: "default",
  tenant_id: "default",
  name: "Restaurant Name",
  theme: "light",
  delivery_fee: 5.99,
  minimum_order: 20.00,
  currency: "USD",
  locale: "en-US",
  timezone: "America/New_York",
},
        updateConfig,
        loading: false,
        error: null
      }}>
        {children}
      </RestaurantContext.Provider>
    );
  }

  return (
    <RestaurantContext.Provider value={{
      config,
      updateConfig,
      loading,
      error
    }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
}