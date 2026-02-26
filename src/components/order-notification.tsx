import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock, AlertTriangle, Phone, MapPin, Euro, Truck, Store } from "lucide-react";

interface OrderNotificationProps {
  order: any;
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}

export function OrderNotification({ order, isOpen, onAccept, onDecline, onClose }: OrderNotificationProps) {
  const { t, language } = useLanguage();
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Play notification sound
  useEffect(() => {
    if (isOpen && !audioPlaying) {
      setAudioPlaying(true);
      playNotificationSound();
    }
  }, [isOpen, audioPlaying]);

  const playNotificationSound = () => {
    // Create notification sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Create urgent notification tone
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.3);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.6);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.9);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.9);

      // Repeat sound every 3 seconds until closed
      const interval = setInterval(() => {
        if (!isOpen) {
          clearInterval(interval);
          setAudioPlaying(false);
          return;
        }

        const newOscillator = audioContext.createOscillator();
        const newGainNode = audioContext.createGain();

        newOscillator.connect(newGainNode);
        newGainNode.connect(audioContext.destination);

        newOscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        newOscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.3);
        newOscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.6);

        newGainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        newGainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.9);

        newOscillator.start(audioContext.currentTime);
        newOscillator.stop(audioContext.currentTime + 0.9);
      }, 3000);

    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 rounded-lg border-2 border-orange-500 bg-orange-50 dark:bg-orange-900/20">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <span className="text-lg font-bold">
              {t("UUSI TILAUS!", "NEW ORDER!", "طلب جديد!")}
            </span>
          </DialogTitle>
        </DialogHeader>

        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-900 dark:text-white">
                {t("Tilaus", "Order", "طلب")} #{order.orderNumber}
              </CardTitle>
              <Badge variant="destructive" className="animate-pulse">
                <Clock className="w-4 h-4 mr-1" />
                {t("ODOTTAA", "PENDING", "في الانتظار")}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Customer Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {order.customerName}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <span>{order.customerPhone}</span>
              </div>

              {/* Order Type */}
              <div className="flex items-center space-x-2 mt-3">
                {order.orderType === "delivery" ? (
                  <>
                    <Truck className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-700 dark:text-green-400">
                      {t("Kotiinkuljetus", "Delivery", "توصيل")}
                    </span>
                  </>
                ) : (
                  <>
                    <Store className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-700 dark:text-blue-400">
                      {t("Nouto", "Pickup", "استلام")}
                    </span>
                  </>
                )}
              </div>

              {/* Delivery Address */}
              {order.deliveryAddress && (
                <div className="flex items-start space-x-2 mt-2">
                  <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {order.deliveryAddress}
                  </span>
                </div>
              )}
            </div>

            {/* Order Total */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {t("Yhteensä", "Total", "المجموع")}:
                </span>
                <div className="flex items-center space-x-1">
                  <Euro className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {parseFloat(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {order.specialInstructions && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                <div className="text-sm">
                  <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                    {t("Erityisohjeet", "Special Instructions", "تعليمات خاصة")}:
                  </span>
                  <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                    {order.specialInstructions}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={onAccept}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {t("HYVÄKSY", "ACCEPT", "قبول")}
              </Button>
              <Button
                onClick={onDecline}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                <XCircle className="w-5 h-5 mr-2" />
                {t("HYLKÄÄ", "DECLINE", "رفض")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
