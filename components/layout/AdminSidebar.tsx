'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, Shuffle, Heart, Trophy, BarChart2, LogOut, ArrowLeft } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Profile } from '@/types';

export default function AdminSidebar() {
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

  const getInitials = (name: string) => name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() || 'AD';

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Draw Management', href: '/admin/draws', icon: Shuffle },
    { name: 'Charities', href: '/admin/charities', icon: Heart },
    { name: 'Winners', href: '/admin/winners', icon: Trophy },
    { name: 'Reports', href: '/admin/reports', icon: BarChart2 },
  ];

  return (
    <>
      <div className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-[#000000] border-r border-[#10B981]/20 z-40">
        <div className="p-6">
          <Link href="/admin" className="font-syne font-bold text-2xl tracking-tight text-[#10B981] flex items-center gap-2">
            GP Admin <div className="w-2 h-2 rounded-full bg-white mb-1" />
          </Link>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-[#10B981] text-white font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5 font-medium'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5 space-y-2">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center justify-start gap-3 text-white/60 hover:text-white hover:bg-white/5 h-10 px-4 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Button>
          <div className="flex items-center gap-3 mb-2 mt-4 px-2">
            <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center font-bold text-[#10B981] uppercase text-xs">
              {getInitials(profile?.full_name || profile?.email || 'AD')}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Admin Role</p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#000000] border-t border-white/5 z-50 flex justify-around p-3 pb-safe overflow-x-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg shrink-0 w-16 ${
                isActive ? 'text-[#10B981]' : 'text-white/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-medium truncate w-full text-center">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
