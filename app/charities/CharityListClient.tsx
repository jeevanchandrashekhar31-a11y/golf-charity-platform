'use client';

import { useState } from 'react';
import { Charity } from '@/types';
import Link from 'next/link';
import { Heart, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function CharityListClient({ charities, isLoggedIn }: { charities: Charity[], isLoggedIn: boolean }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Environment', 'Health', 'Education', 'Animals', 'Community', 'Sports'];

  const filtered = charities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          (c.description?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || c.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search causes..." 
            className="pl-10 bg-[#0A0A0F] border-white/10 text-white h-12 focus-visible:ring-[#10B981]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat 
                  ? 'bg-[#10B981] text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-[#111827] border border-white/5 rounded-2xl">
          <Heart className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No causes found</h3>
          <p className="text-white/50">Try adjusting your search criteria or category filter.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map(c => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={c.id} 
                className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden hover:border-[#10B981]/30 transition-all shadow-xl group flex flex-col"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6 w-full">
                    <div className="w-16 h-16 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                      {c.logo_url ? (
                        <img src={c.logo_url} alt={c.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <Heart className="w-8 h-8 text-[#10B981]" />
                      )}
                    </div>
                    <span className="px-3 py-1 bg-white/5 text-xs font-bold uppercase tracking-wider text-[#10B981] rounded-full border border-white/5 ml-2">
                      {c.category}
                    </span>
                  </div>
                  
                  <h3 className="font-syne text-xl font-bold text-white mb-2 line-clamp-1" title={c.name}>{c.name}</h3>
                  <p className="text-sm text-white/60 line-clamp-3 mb-6 flex-1">{c.description}</p>
                  
                  <div className="mb-6 pt-4 border-t border-white/5">
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1 font-medium">Platform Contributions</p>
                    <p className="font-syne text-2xl font-bold text-white">{formatCurrency(c.total_contributions || 0)}</p>
                  </div>

                  <Link href={`/charities/${c.id}`} className={`block w-full text-center py-3 rounded-xl font-medium transition-colors cursor-pointer ${
                    isLoggedIn 
                      ? 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 border border-[#10B981]/30'
                      : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                  }`}>
                    {isLoggedIn ? 'Select Cause' : 'Learn More'}
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
