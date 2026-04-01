import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    // Explicit constraint checking
    const supabase = await createServerClient();
    const { data: profile } = await supabase.from('profiles').select('subscription_status').eq('id', user.id).single();
    if (profile?.subscription_status !== 'active') {
       return NextResponse.json({ error: 'Active subscription required.' }, { status: 403 });
    }

    const { charity_id } = await req.json();
    if (!charity_id) return NextResponse.json({ error: 'Missing charity_id' }, { status: 400 });
    
    // Verify charity is active
    const { data: charity } = await supabase.from('charities').select('is_active').eq('id', charity_id).single();
    if (!charity || !charity.is_active) {
       return NextResponse.json({ error: 'Charity not found or inactive' }, { status: 404 });
    }

    const { error } = await supabase
      .from('profiles')
      .update({ selected_charity_id: charity_id })
      .eq('id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}
