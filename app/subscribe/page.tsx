'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createBrowserClient } from '@/lib/supabase-client';
import toast from 'react-hot-toast';

export default function SubscribePage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single();
        
      if (profile?.subscription_status === 'active') {
        setIsSubscribed(true);
      }
      setChecking(false);
    };
    checkStatus();
  }, [router, supabase]);

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to create checkout session');
      
      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      toast.error(err.message);
      setLoadingPlan(null);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981] mb-6 border border-[#10B981]/30">
          <Check className="w-8 h-8" />
        </div>
        <h2 className="font-syne text-3xl font-bold mb-4">You are already subscribed!</h2>
        <p className="text-white/60 mb-8 max-w-md">Thank you for playing GreenPrize and supporting amazing charities.</p>
        <Button onClick={() => router.push('/dashboard')} className="bg-[#10B981] hover:bg-[#10B981]/90 text-white font-semibold px-8 h-12">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  const features = [
    "Entry into Monthly Prize Draw",
    "Minimum 10% Charity Contribution",
    "Advanced Score Tracking Dashboard",
    "Cancel Anytime"
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-24 px-6 relative flex flex-col items-center justify-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#10B981]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="text-center mb-16 relative z-10 pt-10">
        <h1 className="font-syne text-4xl md:text-6xl font-black text-white mb-6">Choose Your Plan</h1>
        <p className="text-white/60 max-w-xl mx-auto text-lg">Select how you want to play. Remember, your subscription directly impacts charitable causes.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full relative z-10">
        {/* Monthly Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#111827] border border-white/10 rounded-3xl p-8 flex flex-col shadow-2xl"
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

          <Button 
            onClick={() => handleSubscribe('monthly')} 
            disabled={!!loadingPlan}
            size="lg" 
            className="w-full bg-white text-black hover:bg-gray-200 font-semibold h-12"
          >
            {loadingPlan === 'monthly' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Choose Monthly'}
          </Button>
        </motion.div>

        {/* Yearly Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111827] border border-[#F59E0B]/50 rounded-3xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(245,158,11,0.15)]"
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

          <Button 
            onClick={() => handleSubscribe('yearly')} 
            disabled={!!loadingPlan}
            size="lg" 
            className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white font-semibold h-12 border-0 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          >
            {loadingPlan === 'yearly' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Choose Yearly'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
