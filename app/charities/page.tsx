import { createServerClient } from '@/lib/supabase';
import CharityListClient from './CharityListClient';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CharitiesIndexPage() {
  const supabase = await createServerClient();
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .eq('is_active', true)
    .order('name');
    
  const featured = charities?.find(c => c.is_featured);

  return (
    <div className="min-h-screen bg-[#0A0A0F] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="font-syne text-4xl md:text-5xl font-black text-white mb-4">Charities Making a Difference</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Discover the incredible causes supported by the GreenPrize platform. Every active subscription directly funds their essential work.
          </p>
        </div>

        {featured && (
          <div className="mb-16 bg-[#111827] border border-[#10B981]/30 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.1)] relative">
            <div className="absolute top-0 right-0 py-1 px-8 bg-[#10B981] text-white text-xs font-bold uppercase tracking-widest rotate-45 translate-x-8 translate-y-4 z-10">
              Featured
            </div>
            <div className="grid md:grid-cols-2">
              <div className="h-64 md:h-auto bg-[#0A0A0F] relative">
                {featured.banner_url ? (
                  <img src={featured.banner_url} alt={featured.name} className="w-full h-full object-cover opacity-60" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-[#10B981]/20 to-[#111827]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[#111827] md:from-transparent to-transparent pointer-events-none" />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="text-[#10B981] text-sm font-bold uppercase tracking-wider mb-2">{featured.category}</span>
                <h2 className="font-syne text-3xl md:text-4xl font-bold text-white mb-4">{featured.name}</h2>
                <p className="text-white/70 mb-8 leading-relaxed line-clamp-3">{featured.description}</p>
                <Link href={`/charities/${featured.id}`} className="bg-[#10B981] hover:bg-[#10B981]/90 text-white font-medium py-3 px-8 rounded-xl self-start flex items-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  Learn More About {featured.name}
                </Link>
              </div>
            </div>
          </div>
        )}

        <CharityListClient charities={charities || []} isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}
