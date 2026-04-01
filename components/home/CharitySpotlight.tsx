'use client';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CharitySpotlight() {
  const charities = [
    { name: "Global Reforestation", category: "Environment", raised: "£12,450", color: "from-emerald-500/20 to-emerald-900/10" },
    { name: "Youth Sports Trust", category: "Education", raised: "£8,320", color: "from-blue-500/20 to-blue-900/10" },
    { name: "Cancer Research", category: "Health", raised: "£21,100", color: "from-amber-500/20 to-amber-900/10" }
  ];

  return (
    <section id="charities" className="py-24 bg-[#0A0A0F]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="font-syne text-4xl md:text-5xl font-bold text-white mb-4">Your Game Funds Real Change</h2>
            <p className="text-white/60 max-w-xl">Every subscription powers vetted charities around the world. Here are some of our top partnered causes.</p>
          </div>
          <Link href="/charities" className="flex items-center text-[#10B981] font-medium hover:text-[#10B981]/80 transition-colors group">
            Browse All Charities
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {charities.map((charity, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-[#111827] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all cursor-pointer"
            >
              <div className={`h-32 bg-gradient-to-br ${charity.color} flex items-center justify-center`}>
                <div className="w-16 h-16 rounded-full bg-[#0A0A0F]/50 backdrop-blur-sm border border-white/10" />
              </div>
              <div className="p-6">
                <div className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">{charity.category}</div>
                <h3 className="text-xl font-bold text-white mb-6 font-syne">{charity.name}</h3>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-sm text-white/50">Total Raised</span>
                  <span className="font-bold text-[#10B981]">{charity.raised}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
