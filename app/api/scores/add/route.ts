import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createServerClient();
    
    // Check Active Subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single();

    if (profile?.subscription_status !== 'active') {
      return NextResponse.json({ error: 'Active subscription required to add scores' }, { status: 403 });
    }

    const { score, played_at } = await req.json();

    if (score < 1 || score > 45) {
      return NextResponse.json({ error: 'Invalid score value' }, { status: 400 });
    }

    if (new Date(played_at) > new Date()) {
      return NextResponse.json({ error: 'Date cannot be in the future' }, { status: 400 });
    }

    const { error: insertError } = await supabase
      .from('golf_scores')
      .insert({
        user_id: user.id,
        score,
        played_at,
      });

    if (insertError) throw insertError;

    // Database trigger automatically checks and deletes oldest if > 5.
    const { data: scores } = await supabase
      .from('golf_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('played_at', { ascending: false });

    return NextResponse.json({ success: true, data: scores });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
