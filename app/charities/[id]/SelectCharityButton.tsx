'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SelectCharityButton({ charityId, initialSelected }: { charityId: string, initialSelected: boolean }) {
  const [selected, setSelected] = useState(initialSelected);
  const [loading, setLoading] = useState(false);

  const handleSelect = async () => {
    if (selected) return;
    setLoading(true);
    try {
      const res = await fetch('/api/charity/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charity_id: charityId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setSelected(true);
      toast.success('Successfully selected as your charity!');
    } catch (e: any) {
      toast.error(e.message || 'Failed to select charity. Your subscription may be inactive.');
    } finally {
      setLoading(false);
    }
  };

  if (selected) {
    return (
      <Button disabled className="w-full md:w-auto h-12 px-8 bg-white/10 text-white border border-white/20 opacity-100 flex items-center justify-center">
        <Heart className="w-4 h-4 mr-2 fill-white" />
        Currently Supporting
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleSelect} 
      disabled={loading}
      className="w-full md:w-auto h-12 px-8 bg-[#10B981] hover:bg-[#10B981]/90 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center"
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Select as My Charity'}
    </Button>
  );
}
