import { requireAdmin } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';
import WinnersTable from '@/components/admin/WinnersTable';

export const dynamic = 'force-dynamic';

export default async function AdminWinnersPage() {
  await requireAdmin();
  const supabase = await createServerClient();

  const { data: winners } = await supabase
    .from('draw_results')
    .select('*, draws(*), profiles(full_name, email, stripe_customer_id)')
    .gte('match_count', 3)
    .gt('prize_amount', 0)
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 md:p-10 space-y-6 pb-32">
      <div className="flex items-center justify-between">
        <h1 className="font-syne text-3xl md:text-4xl font-bold text-white">Winner Verifications</h1>
        <span className="text-white/40 text-sm">{winners?.length || 0} total winners</span>
      </div>
      <WinnersTable winners={winners || []} />
    </div>
  );
}
