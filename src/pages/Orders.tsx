import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { useTenant } from '../contexts/tenant-context';
import { useWebSocket } from '../hooks/use-websocket';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  order_number: string;
  order_type: string;
  status: string;
  total_amount: number;
  created_at: string;
}

export function Orders() {
  const navigate = useNavigate();
  const { customer, isAuthenticated } = useAuth();
  const { tenant } = useTenant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const { isConnected } = useWebSocket({
    onMessage: (data) => {
      if (data.type === 'order_update' || data.type === 'order_status_changed') {
        loadOrders();
      }
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [isAuthenticated, tenant]);

  async function loadOrders() {
    if (!tenant || !customer) return;
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('tenant_id', tenant.id)
      .eq('customer_email', customer.email)
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setOrders(data);
    setLoading(false);
  }

  const statusSteps = ['pending', 'accepted', 'preparing', 'ready', 'completed'];

  const statusLabels: Record<string, string> = {
    pending: 'Pending',
    accepted: 'Accepted',
    preparing: 'Preparing',
    ready: 'Ready',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    ready: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Order History</h1>
        {isConnected && (
          <span className="flex items-center gap-1.5 text-xs text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live updates
          </span>
        )}
      </div>
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="bg-gray-100 rounded-xl h-20" />)}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No orders yet</p>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const isActive = ['pending', 'accepted', 'preparing', 'ready'].includes(order.status);
            const currentStep = statusSteps.indexOf(order.status);

            return (
              <div
                key={order.id}
                className={`bg-white rounded-xl p-4 border shadow-sm ${
                  isActive ? 'border-orange-200' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">#{order.order_number}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>

                {isActive && currentStep >= 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-1">
                      {statusSteps.slice(0, -1).map((step, i) => (
                        <div
                          key={step}
                          className={`flex-1 h-1.5 rounded-full transition-colors ${
                            i <= currentStep ? 'bg-orange-500' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-gray-400">Ordered</span>
                      <span className="text-[10px] text-gray-400">Ready</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                  <span>{order.order_type === 'delivery' ? 'Delivery' : 'Pickup'}</span>
                  <span className="font-bold text-gray-900">
                    {new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' }).format(order.total_amount)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(order.created_at).toLocaleDateString('fi-FI', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
