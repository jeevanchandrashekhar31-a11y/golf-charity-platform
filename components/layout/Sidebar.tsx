'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, BarChart3, Heart, Trophy, Settings2, LogOut } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Profile } from '@/types';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserClient();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data as Profile);
    };
    fetchProfile();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Scores', href: '/dashboard/scores', icon: BarChart3 },
    { name: 'My Charity', href: '/dashboard/charity', icon: Heart },
    { name: 'Draw History', href: '/dashboard/draws', icon: Trophy },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings2 },
  ];

  return (
    <>
      <div className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-[#111827] border-r border-white/5 z-40">
        <div className="p-6">
          <Link href="/" className="font-syne font-bold text-2xl tracking-tight text-[#F8FAFC] flex items-center gap-2">
            GreenPrize <div className="w-2 h-2 rounded-full bg-[#10B981] mb-1" />
          </Link>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-[#10B981]/10 text-[#10B981] font-medium' 
                    : 'text-white/60 hover:text-white hover:bg-white/5 font-medium'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white uppercase text-sm">
              {getInitials(profile?.full_name || profile?.email || 'GP')}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name || 'Golfer'}</p>
              <p className="text-xs text-white/50 truncate">{profile?.email || ''}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-3 text-white/60 hover:text-white hover:bg-white/5 h-10 px-4 rounded-xl"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111827] border-t border-white/5 z-50 flex justify-around p-3 pb-safe">
        {navItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                isActive ? 'text-[#10B981]' : 'text-white/50'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
