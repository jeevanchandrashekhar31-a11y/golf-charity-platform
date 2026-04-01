'use client';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Info } from 'lucide-react';

export default function DrawMechanic() {
  const data = [
    { name: 'Jackpot', value: 40, color: '#10B981' }, 
    { name: 'Match 4', value: 35, color: '#3B82F6' },
    { name: 'Match 3', value: 25, color: '#F59E0B' },
  ];

  return (
    <section className="py-24 bg-[#111827] border-y border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-syne text-4xl md:text-5xl font-bold text-white mb-4">How the Prize Pool Works</h2>
          <p className="text-white/60 max-w-2xl mx-auto">Every entry builds the pool. Here&apos;s how your winnings are divided.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-[400px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A0F', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 rounded-full mt-1.5 bg-[#10B981] shadow-[0_0_10px_#10B981]" />
              <div>
                <h4 className="text-xl font-bold text-white mb-1">40% — Match 5 (Jackpot)</h4>
                <p className="text-white/60 text-sm leading-relaxed">Match all 5 numbers drawn to win or share the staggering jackpot prize.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-4 h-4 rounded-full mt-1.5 bg-[#3B82F6] shadow-[0_0_10px_#3B82F6]" />
              <div>
                <h4 className="text-xl font-bold text-white mb-1">35% — Match 4</h4>
                <p className="text-white/60 text-sm leading-relaxed">Match 4 out of 5 numbers for a solid chunk of the remaining prize pool.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-4 h-4 rounded-full mt-1.5 bg-[#F59E0B] shadow-[0_0_10px_#F59E0B]" />
              <div>
                <h4 className="text-xl font-bold text-white mb-1">25% — Match 3</h4>
                <p className="text-white/60 text-sm leading-relaxed">Match just 3 numbers and still walk away with a rewarding payout.</p>
              </div>
            </div>

            <div className="mt-4 p-5 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl flex items-start gap-3">
              <Info className="w-6 h-6 text-[#F59E0B] shrink-0" />
              <p className="text-[#F59E0B] text-sm md:text-base">
                <strong>Rollover Alert:</strong> No jackpot winner this month? The entire 40% jackpot pool automatically rolls over to next month!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
