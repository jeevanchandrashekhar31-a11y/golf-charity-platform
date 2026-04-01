'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

const scoreSchema = z.object({
  score: z.coerce.number().min(1, 'Score must be at least 1').max(45, 'Score cannot exceed 45'),
  played_at: z.string().refine((date) => new Date(date) <= new Date(), {
    message: 'Date cannot be in the future',
  }),
});

type ScoreFormValues = z.infer<typeof scoreSchema>;

export default function ScoreEntry({ onScoreAdded }: { onScoreAdded: () => void }) {
  const [serverError, setServerError] = useState('');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ScoreFormValues>({
    resolver: zodResolver(scoreSchema) as any,
    defaultValues: {
      played_at: new Date().toISOString().split('T')[0],
      score: 36,
    }
  });

  const onSubmit = async (data: ScoreFormValues) => {
    setServerError('');
    try {
      const res = await fetch('/api/scores/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Failed to add score');
      
      toast.success('Score added! ✓');
      
      // Keep today's date, wipe score to allow quick secondary input
      reset({ played_at: new Date().toISOString().split('T')[0], score: 36 });
      onScoreAdded();
      
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]">
          <PlusCircle className="w-6 h-6" />
        </div>
        <h2 className="font-syne text-2xl font-bold text-white">Add New Score</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {serverError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
            {serverError}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="score" className="text-white/70">Stableford Score (1-45)</Label>
          <Input
            id="score"
            type="number"
            {...register('score')}
            className="bg-[#0A0A0F] border-white/10 text-white focus-visible:ring-[#10B981] h-12 text-lg"
          />
          {errors.score && <p className="text-red-500 text-xs">{errors.score.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="played_at" className="text-white/70">Date Played</Label>
          <Input
            id="played_at"
            type="date"
            max={new Date().toISOString().split('T')[0]}
            {...register('played_at')}
            className="bg-[#0A0A0F] border-white/10 text-white focus-visible:ring-[#10B981] h-12"
          />
          {errors.played_at && <p className="text-red-500 text-xs">{errors.played_at.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white font-semibold h-12 mt-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Score'}
        </Button>
      </form>
    </div>
  );
}
