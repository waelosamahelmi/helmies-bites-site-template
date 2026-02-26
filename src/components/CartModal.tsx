import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../contexts/cart-context';
import { useLanguage } from '../contexts/language-context';

export function CartModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, total, updateQuantity, removeItem, itemCount } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Floating Cart Button (Mobile) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 h-14 w-14 bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center z-40"
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Desktop Cart Summary */}
      <div className="hidden md:block">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          <ShoppingCart className="h-5 w-5" />
          {t('cart.title')}
          {itemCount > 0 && `(${itemCount})`}
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

          <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-gray-900" />
                <h2 className="text-xl font-semibold text-gray-900">{t('cart.title')}</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t('cart.empty')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.menuItemId + item.size + item.toppings?.join(',')} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        {item.size && (
                          <p className="text-sm text-gray-500">Size: {item.size}</p>
                        )}
                        {item.toppings && item.toppings.length > 0 && (
                          <p className="text-sm text-gray-500">
                            Toppings: {item.toppings.join(', ')}
                          </p>
                        )}
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          €{item.price.toFixed(2)} each
                        </p>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.menuItemId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">{t('cart.total')}</span>
                  <span className="text-xl font-bold text-gray-900">€{total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
                >
                  {t('cart.checkout')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
