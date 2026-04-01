import { createServerClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { Users, CreditCard, Heart, AlertCircle, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  await requireAdmin();
  const supabase = await createServerClient();

  const [{ count: totalUsers }, { count: activeSubs }, { data: pendingWinnings }, { data: charities }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active'),
    supabase.from('draw_results').select('id').eq('payment_status', 'pending').gt('prize_amount', 0),
    supabase.from('charities').select('total_contributions')
  ]);

  const pendingCount = pendingWinnings?.length || 0;
  const totalCharityContributions = charities?.reduce((acc, curr) => acc + Number(curr.total_contributions || 0), 0) || 0;
  
  const estimatedPoolThisMonth = (activeSubs || 0) * 599;

  const { data: recentSignups } = await supabase
    .from('profiles')
    .select('id, full_name, email, subscription_status, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  const stats = [
    { name: 'Total Users', value: totalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Active Subscribers', value: activeSubs || 0, icon: CreditCard, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' },
    { name: 'Total Charity Generated', value: formatCurrency(totalCharityContributions), icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { name: 'Est. Pool This Month', value: formatCurrency(estimatedPoolThisMonth), icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { name: 'Pending Winner Verifications', value: pendingCount, icon: AlertCircle, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 pb-32">
      <h1 className="font-syne text-3xl md:text-4xl font-bold text-white mb-2">Platform Overview</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm mb-1 font-medium">{stat.name}</p>
              <p className="font-syne text-3xl font-bold text-white">{stat.value}</p>
            </div>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg} shrink-0`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Signups</h2>
          <Link href="/admin/users" className="text-sm text-[#10B981] hover:underline">View All Users</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0A0A0F] text-white/50 text-xs uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {recentSignups?.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold">{user.full_name || 'N/A'}</p>
                    <p className="text-xs text-white/50">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${user.subscription_status === 'active' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' : 'bg-white/5 text-white/50 border-white/10'}`}>
                      {user.subscription_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/50">
                    {new Date(user.created_at).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
