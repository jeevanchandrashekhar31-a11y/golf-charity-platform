'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase-client';
import { Profile } from '@/types';
import { format } from 'date-fns';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const supabase = createBrowserClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      setProfile(data as Profile);
      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      toast.success(data.message);
      
      setProfile((prev) => prev ? { ...prev, subscription_status: 'cancelled' } as Profile : null);
      
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const isActive = profile.subscription_status === 'active';
  const isCancelled = profile.subscription_status === 'cancelled';
  const planLabel = profile.subscription_plan === 'yearly' ? 'Yearly Plan (£179.99/yr)' : 'Monthly Plan (£19.99/mo)';
  const renewalDate = profile.subscription_end_date ? format(new Date(profile.subscription_end_date), 'MMMM do, yyyy') : 'N/A';

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 mt-20">
      <h1 className="font-syne text-3xl font-bold text-white mb-8">Account Settings</h1>

      <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Subscription Management</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <p className="text-white/50 text-sm mb-1">Current Plan</p>
            <p className="text-white font-medium capitalize">{profile.subscription_plan ? planLabel : 'None'}</p>
          </div>
          <div>
            <p className="text-white/50 text-sm mb-1">Status</p>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${isActive ? 'bg-[#10B981]' : isCancelled ? 'bg-amber-500' : 'bg-red-500'}`} />
              <span className="text-white font-medium capitalize">{profile.subscription_status}</span>
            </div>
          </div>
          <div>
            <p className="text-white/50 text-sm mb-1">{isCancelled ? 'Ends On' : 'Renews On'}</p>
            <p className="text-white font-medium">{renewalDate}</p>
          </div>
        </div>

        {isCancelled && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-amber-500/90 text-sm">
              Your subscription has been cancelled and will not renew. You will maintain access until your current billing period ends on {renewalDate}.
            </p>
          </div>
        )}

        {isActive && (
          <div className="border-t border-white/10 pt-6">
            <Button variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0" onClick={() => setCancelDialogOpen(true)}>
              Cancel Subscription
            </Button>
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
              <DialogContent className="bg-[#111827] border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle className="font-syne text-xl">Are you absolutely sure?</DialogTitle>
                  <DialogDescription className="text-white/60">
                    This action will cancel your subscription at the end of your current billing period. You will lose access to monthly prize draws and stop contributing to your chosen charity.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
                  <Button variant="ghost" className="text-white border border-white/20 hover:bg-white/10" onClick={() => setCancelDialogOpen(false)}>Keep Subscription</Button>
                  <Button 
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="bg-red-500 text-white hover:bg-red-600 border-0"
                  >
                    {cancelling ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Yes, Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
