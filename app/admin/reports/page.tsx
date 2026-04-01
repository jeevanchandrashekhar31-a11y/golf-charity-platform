import { requireAdmin } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';
import ReportsPanel from '@/components/admin/ReportsPanel';

export const dynamic = 'force-dynamic';

function getLast6Months() {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(d.toISOString().slice(0, 7)); // e.g. "2025-10"
  }
  return months;
}

function monthLabel(iso: string) {
  const [year, month] = iso.split('-');
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
}

export default async function AdminReportsPage() {
  await requireAdmin();
  const supabase = await createServerClient();

  const months = getLast6Months();
  const startDate = months[0] + '-01';

  // Monthly Revenue: count active subscriptions per period (approximation via payments)
  const { data: payments } = await supabase
    .from('payments')
    .select('amount, created_at')
    .eq('status', 'verified')
    .gte('created_at', startDate);

  // Group revenue by month
  const revenueByMonth: Record<string, number> = {};
  months.forEach(m => { revenueByMonth[m] = 0; });
  payments?.forEach((p: any) => {
    const m = p.created_at.slice(0, 7);
    if (revenueByMonth[m] !== undefined) revenueByMonth[m] += Number(p.amount || 0);
  });

  const monthlyRevenue = months.map(m => ({
    month: monthLabel(m),
    revenue: Math.round(revenueByMonth[m]),
  }));

  // Subscriber trend: count profiles with subscription_status='active' at each month
  // Approximation: count total active users now repeated (simplification - real app would use timeseries)
  const { count: activeNow } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active');

  // Build a rough trend based on created_at < month cutoff
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('created_at, subscription_status');

  const subscriberTrend = months.map(m => {
    const cutoff = m + '-31';
    const count = allProfiles?.filter(p => p.created_at <= cutoff && p.subscription_status === 'active').length || 0;
    return { month: monthLabel(m), subscribers: count };
  });

  // Charity distribution: total_contributions per charity
  const { data: charities } = await supabase
    .from('charities')
    .select('name, total_contributions')
    .gt('total_contributions', 0)
    .order('total_contributions', { ascending: false });

  const charityDistribution = (charities || [])
    .slice(0, 6)
    .map(c => ({ name: c.name, value: Number(c.total_contributions) }));

  // Draw stats
  const { data: draws } = await supabase
    .from('draws')
    .select('*, draw_results(match_count, prize_amount)')
    .order('draw_month', { ascending: false })
    .limit(12);

  const drawStats = (draws || []).map((d: any) => {
    const results = d.draw_results || [];
    return {
      id: d.id,
      draw_month: d.draw_month,
      total_prize_pool: d.total_prize_pool,
      jackpot_rollover: d.jackpot_rollover,
      match5_winners: results.filter((r: any) => r.match_count === 5 && r.prize_amount > 0).length,
      match4_winners: results.filter((r: any) => r.match_count === 4 && r.prize_amount > 0).length,
    };
  });

  return (
    <div className="p-6 md:p-10 space-y-6">
      <h1 className="font-syne text-3xl md:text-4xl font-bold text-white">Platform Reports</h1>
      <ReportsPanel
        monthlyRevenue={monthlyRevenue}
        subscriberTrend={subscriberTrend}
        charityDistribution={charityDistribution}
        drawStats={drawStats}
      />
    </div>
  );
}
