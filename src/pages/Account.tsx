import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';

export function Account() {
  const navigate = useNavigate();
  const { customer, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-xl font-bold mb-2">Welcome</h2>
        <p className="text-gray-500 mb-6">Sign in to view your account</p>
        <div className="flex gap-3">
          <Link to="/login" className="bg-primary-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-600">
            Sign In
          </Link>
          <Link to="/register" className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-200">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4">
        <h2 className="font-semibold text-lg">{customer?.name}</h2>
        <p className="text-gray-500 text-sm">{customer?.email}</p>
        {customer?.phone && <p className="text-gray-500 text-sm">{customer.phone}</p>}
        {customer?.loyalty_points !== undefined && (
          <div className="mt-3 inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
            {customer.loyalty_points} loyalty points
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Link to="/loyalty" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:bg-gray-50">
          <span className="font-medium">Loyalty Program</span>
          <p className="text-sm text-gray-500">View rewards and points history</p>
        </Link>
        <Link to="/orders" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:bg-gray-50">
          <span className="font-medium">Order History</span>
          <p className="text-sm text-gray-500">View your past orders</p>
        </Link>
      </div>

      <button
        onClick={async () => { await logout(); navigate('/'); }}
        className="mt-6 text-red-600 text-sm font-medium hover:underline"
      >
        Sign Out
      </button>
    </div>
  );
}
