import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, score, played_at } = await req.json();

    if (score < 1 || score > 45) {
      return NextResponse.json({ error: 'Invalid score value' }, { status: 400 });
    }

    if (new Date(played_at) > new Date()) {
      return NextResponse.json({ error: 'Date cannot be in the future' }, { status: 400 });
    }

    const supabase = await createServerClient();
    
    const { data: updated, error } = await supabase
      .from('golf_scores')
      .update({ score, played_at })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (!updated) return NextResponse.json({ error: 'Score not found or access denied' }, { status: 404 });

    return NextResponse.json({ success: true, data: updated });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
