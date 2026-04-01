'use client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PricingSection() {
  const features = [
    "Entry into Monthly Prize Draw",
    "Minimum 10% Charity Contribution",
    "Advanced Score Tracking Dashboard",
    "Cancel Anytime"
  ];

  return (
    <section className="py-24 bg-[#111827] border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#10B981]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-syne text-4xl md:text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-white/60 max-w-2xl mx-auto">One tier, loads of impact. Subscribe and start turning your scores into cash.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0A0A0F] border border-white/10 rounded-3xl p-8 flex flex-col"
          >
            <h3 className="text-xl font-medium text-white/80 mb-2">Monthly Billed</h3>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="font-syne text-5xl font-bold text-white">£19.99</span>
              <span className="text-white/50">/mo</span>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#10B981]" />
                  <span className="text-white/80 text-sm">{f}</span>
                </div>
              ))}
            </div>

            <Link href="/subscribe">
              <Button size="lg" className="w-full bg-white text-black hover:bg-gray-200 font-semibold h-12">
                Choose Monthly
              </Button>
            </Link>
          </motion.div>

          {/* Yearly Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#0A0A0F] border border-[#F59E0B]/50 rounded-3xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(245,158,11,0.1)]"
          >
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#F59E0B] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Best Value – Save 25%
            </div>
            
            <h3 className="text-xl font-medium text-white/80 mb-2">Yearly Billed</h3>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="font-syne text-5xl font-bold text-[#F59E0B]">£179.99</span>
              <span className="text-white/50">/yr</span>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#F59E0B]" />
                  <span className="text-white/80 text-sm">{f}</span>
                </div>
              ))}
            </div>

            <Link href="/subscribe">
              <Button size="lg" className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white font-semibold h-12">
                Choose Yearly
              </Button>
            </Link>
          </motion.div>
        </div>

        <p className="text-center text-white/40 text-sm mt-10">
          Minimum 10% of every subscription goes to your chosen charity.
        </p>
      </div>
    </section>
  );
}
