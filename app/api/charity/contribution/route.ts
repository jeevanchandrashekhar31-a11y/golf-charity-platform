import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { percentage } = await req.json();
    if (percentage < 10 || percentage > 100) {
      return NextResponse.json({ error: 'Invalid percentage' }, { status: 400 });
    }

    const supabase = await createServerClient();
    
    const { error } = await supabase
      .from('profiles')
      .update({ charity_contribution_percentage: percentage })
      .eq('id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}
