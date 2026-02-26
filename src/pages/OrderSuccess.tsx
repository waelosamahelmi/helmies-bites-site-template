import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useTenant } from '../contexts/tenant-context';

export function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenant } = useTenant();
  const orderId = location.state?.orderId;

  if (!orderId) {
    navigate('/');
    return null;
  }

  return (
    <div className="py-20 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center h-20 w-20 bg-green-100 rounded-full mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your order. We'll prepare it right away!
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-sm text-gray-600 mb-1">Order Number</p>
          <p className="text-2xl font-bold text-gray-900">
            #{orderId.slice(0, 8).toUpperCase()}
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-8">
          We've sent a confirmation to your email with order details.
        </p>

        <div className="space-y-3">
          <a
            href="/"
            className="block px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
          >
            Back to Menu
          </a>
          <a
            href={`tel:${tenant?.metadata?.phone || ''}`}
            className="block px-6 py-3 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50"
          >
            Call Restaurant
          </a>
        </div>
      </div>
    </div>
  );
}
