import { createServerClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import DrawControl from '@/components/admin/DrawControl';

export const dynamic = 'force-dynamic';

export default async function AdminDrawsPage() {
  await requireAdmin();
  const supabase = await createServerClient();

  const { data: history } = await supabase
    .from('draws')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 mt-16 md:mt-0 pb-32">
      <h1 className="font-syne text-3xl md:text-4xl font-bold text-white mb-8">System Draw Operations</h1>
      <DrawControl history={history || []} />
    </div>
  );
}
