import { useLanguage } from "@/lib/language-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Truck, ShoppingBag, MapPin, Phone, Mail } from "lucide-react";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderType: "delivery" | "pickup";
  orderNumber?: string;
  restaurantName?: string;
  restaurantAddress?: string;
  restaurantPhone?: string;
  restaurantEmail?: string;
}

export function OrderSuccessModal({
  isOpen,
  onClose,
  orderType,
  orderNumber,
  restaurantName = "Ravintola",
  restaurantAddress = "",
  restaurantPhone = "",
  restaurantEmail = ""
}: OrderSuccessModalProps) {
  const { t } = useLanguage();

  const getEstimatedTime = () => {
    if (orderType === "delivery") {
      return {
        icon: <Truck className="w-8 h-8 text-green-600" />,
        message: "Saat sähköpostin toimitusajasta kun tilaus on hyväksytty.",
        messageEn: "You will receive an email with the delivery time once your order is approved."
      };
    } else {
      return {
        icon: <ShoppingBag className="w-8 h-8 text-blue-600" />,
        message: "Saat sähköpostin noutamisajasta kun tilaus on hyväksytty.",
        messageEn: "You will receive an email with the pickup time once your order is approved."
      };
    }
  };

  const estimate = getEstimatedTime();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="flex flex-col items-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-600 animate-pulse" />
            <span className="text-2xl font-bold text-green-700">
              {t("Tilaus lähetetty!", "Order Placed!")}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-center">
          {/* Order Number */}
          {orderNumber && (
            <Card className="bg-gray-50 dark:bg-gray-800">
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("Tilausnumero", "Order Number")}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  #{orderNumber}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Success Message */}
          <div className="space-y-4">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {t("Kiitos tilauksestasi!", "Thank you for your order!")}
            </p>

            {/* Time Estimate */}
            <Card className={`${orderType === "delivery" ? "bg-green-50 dark:bg-green-900/20 border-green-200" : "bg-blue-50 dark:bg-blue-900/20 border-blue-200"}`}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-3">
                  {estimate.icon}
                  <div className="text-center">
                    <p className="text-base font-medium text-gray-900 dark:text-white px-4">
                      {t(estimate.message, estimate.messageEn)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <p>
              {t("Saat vahvistuksen sähköpostiin pian.", "You will receive an email confirmation shortly.")}
            </p>
          </div>

          {/* Restaurant Info */}
          {(restaurantAddress || restaurantPhone) && (
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200">
              <CardContent className="p-4">
                <div className="text-center space-y-1">
                  <p className="font-semibold text-red-800 dark:text-red-200">
                    {restaurantName}
                  </p>
                  {restaurantAddress && (
                    <p className="text-sm text-red-700 dark:text-red-300 flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {restaurantAddress}
                    </p>
                  )}
                  {restaurantPhone && (
                    <p className="text-sm text-red-700 dark:text-red-300 flex items-center justify-center gap-1">
                      <Phone className="w-3 h-3" />
                      {restaurantPhone}
                    </p>
                  )}
                  {restaurantEmail && (
                    <p className="text-sm text-red-700 dark:text-red-300 flex items-center justify-center gap-1">
                      <Mail className="w-3 h-3" />
                      {restaurantEmail}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Close Button */}
          <Button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            {t("Sulje", "Close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
