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
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { drawType } = await req.json();
    
    // Safety check - ISO string will yield 20xx-xx
    const drawMonth = new Date().toISOString().slice(0, 7);

    const { data: existing } = await supabase
      .from('draws')
      .select('id')
      .eq('draw_month', drawMonth)
      .eq('status', 'published')
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'A published draw already exists for this month (' + drawMonth + ')' }, { status: 400 });
    }

    const { data: activeProfiles } = await supabase.from('profiles').select('id').eq('subscription_status', 'active');
    if (!activeProfiles || activeProfiles.length === 0) return NextResponse.json({ error: 'No active subscribers' }, { status: 400 });

    const activeUserIds = activeProfiles.map((p: any) => p.id);
    const { data: allScores } = await supabase.from('golf_scores').select('user_id, score').in('user_id', activeUserIds);

    const userScoresMap: Record<string, number[]> = {};
    activeUserIds.forEach((id: string) => { userScoresMap[id] = []; });
    if (allScores) {
      allScores.forEach((s: any) => {
        if (userScoresMap[s.user_id]) userScoresMap[s.user_id].push(s.score);
      });
    }

    const usersInput = Object.keys(userScoresMap).map(userId => ({
      userId,
      scores: userScoresMap[userId],
    }));

    let jackpotRollover = 0;
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_rolled_over_jackpot');
    if (!rpcError && rpcData) jackpotRollover = Number(rpcData);

    const PRIZE_POOL_CONTRIBUTION = 599; 
    const totalCurrentPool = activeUserIds.length * PRIZE_POOL_CONTRIBUTION;

    const simulation = runDrawEngine(usersInput, totalCurrentPool, jackpotRollover, drawType);

    const { data: savedDraw, error: drawError } = await supabase
      .from('draws')
      .insert({
        draw_month: drawMonth,
        draw_type: drawType,
        drawn_numbers: simulation.drawnNumbers,
        total_prize_pool: simulation.prizePool,
        jackpot_rollover: simulation.jackpotRollover,
        status: 'simulated'
      })
      .select()
      .single();

    if (drawError) throw drawError;

    const resultsToInsert = simulation.results.map(r => ({
      draw_id: savedDraw.id,
      user_id: r.userId,
      user_scores: usersInput.find(u => u.userId === r.userId)?.scores || [],
      matched_numbers: r.matchedNumbers,
      match_count: r.matchCount,
      prize_amount: r.prizeAmount,
      payment_status: r.prizeAmount > 0 ? 'pending' : 'paid'
    }));

    const { error: resError } = await supabase.from('draw_results').insert(resultsToInsert);
    if (resError) throw resError;

    return NextResponse.json({ success: true, data: { ...savedDraw, simulation } });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
