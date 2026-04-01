import { createServerClient } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';
import { Info } from 'lucide-react';
import ScoreDashboardClient from './ScoreDashboardClient';

export const dynamic = 'force-dynamic';

export default async function ScoresPage() {
  const user = await requireAuth();
  const supabase = await createServerClient();

  const { data: initialScores } = await supabase
    .from('golf_scores')
    .select('*')
    .eq('user_id', user.id)
    .order('played_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 mt-16">
      <h1 className="font-syne text-3xl md:text-4xl font-bold text-white mb-6">My Golf Scores</h1>
      
      <div className="mb-8 p-4 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-xl flex items-start gap-3 w-full">
        <Info className="w-6 h-6 text-[#3B82F6] shrink-0 mt-0.5" />
        <div className="text-[#3B82F6]/90 text-sm leading-relaxed">
          <strong className="text-[#3B82F6] block mb-1">How it works</strong>
          Enter your stableford scores whenever you play a round. Our system automatically maintains a rolling limit of your 5 most recent scores. During the monthly draw, these 5 scores are your official entries!
        </div>
      </div>

      <ScoreDashboardClient initialScores={initialScores || []} />
    </div>
  );
}
