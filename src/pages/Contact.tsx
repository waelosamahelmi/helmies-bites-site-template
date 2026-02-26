import { useLanguage } from "@/lib/language-context";
import { useRestaurant } from "@/lib/restaurant-context";
import ContactSection from "@/components/contact-section";
import { UniversalHeader } from "@/components/universal-header";
import { Footer } from "@/components/Footer";

export default function Contact() {
  const { t } = useLanguage();
  const { config } = useRestaurant();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900">
      <UniversalHeader />
      
      {/* Page Header */}
      <div className="relative bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white py-24 overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <div className="inline-block mb-6">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30 shadow-lg">
              <span className="text-sm font-bold uppercase tracking-wider">
                {t("Ota yhteyttä", "Get in Touch")}
              </span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            {t("Yhteystiedot", "Contact")}
          </h1>
          <p className="text-xl md:text-3xl opacity-90 max-w-3xl mx-auto font-light">
            {t("Ota yhteyttä tai tule käymään", "Get in touch or visit us")}
          </p>
          {/* Decorative line */}
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>

      <ContactSection />
      <Footer />
    </div>
  );
}