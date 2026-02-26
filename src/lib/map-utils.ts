import { RestaurantConfig } from "@/config/restaurant-config";

// Get restaurant location from config
export function getRestaurantLocation(config: RestaurantConfig) {
  return {
    lat: config.delivery.location.lat,
    lng: config.delivery.location.lng,
    address: `${config.address.street}, ${config.address.postalCode} ${config.address.city}, ${config.address.country}`
  };
}

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

// Calculate delivery fee based on distance
export function calculateDeliveryFee(distance: number, config: RestaurantConfig): number {
  if (!distance || isNaN(distance)) return config.delivery.zones[0].fee;

  for (const zone of config.delivery.zones) {
    if (distance <= zone.maxDistance) {
      return zone.fee;
    }
  }

  return -1; // Outside delivery area
}

// Get delivery zone description
export function getDeliveryZone(distance: number, config: RestaurantConfig): { zone: string; description: string } {
  for (let i = 0; i < config.delivery.zones.length; i++) {
    const zone = config.delivery.zones[i];
    if (distance <= zone.maxDistance) {
      const prevMax = i > 0 ? config.delivery.zones[i-1].maxDistance : 0;
      return {
        zone: i === 0 ? "standard" : "extended",
        description: `Kuljetusalue ${prevMax}-${zone.maxDistance}km`
      };
    }
  }

  return {
    zone: "outside",
    description: "Toimitus-alueen ulkopuolella"
  };
}

// Geocoding using OpenStreetMap Nominatim API (free)
export async function geocodeAddress(address: string): Promise<{lat: number; lng: number} | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=fi&limit=1&addressdetails=1`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'helmiesBites/1.0'
        }
      }
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Reverse geocoding to get address from coordinates
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'helmiesBites/1.0'
        }
      }
    );
    const data = await response.json();

    if (data && data.display_name) {
      return data.display_name;
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

// Check if coordinates are within Finland (approximate bounds)
export function isWithinFinland(lat: number, lng: number): boolean {
  return lat >= 59.5 && lat <= 70.1 && lng >= 19.5 && lng <= 31.6;
}
