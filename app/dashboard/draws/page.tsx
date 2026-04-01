import { createServerClient } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';
import { Trophy, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DrawsPage() {
  const user = await requireAuth();
  const supabase = await createServerClient();

  // Fetch results and join correctly assuming draws relationship is correct in database.sql
  const { data: rawDrawResults } = await supabase
    .from('draw_results')
    .select('*, draws(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const drawResults = rawDrawResults || [];

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 mt-16 md:mt-0 pb-32">
      <h1 className="font-syne text-3xl font-bold text-white mb-8">Draw History</h1>

      {drawResults.length === 0 ? (
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 text-center shadow-xl">
          <Trophy className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">No draws concluded yet</h2>
          <p className="text-white/50 mb-6 max-w-sm mx-auto">Your first draw happens automatically at the end of this month based on the scores you log.</p>
          <Link href="/dashboard/scores" className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors text-sm font-medium">
            Log some scores
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {drawResults.map((dr: any) => {
            const drawData = dr.draws;
            const hasWon = dr.prize_amount > 0;
            return (
              <div key={dr.id} className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className={`p-4 border-b border-white/5 flex items-center justify-between ${hasWon ? 'bg-[#F59E0B]/10' : 'bg-white/5'}`}>
                  <p className="font-medium text-white capitalize">{drawData.draw_month} Draw</p>
                  <span className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full border ${hasWon ? 'border-[#F59E0B]/30 text-[#F59E0B] bg-[#F59E0B]/10' : 'border-white/10 text-white/40 bg-white/5'}`}>
                    {hasWon ? 'WINNER' : 'NO MATCH'}
                  </span>
                </div>
                
                <div className="p-6 grid md:grid-cols-3 gap-8">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-3 font-medium">Draw Algorithm Numbers</p>
                    <div className="flex flex-wrap gap-2">
                       {drawData.drawn_numbers.map((n: number, i: number) => {
                        const isMatched = dr.matched_numbers.includes(n);
                        return (
                          <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${isMatched ? 'bg-[#10B981] text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-[#0A0A0F] border border-white/10 text-white/50'}`}>
                            {n}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-3 font-medium">Your 5 Entered Scores</p>
                    <div className="flex flex-wrap gap-2">
                       {dr.user_scores.map((n: number, i: number) => {
                        const isMatched = dr.matched_numbers.includes(n);
                        return (
                          <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${isMatched ? 'border-[#10B981] text-[#10B981]' : 'border-white/10 text-white/30 bg-[#0A0A0F]'}`}>
                            {n}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="text-left md:text-right border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-2 font-medium">Prize Awarded</p>
                    <p className={`font-syne text-4xl font-bold ${hasWon ? 'text-[#F59E0B]' : 'text-white/20'}`}>
                      {formatCurrency(dr.prize_amount || 0)}
                    </p>
                    {hasWon && (
                      <div className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Status: {dr.payment_status}
                      </div>
                    )}
                    <p className="text-xs text-white/30 mt-4 leading-relaxed max-w-[200px] md:ml-auto">
                      Match count: {dr.match_count}. Payouts depend on the matching tier bracket.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
