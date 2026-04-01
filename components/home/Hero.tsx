'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#0A0A0F]">
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#10B981]/20 rounded-full blur-[120px] opacity-70" />
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-[#F59E0B]/10 rounded-full blur-[150px] opacity-60" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10 grid md:grid-cols-12 gap-12 items-center">
        
        <motion.div 
          className="md:col-span-7 flex flex-col items-start gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-4 py-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] text-xs font-bold tracking-widest uppercase"
          >
            Monthly Draw · Charity Impact · Golf Scores
          </motion.div>
          
          <motion.h1 className="font-syne text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight">
            <span className="text-[#F8FAFC] block">Play Golf.</span>
            <span className="text-[#10B981] block">Win Prizes.</span>
            <span className="text-[#F59E0B] block">Change Lives.</span>
          </motion.h1>
          
          <motion.p className="text-lg md:text-xl text-white/60 font-dm-sans max-w-xl leading-relaxed">
            Turn your weekend stableford rounds into cash prizes. We combine the thrill of monthly prize draws with meaningful charitable contributions.
          </motion.p>
          
          <motion.div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4">
            <Link href="/subscribe">
              <Button size="lg" className="h-14 px-8 bg-[#10B981] hover:bg-[#10B981]/90 text-white font-semibold text-lg border-0 shadow-[0_0_20px_rgba(16,185,129,0.4)] w-full sm:w-auto group">
                Join Now – £19.99/mo
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="ghost" className="h-14 px-8 text-white hover:bg-white/10 hover:text-white font-medium text-lg w-full sm:w-auto">
                See How It Works
              </Button>
            </Link>
          </motion.div>
          
          <motion.div className="flex items-center gap-3 mt-6">
            <div className="flex -space-x-3">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0A0F] bg-gray-800 flex items-center justify-center overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 3}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-sm text-white/50 font-medium">
              Join <span className="text-white">2,400+</span> golfers already playing
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          className="md:col-span-5 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 to-[#F59E0B]/20 blur-3xl opacity-50" />
          
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative bg-[#111827] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-white/80 font-medium">This Month&apos;s Prize Pool</h3>
              </div>
            </div>
            
            <div className="font-syne text-6xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
              £14,250
            </div>
            
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-xs text-white/50 mb-1">Total Donated</p>
                <p className="font-semibold text-white">£42.5k</p>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-1">Active Players</p>
                <p className="font-semibold text-white">2,451</p>
              </div>
              <div>
                <p className="text-xs text-[#10B981] font-medium mb-1">Next Draw In</p>
                <p className="font-bold text-[#10B981]">12 Days</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
