import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';

async function requireAdminUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  const supabase = await createServerClient();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error('Forbidden');
  return { user, supabase };
}

export async function PATCH(req: Request) {
  try {
    const { user, supabase } = await requireAdminUser();
    const { id, status } = await req.json();

    if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });

    const validStatuses = ['pending', 'verified', 'paid'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatePayload: Record<string, any> = { payment_status: status };
    if (status === 'verified') updatePayload.verified_at = new Date().toISOString();
    if (status === 'paid') updatePayload.paid_at = new Date().toISOString();

    const { error } = await supabase
      .from('draw_results')
      .update(updatePayload)
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e: any) {
    const status = e.message === 'Unauthorized' ? 401 : e.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}
