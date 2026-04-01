import { createServerClient } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';
import CharityClient from './CharityClient';

export const dynamic = 'force-dynamic';

export default async function CharityPage() {
  const user = await requireAuth();
  const supabase = await createServerClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('selected_charity_id, charity_contribution_percentage')
    .eq('id', user.id)
    .single();
  
  let selectedCharity = null;
  if (profile?.selected_charity_id) {
    const { data } = await supabase
      .from('charities')
      .select('*')
      .eq('id', profile.selected_charity_id)
      .single();
    selectedCharity = data;
  }

  const { data: allCharities } = await supabase
    .from('charities')
    .select('*')
    .order('name');

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 mt-16 md:mt-0 pb-32">
      <h1 className="font-syne text-3xl md:text-4xl font-bold text-white mb-8">My Impact</h1>
      <CharityClient 
        initialCharity={selectedCharity} 
        allCharities={allCharities || []} 
        initialPercentage={profile?.charity_contribution_percentage || 10} 
      />
    </div>
  );
}
