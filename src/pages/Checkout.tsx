import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { useLanguage } from '../contexts/language-context';
import { useCart } from '../contexts/cart-context';
import { useTenant } from '../contexts/tenant-context';
import { useBranches } from '../hooks/use-branches';
import { supabase } from '../lib/supabase';
import { getStripe } from '../lib/stripe-client';
import { createPaymentIntent } from '../lib/payment-api';
import { StripePaymentForm } from '../components/stripe-payment-form';
import { CreditCard, Banknote, Loader2 } from 'lucide-react';

type PaymentMethod = 'cash' | 'card' | 'stripe';

export function Checkout() {
  const { t } = useLanguage();
  const { items, total, clearCart } = useCart();
  const { tenant } = useTenant();
  const { data: branches } = useBranches();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryType: 'pickup' as 'delivery' | 'pickup',
    address: '',
    branchId: '',
    specialInstructions: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripeReady, setStripeReady] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (branches && branches.length > 0 && !formData.branchId) {
      setFormData(prev => ({ ...prev, branchId: String(branches[0].id) }));
    }
  }, [branches]);

  const deliveryFee = formData.deliveryType === 'delivery' ? 5 : 0;
  const grandTotal = total + deliveryFee;

  const generateOrderNumber = () => {
    const prefix = 'ORD';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const createOrder = async (paymentStatus: string, paymentIntentId?: string) => {
    const orderNumber = generateOrderNumber();

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        tenant_id: tenant?.id,
        order_number: orderNumber,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        delivery_type: formData.deliveryType,
        delivery_address: formData.deliveryType === 'delivery' ? formData.address : null,
        branch_id: formData.branchId ? Number(formData.branchId) : null,
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
        delivery_fee: deliveryFee,
        total_amount: grandTotal,
        special_instructions: formData.specialInstructions,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        payment_intent_id: paymentIntentId || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return order;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (paymentMethod === 'stripe') {
      setIsProcessing(true);
      try {
        const order = await createOrder('pending');
        setOrderId(order.id);

        const result = await createPaymentIntent({
          amount: grandTotal,
          currency: 'eur',
          metadata: {
            orderId: order.id,
            orderNumber: order.order_number,
            customerEmail: formData.email,
            customerName: formData.name,
          },
        });

        setStripeClientSecret(result.clientSecret!);
        setStripeReady(true);
      } catch (error) {
        console.error('Failed to setup payment:', error);
        alert('Failed to setup payment. Please try again.');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    setIsProcessing(true);
    try {
      await createOrder('pending');
      clearCart();
      navigate('/success');
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripeSuccess = async (paymentIntentId: string) => {
    if (orderId) {
      await supabase
        .from('orders')
        .update({ payment_status: 'paid', payment_intent_id: paymentIntentId })
        .eq('id', orderId);
    }
    clearCart();
    navigate('/success');
  };

  const handleStripeError = (error: string) => {
    console.error('Payment failed:', error);
  };

  const handleStripeCancel = () => {
    setStripeReady(false);
    setStripeClientSecret(null);
  };

  const stripePromise = getStripe();

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('cart.checkout')}</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">{t('cart.empty')}</p>
            <a href="/menu" className="text-orange-600 font-medium">
              Browse Menu
            </a>
          </div>
        ) : stripeReady && stripeClientSecret ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Complete Payment</h2>
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: stripeClientSecret,
                appearance: { theme: 'stripe' },
              }}
            >
              <StripePaymentForm
                clientSecret={stripeClientSecret}
                amount={grandTotal}
                onSuccess={handleStripeSuccess}
                onError={handleStripeError}
                onCancel={handleStripeCancel}
              />
            </Elements>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
              {items.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-medium">{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {deliveryFee > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span>{t('order.delivery')} fee</span>
                  <span className="font-medium">{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 mt-2 border-t-2 border-gray-300">
                <span className="font-semibold">{t('cart.total')}</span>
                <span className="font-bold text-lg">{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'pickup' }))}
                  className={`flex-1 p-4 border-2 rounded-lg text-center ${
                    formData.deliveryType === 'pickup' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  {t('order.pickup')}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'delivery' }))}
                  className={`flex-1 p-4 border-2 rounded-lg text-center ${
                    formData.deliveryType === 'delivery' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  {t('order.delivery')} (+5.00)
                </button>
              </div>
            </div>

            {/* Branch Selection for Pickup */}
            {formData.deliveryType === 'pickup' && branches && branches.length > 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Branch</label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData(prev => ({ ...prev, branchId: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} - {branch.address}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('order.note')}</label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                    paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Cash on Delivery/Pickup</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                    paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Card at Counter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                    paymentMethod === 'stripe' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Pay Online (Stripe)</span>
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full px-6 py-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing && <Loader2 className="w-5 h-5 animate-spin" />}
              {isProcessing
                ? 'Processing...'
                : paymentMethod === 'stripe'
                  ? `Pay ${grandTotal.toFixed(2)}`
                  : t('order.place')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
