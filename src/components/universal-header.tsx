import { useLanguage } from "@/lib/language-context";
import { useRestaurant } from "@/lib/restaurant-context";
import { useCart } from "@/lib/cart-context";
import { Header } from "./Header";

export function UniversalHeader() {
  const { t } = useLanguage();
  const { config } = useRestaurant();
  const { totalItems } = useCart();

  return (
    <Header
      onCartClick={() => {}}
      logoUrl={config?.logo_url}
      restaurantName={config?.name}
    />
  );
}