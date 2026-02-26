import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { useRestaurant } from "@/lib/restaurant-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function HeroVideoWithPromotions() {
  const { t } = useLanguage();
  const { config } = useRestaurant();
  const [currentPromo, setCurrentPromo] = useState(0);

  // Mock promotions data
  const promotions = [
    {
      title: "Free Delivery",
      description: "On orders over $50",
      buttonText: "Order Now",
      link: "/menu",
    },
    {
      title: "New Menu Items",
      description: "Try our latest dishes",
      buttonText: "View Menu",
      link: "/menu",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promotions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [promotions.length]);

  const current = promotions[currentPromo];

  return (
    <div className="relative h-96 overflow-hidden">
      {/* Background video or image */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600" />

      {/* Promotions overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Card className="bg-black/20 backdrop-blur-sm border-white/20 max-w-lg mx-4">
          <CardContent className="p-6 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">{current.title}</h2>
            <p className="text-xl mb-4">{current.description}</p>
            <Button asChild className="bg-white text-black hover:bg-gray-100">
              <a href={current.link}>{current.buttonText}</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}