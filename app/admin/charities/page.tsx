import { requireAdmin } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';
import CharityManager from '@/components/admin/CharityManager';

export const dynamic = 'force-dynamic';

export default async function AdminCharitiesPage() {
  await requireAdmin();
  const supabase = await createServerClient();

  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .order('name');

  return (
    <div className="p-6 md:p-10 space-y-6 pb-32">
      <div className="flex items-center justify-between">
        <h1 className="font-syne text-3xl md:text-4xl font-bold text-white">Charity Management</h1>
        <span className="text-white/40 text-sm">{charities?.length || 0} total charities</span>
      </div>
      <CharityManager initialCharities={charities || []} />
    </div>
  );
}
