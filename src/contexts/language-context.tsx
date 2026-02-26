import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'fi' | 'en' | 'sv';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  fi: {
    'nav.home': 'Etusivu',
    'nav.menu': 'Menu',
    'nav.about': 'Tietoa meistä',
    'nav.order': 'Tilaa',
    'cart.title': 'Ostoskori',
    'cart.empty': 'Ostoskori on tyhjä',
    'cart.checkout': 'Siirry kassalle',
    'cart.total': 'Yhteensä',
    'order.delivery': 'Toimitus',
    'order.pickup': 'Nouto',
    'order.note': 'Tilauksen huomautus',
    'order.place': 'Tilaa',
    'filter.all': 'Kaikki',
    'filter.vegetarian': 'Kasvisruoka',
    'filter.vegan': 'Vegaani',
    'filter.glutenFree': 'Gluteeniton',
    'item.add': 'Lisää',
    'item.customize': 'Mukauta',
  },
  en: {
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.about': 'About',
    'nav.order': 'Order',
    'cart.title': 'Cart',
    'cart.empty': 'Your cart is empty',
    'cart.checkout': 'Checkout',
    'cart.total': 'Total',
    'order.delivery': 'Delivery',
    'order.pickup': 'Pickup',
    'order.note': 'Order note',
    'order.place': 'Place Order',
    'filter.all': 'All',
    'filter.vegetarian': 'Vegetarian',
    'filter.vegan': 'Vegan',
    'filter.glutenFree': 'Gluten Free',
    'item.add': 'Add',
    'item.customize': 'Customize',
  },
  sv: {
    'nav.home': 'Hem',
    'nav.menu': 'Meny',
    'nav.about': 'Om oss',
    'nav.order': 'Beställ',
    'cart.title': 'Varukorg',
    'cart.empty': 'Din varukorg är tom',
    'cart.checkout': 'Till kassan',
    'cart.total': 'Totalt',
    'order.delivery': 'Leverans',
    'order.pickup': 'Hämta',
    'order.note': 'Beställningsnotering',
    'order.place': 'Beställ',
    'filter.all': 'Alla',
    'filter.vegetarian': 'Vegetarisk',
    'filter.vegan': 'Vegan',
    'filter.glutenFree': 'Glutenfri',
    'item.add': 'Lägg till',
    'item.customize': 'Anpassa',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({ children, defaultLanguage = 'fi' }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  // Load saved language preference
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && ['fi', 'en', 'sv'].includes(saved)) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
