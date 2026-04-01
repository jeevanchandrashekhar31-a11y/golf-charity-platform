import { createServerClient } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import { ExternalLink, Heart, Calendar } from 'lucide-react';
import SelectCharityButton from './SelectCharityButton';

export const dynamic = 'force-dynamic';

export default async function CharityDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createServerClient();
  const user = await getCurrentUser();

  const { data: charity } = await supabase
    .from('charities')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!charity) {
    notFound();
  }
  
  let isSelected = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('selected_charity_id').eq('id', user.id).single();
    if (profile?.selected_charity_id === charity.id) isSelected = true;
  }

  const upcomingEvents = Array.isArray(charity.upcoming_events) ? charity.upcoming_events : [];

  return (
    <div className="min-h-screen bg-[#0A0A0F] pt-24 pb-20">
      <div className="h-[300px] md:h-[400px] w-full relative">
        {charity.banner_url ? (
          <img src={charity.banner_url} alt={`${charity.name} banner`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#10B981]/20 to-[#111827]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/60 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative -mt-32">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-[#111827] border-4 border-[#0A0A0F] p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-2xl relative z-10">
            {charity.logo_url ? (
              <img src={charity.logo_url} alt={charity.name} className="w-full h-full object-contain" />
            ) : (
              <Heart className="w-16 h-16 text-[#10B981]" />
            )}
          </div>
          
          <div className="flex-1 w-full pt-4 md:pt-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-[#10B981] font-bold text-xs uppercase tracking-widest mb-2 block">{charity.category}</span>
                <h1 className="font-syne text-4xl md:text-5xl font-black text-white mb-2">{charity.name}</h1>
                {charity.website_url && (
                  <a href={charity.website_url} target="_blank" rel="noopener noreferrer" className="text-[#10B981] hover:text-[#10B981]/80 inline-flex items-center text-sm font-medium transition-colors">
                    <ExternalLink className="w-4 h-4 mr-1.5" />
                    Visit Official Website
                  </a>
                )}
              </div>
              
              <div className="shrink-0 w-full md:w-auto">
                {user ? (
                   <SelectCharityButton charityId={charity.id} initialSelected={isSelected} />
                ) : (
                   <a href="/auth/login" className="flex items-center justify-center w-full md:w-auto h-12 px-8 bg-[#10B981] text-white font-semibold rounded-xl hover:bg-[#10B981]/90 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                     Log in to Support
                   </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="font-syne text-2xl font-bold text-white mb-6">About This Cause</h2>
              <div className="prose prose-invert max-w-none text-white/70 leading-relaxed whitespace-pre-wrap">
                {charity.description || 'No description provided.'}
              </div>
            </section>

            {upcomingEvents.length > 0 && (
              <section>
                <h2 className="font-syne text-2xl font-bold text-white mb-6">Upcoming Initiatives</h2>
                <div className="space-y-4">
                  {upcomingEvents.map((evt: any, i: number) => (
                    <div key={i} className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex gap-4 items-start shadow-xl">
                      <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center shrink-0 border border-[#10B981]/20">
                        <Calendar className="w-6 h-6 text-[#10B981]" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">{evt.name}</h4>
                        <div className="flex gap-4 text-xs font-medium text-white/50">
                           <p>Date: <span className="text-white/80">{evt.date}</span></p>
                           <p>Location: <span className="text-white/80">{evt.location}</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#10B981]/5 rounded-full blur-[20px]" />
              <h3 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Platform Impact</h3>
              <div className="space-y-1">
                <p className="text-white/50 text-sm">Total raised by GreenPrize members:</p>
                <p className="font-syne text-4xl font-black text-[#10B981]">{formatCurrency(charity.total_contributions || 0)}</p>
              </div>
            </div>
            
            <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Quick Facts</h3>
              <ul className="space-y-4 text-sm text-white/70">
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Status</span>
                  <span className={charity.is_active ? 'text-[#10B981] font-bold' : 'text-red-500 font-bold'}>{charity.is_active ? 'Active Partner' : 'Inactive'}</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Category</span>
                  <span className="text-white font-medium">{charity.category}</span>
                </li>
                <li className="flex justify-between">
                  <span>Joined GreenPrize</span>
                  <span className="text-white font-medium">{new Date(charity.created_at).toLocaleDateString('en-GB')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
