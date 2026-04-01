'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-syne font-bold text-2xl tracking-tight text-[#F8FAFC]">GreenPrize</span>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 rounded-full bg-[#10B981] mb-1"
          />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#how-it-works" className="text-sm font-medium text-white/70 hover:text-white transition-colors">How It Works</Link>
          <Link href="#charities" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Charities</Link>
          <Link href="/dashboard/draws" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Draws</Link>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-[#F8FAFC] hover:bg-white/10 hover:text-white">Log In</Button>
          </Link>
          <Link href="/subscribe">
            <Button className="bg-[#10B981] hover:bg-[#10B981]/90 text-white font-medium border-0 shadow-[0_0_15px_rgba(16,185,129,0.4)]">Start Playing</Button>
          </Link>
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="text-white hover:bg-white/10" />}>
              <Menu />
            </SheetTrigger>
            <SheetContent className="bg-[#111827] border-white/10 text-white">
              <div className="flex flex-col gap-6 mt-10">
                <Link href="#how-it-works" className="text-lg font-medium text-white/80 hover:text-white">How It Works</Link>
                <Link href="#charities" className="text-lg font-medium text-white/80 hover:text-white">Charities</Link>
                <Link href="/dashboard/draws" className="text-lg font-medium text-white/80 hover:text-white">Draws</Link>
                <hr className="border-white/10" />
                <Link href="/auth/login"><Button variant="ghost" className="w-full justify-start text-white">Log In</Button></Link>
                <Link href="/subscribe"><Button className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white">Start Playing</Button></Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
