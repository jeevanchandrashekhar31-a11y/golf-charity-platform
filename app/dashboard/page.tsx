import { createServerClient } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';
import SubscriptionStatus from '@/components/dashboard/SubscriptionStatus';
import WinningsCard from '@/components/dashboard/WinningsCard';
import { Trophy, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ searchParams }: { searchParams: { subscribed?: string } }) {
  const user = await requireAuth();
  const supabase = await createServerClient();

  const [{ data: profile }, { data: scores }, { data: winnings }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('golf_scores').select('id, score, played_at').eq('user_id', user.id).order('played_at', { ascending: false }).limit(5),
    supabase.from('draw_results').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  ]);

  const totalWon = winnings?.reduce((acc, curr) => acc + (curr.prize_amount || 0), 0) || 0;
  const hasPending = winnings?.some(w => w.payment_status === 'pending') || false;
  const drawsEntered = winnings?.length || 0;

  const nextDrawDate = new Date();
  nextDrawDate.setMonth(nextDrawDate.getMonth() + 1);
  nextDrawDate.setDate(1);

  return (
    <div className="p-6 md:p-10 space-y-8 pb-32 md:pb-10">
      {searchParams.subscribed === 'true' && (
        <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] font-medium flex items-center gap-3 animate-in slide-in-from-top fade-in duration-500">
          <Trophy className="w-5 h-5" />
          Welcome back! Your subscription was fully confirmed.
        </div>
      )}

      <div>
        <h1 className="font-syne text-3xl md:text-4xl font-bold text-white mb-2">Welcome back, {profile?.full_name?.split(' ')[0] || 'Golfer'} 👋</h1>
        <p className="text-white/60">Your golf scores are turning into real impact.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <SubscriptionStatus 
            status={profile?.subscription_status || 'inactive'}
            plan={profile?.subscription_plan}
            endDate={profile?.subscription_end_date}
          />
        </div>
        
        <div className="lg:col-span-2">
          <WinningsCard 
            totalWon={totalWon} 
            drawsEntered={drawsEntered} 
            hasPending={hasPending} 
          />
        </div>

        <div className="lg:col-span-2 bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50 mb-1">Active Entries</p>
            <div className="flex items-baseline gap-2">
              <span className="font-syne text-4xl font-bold text-white">{scores?.length || 0}</span>
              <span className="text-white/50">/ 5 scores</span>
            </div>
            {scores && scores.length < 5 && (
              <p className="text-xs text-[#10B981] mt-2">Log {5 - scores.length} more scores to maximize chances!</p>
            )}
            <Link href="/dashboard/scores" className="text-xs text-[#10B981] mt-3 inline-block hover:underline">Manage scores →</Link>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <Trophy className="w-8 h-8 text-[#10B981]" />
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#10B981]/10 border border-[#10B981]/20 rounded-2xl p-6 shadow-xl flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#10B981]/20 rounded-full blur-[50px] pointer-events-none" />
          <div>
            <p className="text-sm text-[#10B981]/80 mb-1 uppercase tracking-wider font-bold">Next Draw</p>
            <p className="font-syne text-3xl font-bold text-white mb-1">
              {nextDrawDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
            </p>
            <p className="text-xs text-white/60">Estimated jackpot pool: £14,250</p>
          </div>
          <Clock className="w-10 h-10 text-[#10B981] opacity-80" />
        </div>
      </div>
      
      <div className="pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-syne text-2xl font-bold text-white">Recent Draws</h2>
          <Link href="/dashboard/draws" className="text-sm text-white/50 hover:text-white">View all</Link>
        </div>
        
        {winnings && winnings.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {winnings.slice(0, 3).map((w, i) => (
              <div key={i} className="bg-[#111827] border border-white/5 rounded-xl p-5 hover:border-[#10B981]/30 transition-colors cursor-pointer">
                <p className="text-xs text-white/50 mb-3">{new Date(w.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })} Draw</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-medium text-white mb-1">{w.match_count} Matches</p>
                    <p className="text-2xl font-syne font-bold text-[#10B981]">{formatCurrency(w.prize_amount || 0)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#111827] border border-white/5 rounded-xl p-8 text-center">
            <Trophy className="w-10 h-10 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No draws entered yet</h3>
            <p className="text-white/50 text-sm">Your first draw will occur at the end of this month.</p>
          </div>
        )}
      </div>
    </div>
  );
}
