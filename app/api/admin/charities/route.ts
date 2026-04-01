import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';

async function getAdminClient() {
  const user = await getCurrentUser();
  if (!user) throw Object.assign(new Error('Unauthorized'), { status: 401 });
  const supabase = await createServerClient();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw Object.assign(new Error('Forbidden'), { status: 403 });
  return supabase;
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const supabase = await createServerClient();
    
    let isAdmin = false;
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      isAdmin = profile?.role === 'admin';
    }

    let query = supabase.from('charities').select('*').order('name');
    if (!isAdmin) query = query.eq('is_active', true);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await getAdminClient();
    const body = await req.json();

    const required = ['name'];
    for (const field of required) {
      if (!body[field]) return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }

    const { data, error } = await supabase.from('charities').insert(body).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = await getAdminClient();
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const { data, error } = await supabase.from('charities').update(rest).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await getAdminClient();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    // Soft delete
    const { error } = await supabase.from('charities').update({ is_active: false }).eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 });
  }
}
