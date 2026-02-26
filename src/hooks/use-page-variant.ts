import { useRestaurant } from "@/lib/restaurant-context";

type PageType = 'home' | 'menu' | 'about' | 'header' | 'footer' | 'cart' | 'checkout';
type LayoutVariant = 'variant1' | 'variant2' | 'variant3';

/**
 * Hook to get the current layout variant for a specific page
 * @param page - The page type
 * @returns The layout variant (variant1, variant2, or variant3)
 */
export function usePageVariant(page: PageType): LayoutVariant {
  const { config } = useRestaurant();

  // Get the page layout variants from config
  const variants = config?.pageLayoutVariants || {
    home: 'variant1',
    menu: 'variant1',
    about: 'variant1',
    header: 'variant1',
    footer: 'variant1',
    cart: 'variant1',
    checkout: 'variant1'
  };

  // Return the variant for this page, default to variant1
  return (variants[page] as LayoutVariant) || 'variant1';
}

/**
 * Hook to check if a specific variant is active for a page
 * @param page - The page type
 * @param variant - The variant to check
 * @returns true if the variant is active
 */
export function useIsVariant(page: PageType, variant: LayoutVariant): boolean {
  const currentVariant = usePageVariant(page);
  return currentVariant === variant;
}
