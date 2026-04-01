'use client';

import { useState } from 'react';
import { GolfScore } from '@/types';
import ScoreEntry from '@/components/dashboard/ScoreEntry';
import ScoreHistory from '@/components/dashboard/ScoreHistory';
import { createBrowserClient } from '@/lib/supabase-client';

export default function ScoreDashboardClient({ initialScores }: { initialScores: GolfScore[] }) {
  const [scores, setScores] = useState<GolfScore[]>(initialScores);
  const supabase = createBrowserClient();

  const fetchScores = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data } = await supabase
      .from('golf_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('played_at', { ascending: false });
      
    if (data) setScores(data as GolfScore[]);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 xl:col-span-4">
        <ScoreEntry onScoreAdded={fetchScores} />
      </div>
      <div className="lg:col-span-7 xl:col-span-8">
        <ScoreHistory scores={scores} onScoreChange={fetchScores} />
      </div>
    </div>
  );
}
