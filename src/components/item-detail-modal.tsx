import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  image_url?: string;
}

interface ItemDetailModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
}

export function ItemDetailModal({ item, isOpen, onClose, onAddToCart }: ItemDetailModalProps) {
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl">{item.name}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          <p className="text-gray-600">{item.description}</p>

          <div className="flex gap-2 flex-wrap">
            {item.is_vegetarian && (
              <Badge variant="secondary">Vegetarian</Badge>
            )}
            {item.is_vegan && (
              <Badge variant="secondary">Vegan</Badge>
            )}
            {item.is_gluten_free && (
              <Badge variant="secondary">Gluten-Free</Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">${item.price.toFixed(2)}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={() => {
              onAddToCart(quantity);
              onClose();
            }}
          >
            {t('cart.add')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}