import { useLanguage } from "@/lib/language-context";
import { useLocationsByRegion } from "@/hooks/use-locations";
import { UniversalHeader } from "@/components/universal-header";
import { usePageVariant } from "@/hooks/use-page-variant";
import { useRestaurant } from "@/lib/restaurant-context";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Store, ShoppingBag, Building2, ShoppingCart, Building, Loader2 } from "lucide-react";
import * as LucideIcons from "lucide-react";

export default function Locations() {
  const { t } = useLanguage();
  const { config } = useRestaurant();
  const { data: locationsByRegion, isLoading } = useLocationsByRegion();
  const variant = usePageVariant('about');
  
  // Get theme colors
  const theme = config?.theme || {};
  const primaryColor = theme.primary || '#8B4513';
  const secondaryColor = theme.secondary || '#FF8C00';
  const fonts = theme.fonts || { heading: 'Inter', body: 'Inter' };

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      MapPin,
      Store,
      ShoppingBag,
      Building2,
      ShoppingCart,
      Building,
    };
    return icons[iconName] || (LucideIcons as any)[iconName] || MapPin;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900">
      <UniversalHeader />
      
      {/* Page Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-24 overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <div className="inline-block mb-6">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30 shadow-lg">
              <span className="text-sm font-bold uppercase tracking-wider">
                {t("Löydä meidät", "Find Us")}
              </span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            {t("Ruokapisteet", "Food Locations")}
          </h1>
          <p className="text-xl md:text-3xl opacity-90 max-w-3xl mx-auto font-light">
            {t("Löydä lähin myyntipisteemme", "Find our nearest location")}
          </p>
          {/* Decorative line */}
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Locations Content */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-16">
              {locationsByRegion && Object.entries(locationsByRegion).map(([region, locations]) => (
                <div key={region} className="animate-fade-in">
                  {/* Region Header */}
                  <div className="mb-8">
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-4">
                      <div className="w-2 h-12 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                      {region}
                    </h2>
                    <div className="ml-6 w-32 h-1 bg-gradient-to-r from-blue-600 to-transparent rounded-full"></div>
                  </div>

                  {/* Location Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locations.map((location) => {
                      const IconComponent = getIcon(location.icon);
                      return (
                        <Card 
                          key={location.id} 
                          className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-stone-800 overflow-hidden relative"
                        >
                          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                {location.logo_url ? (
                                  <div className="w-20 h-20 rounded-2xl bg-white dark:bg-stone-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all overflow-hidden p-2">
                                    <img 
                                      src={location.logo_url} 
                                      alt={location.name}
                                      className="w-full h-full object-contain"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-blue-500', 'to-indigo-600');
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                                    <IconComponent className="w-7 h-7 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                                  {location.name}
                                </h3>
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                                    <div className="text-sm">
                                      <div>{location.address}</div>
                                      <div className="font-medium">
                                        {location.postal_code} {location.city}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.address}, ${location.postal_code} ${location.city}`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group-hover:gap-3"
                                >
                                  {t("Avaa kartassa", "Open in Maps")}
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                  </svg>
                                </a>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && locationsByRegion && Object.keys(locationsByRegion).length === 0 && (
            <div className="text-center py-20">
              <MapPin className="w-20 h-20 mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t("Ei toimipisteitä", "No locations yet")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("Toimipisteet lisätään pian", "Locations will be added soon")}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
