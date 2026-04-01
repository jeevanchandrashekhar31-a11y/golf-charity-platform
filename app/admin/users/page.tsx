import { requireAdmin } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';
import UserTable from '@/components/admin/UserTable';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  await requireAdmin();
  const supabase = await createServerClient();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch score counts per user
  const { data: scoreCounts } = await supabase
    .from('golf_scores')
    .select('user_id');

  const scoresByUser: Record<string, number> = {};
  scoreCounts?.forEach((s: any) => {
    scoresByUser[s.user_id] = (scoresByUser[s.user_id] || 0) + 1;
  });

  const users = (profiles || []).map((p: any) => ({
    ...p,
    scores_count: scoresByUser[p.id] || 0,
  }));

  return (
    <div className="p-6 md:p-10 space-y-6 pb-32">
      <div className="flex items-center justify-between">
        <h1 className="font-syne text-3xl md:text-4xl font-bold text-white">All Users</h1>
        <span className="text-white/40 text-sm">{users.length} total accounts</span>
      </div>
      <UserTable users={users} />
    </div>
  );
}
