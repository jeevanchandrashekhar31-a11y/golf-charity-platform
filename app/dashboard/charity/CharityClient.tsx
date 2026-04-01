'use client';

import { useState } from 'react';
import { Charity } from '@/types';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';

export default function CharityClient({ 
  initialCharity, 
  allCharities, 
  initialPercentage 
}: { 
  initialCharity: Charity | null; 
  allCharities: Charity[];
  initialPercentage: number;
}) {
  const [charity, setCharity] = useState<Charity | null>(initialCharity);
  const [percentage, setPercentage] = useState(initialPercentage);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const monthlyContribution = ((19.99 * percentage) / 100).toFixed(2);

  const selectCharity = async (c: Charity) => {
    try {
      const res = await fetch('/api/charity/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charity_id: c.id })
      });
      if (!res.ok) throw new Error('Failed to update');
      setCharity(c);
      setIsOpen(false);
      toast.success('Charity updated ✓');
    } catch (e: any) {
      toast.error('Could not select charity');
    }
  };

  const saveContribution = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/charity/contribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ percentage })
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success('Saved ✓');
    } catch (e: any) {
      toast.error('Could not save percentage');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Supported Charity</h2>
            <p className="text-white/60 text-sm max-w-md">Select where you want your minimum 10% subscription contribution to be automatically routed every month.</p>
          </div>
          <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 shrink-0" onClick={() => setIsOpen(true)}>Change Charity</Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="bg-[#111827] border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-syne text-xl mb-4">Select a Cause</DialogTitle>
              </DialogHeader>
              <div className="grid sm:grid-cols-2 gap-4">
                {allCharities.length === 0 ? (
                  <p className="text-white/50 col-span-2 py-8 text-center">No charities loaded into the database yet.</p>
                ) : allCharities.map(c => (
                  <div key={c.id} className="p-4 border border-white/10 rounded-xl hover:border-[#10B981] cursor-pointer transition-colors bg-[#0A0A0F]" onClick={() => selectCharity(c)}>
                    <h4 className="font-bold text-white mb-1">{c.name}</h4>
                    <p className="text-xs text-[#10B981] font-bold uppercase tracking-wider mb-3">{c.category}</p>
                    <p className="text-xs text-white/50 line-clamp-3 leading-relaxed">{c.description}</p>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {charity ? (
          <div className="flex gap-6 items-center p-6 bg-[#0A0A0F] rounded-xl border border-[#10B981]/20 text-left">
            <div className="w-16 h-16 rounded-full bg-[#10B981]/20 flex items-center justify-center shrink-0">
              <Heart className="w-8 h-8 text-[#10B981]" fill="#10B981" />
            </div>
            <div>
              <h3 className="font-syne text-xl font-bold text-white mb-1">{charity.name}</h3>
              <p className="text-sm text-white/60 mb-2">{charity.description}</p>
              <p className="text-xs font-bold text-[#10B981] uppercase tracking-wider">{charity.category}</p>
            </div>
          </div>
        ) : (
           <div className="p-8 border-2 border-dashed border-white/10 rounded-xl text-center">
             <Heart className="w-10 h-10 text-white/20 mx-auto mb-4" />
             <p className="text-white/50 text-sm">No charity selected. Please choose one above to direct your impact.</p>
           </div>
        )}
      </div>

      <div className="bg-[#111827] border border-white/5 rounded-2xl p-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-2">Contribution Level</h2>
        <p className="text-white/60 text-sm mb-10 max-w-xl">We mandate a minimum 10% pass-through rate to your chosen charity. Use the slider below if you would like to optionally increase your monthly impact percentage.</p>

        <div className="mb-12 px-2">
          <Slider 
            defaultValue={[initialPercentage]}
            min={10} 
            max={100} 
            step={5} 
            value={[percentage]}
            onValueChange={(val: any) => setPercentage(val[0])}
            className="w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 p-6 bg-[#0A0A0F] rounded-xl border border-white/5">
          <div>
            <p className="text-lg text-white/80">
              You contribute <strong className="text-[#10B981] font-syne text-2xl ml-1">{percentage}%</strong> <span className="text-white/40 text-sm ml-1">(Est. £{monthlyContribution})</span> per payment
            </p>
          </div>
          <Button 
            onClick={saveContribution} 
            disabled={isSaving || percentage === initialPercentage} 
            className="bg-[#10B981] hover:bg-[#10B981]/90 text-white min-w-[140px] h-11"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
