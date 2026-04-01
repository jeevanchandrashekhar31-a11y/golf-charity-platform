'use client';
import { motion } from 'framer-motion';
import { Heart, BarChart3, Trophy } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Heart,
      title: "Subscribe & Pick a Charity",
      desc: "Sign up for £19.99/month and select a cause. At least 10% of your subscription goes directly to them."
    },
    {
      icon: BarChart3,
      title: "Enter Your Stableford Scores",
      desc: "Play your normal rounds. Submit up to 5 of your recent stableford scores into your dashboard."
    },
    {
      icon: Trophy,
      title: "Win Monthly Prizes",
      desc: "At the end of the month, 5 numbers are drawn. Match your scores to the draw to win cash prizes!"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#0A0A0F] relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-syne text-4xl md:text-5xl font-bold text-white mb-4">Three Steps to Impact</h2>
          <p className="text-white/60 max-w-2xl mx-auto">Playing for a purpose has never been simpler.</p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[#10B981]/50 to-transparent z-0" />

          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative z-10 bg-[#111827] border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center hover:border-[#10B981]/30 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] mb-6 relative">
                <step.icon className="w-8 h-8" />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-sm shadow-lg">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-syne">{step.title}</h3>
              <p className="text-white/60 leading-relaxed text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
