import { useLanguage } from "@/lib/language-context";
import { useRestaurant } from "@/lib/restaurant-context";
import { AboutSection } from "@/components/about-section";
import { usePageVariant } from "@/hooks/use-page-variant";
import { cn } from "@/lib/utils";
import { UniversalHeader } from "@/components/universal-header";
import { Footer } from "@/components/Footer";

export default function About() {
  const { t } = useLanguage();
  const { config } = useRestaurant();
  const variant = usePageVariant('about');
  
  // Get theme colors
  const theme = config?.theme || {};
  const primaryColor = theme.primary || '#8B4513';
  const secondaryColor = theme.secondary || '#FF8C00';
  const fonts = theme.fonts || { heading: 'Inter', body: 'Inter' };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900">
      <UniversalHeader />
      
      {/* Page Header */}
      <div className="relative bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 text-white py-24 overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <div className="inline-block mb-6">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30 shadow-lg">
              <span className="text-sm font-bold uppercase tracking-wider">
                {t("Tarinaamme", "Our Story")}
              </span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            {t("Meistä", "About Us")}
          </h1>
          <p className="text-xl md:text-3xl opacity-90 max-w-3xl mx-auto font-light">
            {t(`Tutustu ${config.name}n tarinaan`, `Learn about ${config.nameEn}'s story`)}
          </p>
          {/* Decorative line */}
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>

      <AboutSection />
      <Footer />
    </div>
  );
}