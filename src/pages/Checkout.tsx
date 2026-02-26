import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/language-context';
import { useCart } from '../contexts/cart-context';
import { useTenant } from '../contexts/tenant-context';
import { supabase } from '../lib/supabase';

export function Checkout() {
  const { t } = useLanguage();
  const { items, total, clearCart } = useCart();
  const { tenant } = useTenant();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryType: 'pickup' as 'delivery' | 'pickup',
    address: '',
    specialInstructions: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          tenant_id: tenant?.id,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          delivery_type: formData.deliveryType,
          delivery_address: formData.address,
          items: items.map(item => ({
            menuItemId: item.menuItemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            toppings: item.toppings,
            specialInstructions: item.specialInstructions,
          })),
          subtotal: total,
          delivery_fee: formData.deliveryType === 'delivery' ? 5 : 0,
          total_amount: total + (formData.deliveryType === 'delivery' ? 5 : 0),
          special_instructions: formData.specialInstructions,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      clearCart();
      navigate('/success', { state: { orderId: order.id } });
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const deliveryFee = formData.deliveryType === 'delivery' ? 5 : 0;
  const grandTotal = total + deliveryFee;

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('cart.checkout')}</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">{t('cart.empty')}</p>
            <a href="/menu" className="text-orange-600 font-medium">
              Browse Menu →
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
              {items.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 mt-4 border-t border-gray-200">
                <span>{t('cart.total')}</span>
                <span className="font-semibold">€{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Type
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'pickup' }))}
                  className={`flex-1 p-4 border-2 rounded-lg text-center ${
                    formData.deliveryType === 'pickup'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200'
                  }`}
                >
                  {t('order.pickup')}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'delivery' }))}
                  className={`flex-1 p-4 border-2 rounded-lg text-center ${
                    formData.deliveryType === 'delivery'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200'
                  }`}
                >
                  {t('order.delivery')} (+€5)
                </button>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {formData.deliveryType === 'delivery' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('order.note')}
                </label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Total */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>€{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full px-6 py-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : t('order.place')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
