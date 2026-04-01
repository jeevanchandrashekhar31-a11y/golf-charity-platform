import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';
import { runDrawEngine } from '@/lib/draw-engine';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = await createServerClient();
    
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { drawType } = await req.json();

    const { data: activeProfiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('subscription_status', 'active');
      
    if (!activeProfiles || activeProfiles.length === 0) {
      // Simulate empty state properly or throw error
      return NextResponse.json({ error: 'No active subscribers found' }, { status: 400 });
    }

    const activeUserIds = activeProfiles.map((p: any) => p.id);

    const { data: allScores } = await supabase
      .from('golf_scores')
      .select('user_id, score')
      .in('user_id', activeUserIds);

    const userScoresMap: Record<string, number[]> = {};
    activeUserIds.forEach((id: string) => { userScoresMap[id] = []; });
    
    if (allScores) {
      allScores.forEach((s: any) => {
        if (userScoresMap[s.user_id]) {
          userScoresMap[s.user_id].push(s.score);
        }
      });
    }

    const usersInput = Object.keys(userScoresMap).map(userId => ({
      userId,
      scores: userScoresMap[userId],
    }));

    let jackpotRollover = 0;
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_rolled_over_jackpot');
    if (!rpcError && rpcData) {
      jackpotRollover = Number(rpcData);
    }

    // Fixed pool contribution per user: £19.99 * 30% = 599 pence
    const PRIZE_POOL_CONTRIBUTION = 599; 
    const totalCurrentPool = activeUserIds.length * PRIZE_POOL_CONTRIBUTION;

    const simulation = runDrawEngine(usersInput, totalCurrentPool, jackpotRollover, drawType);

    return NextResponse.json({ success: true, data: simulation });

  } catch (error: any) {
    console.error('Simulation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
