import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { useTenant } from '../contexts/tenant-context';
import { supabase } from '../lib/supabase';

interface LoyaltyReward {
  id: string;
  name: string;
  name_en?: string;
  points_required: number;
  discount_type: string;
  discount_value: number;
}

interface LoyaltyTransaction {
  id: string;
  points: number;
  type: 'earned' | 'redeemed';
  description: string;
  created_at: string;
}

export function Loyalty() {
  const navigate = useNavigate();
  const { customer, isAuthenticated } = useAuth();
  const { tenant } = useTenant();
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, tenant]);

  async function loadData() {
    if (!tenant) return;

    const [rewardsRes, txRes] = await Promise.all([
      supabase.from('loyalty_rewards').select('*').eq('tenant_id', tenant.id).eq('is_active', true).order('points_required'),
      customer ? supabase.from('loyalty_transactions').select('*').eq('customer_id', customer.id).order('created_at', { ascending: false }).limit(20) : null,
    ]);

    if (rewardsRes.data) setRewards(rewardsRes.data);
    if (txRes?.data) setTransactions(txRes.data);
  }

  const points = customer?.loyalty_points || 0;

  const handleRedeem = async (reward: LoyaltyReward) => {
    if (!customer || points < reward.points_required) return;
    try {
      await supabase.from('customers').update({ loyalty_points: points - reward.points_required }).eq('id', customer.id);
      await supabase.from('loyalty_transactions').insert({
        customer_id: customer.id,
        points: -reward.points_required,
        type: 'redeemed',
        description: `Redeemed: ${reward.name}`,
      });
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Loyalty Program</h1>

      {/* Points Card */}
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white mb-6">
        <p className="text-sm text-white/80 mb-1">Your Points</p>
        <p className="text-4xl font-extrabold">{points}</p>
        <p className="text-xs text-white/70 mt-1">Earn points with every order</p>
      </div>

      {/* Rewards */}
      {rewards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Available Rewards</h2>
          <div className="space-y-3">
            {rewards.map(reward => (
              <div key={reward.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-medium">{reward.name}</p>
                  <p className="text-sm text-gray-500">{reward.points_required} points</p>
                </div>
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={points < reward.points_required}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    points >= reward.points_required
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  Redeem
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      {transactions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Points History</h2>
          <div className="space-y-2">
            {transactions.map(tx => (
              <div key={tx.id} className="bg-white rounded-lg px-4 py-3 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm">{tx.description}</p>
                  <p className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-sm font-bold ${tx.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'earned' ? '+' : ''}{tx.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
