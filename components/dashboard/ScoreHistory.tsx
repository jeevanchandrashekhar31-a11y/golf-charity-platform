'use client';

import { useState } from 'react';
import { GolfScore } from '@/types';
import { getScoreColor, getScoreLabel, formatDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Loader2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import toast from 'react-hot-toast';

export default function ScoreHistory({ scores, onScoreChange }: { scores: GolfScore[]; onScoreChange: () => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState<number>(0);
  const [editDate, setEditDate] = useState<string>('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const averageScore = scores.length > 0 
    ? Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length) 
    : 0;

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this score?')) return;
    
    setLoadingId(id);
    try {
      const res = await fetch('/api/scores/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error('Failed to delete score');
      toast.success('Score deleted');
      onScoreChange();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleUpdate = async (id: string) => {
    if (editScore < 1 || editScore > 45) {
      toast.error('Score must be between 1 and 45');
      return;
    }
    
    if (new Date(editDate) > new Date()) {
      toast.error('Date cannot be in the future');
      return;
    }

    setLoadingId(id);
    try {
      const res = await fetch('/api/scores/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, score: editScore, played_at: editDate })
      });
      if (!res.ok) throw new Error('Failed to update score');
      
      toast.success('Score updated');
      setEditingId(null);
      onScoreChange();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const startEdit = (score: GolfScore) => {
    setEditingId(score.id);
    setEditScore(score.score);
    setEditDate(score.played_at.split('T')[0]);
  };

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-syne text-2xl font-bold text-white">Recent Scores</h2>
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-medium">
          {scores.length}/5 Entries
        </div>
      </div>

      {scores.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 border-2 border-dashed border-white/10 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
            <Trophy className="w-8 h-8 text-white/30" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No scores yet</h3>
          <p className="text-white/50 text-sm max-w-[250px]">Add your first score to enter the monthly draws!</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {scores.slice(0, 5).map((score) => (
              <motion.div 
                key={score.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#0A0A0F] border border-white/5 rounded-xl overflow-hidden"
              >
                {editingId === score.id ? (
                  <div className="p-4 flex flex-col sm:flex-row gap-4 items-end">
                    <div className="w-full space-y-2">
                      <label className="text-xs text-white/50">Score</label>
                      <Input 
                        type="number" 
                        value={editScore} 
                        onChange={(e) => setEditScore(Number(e.target.value))}
                        className="bg-[#111827] border-white/10 text-white"
                      />
                    </div>
                    <div className="w-full space-y-2">
                      <label className="text-xs text-white/50">Date</label>
                      <Input 
                        type="date" 
                        max={new Date().toISOString().split('T')[0]}
                        value={editDate} 
                        onChange={(e) => setEditDate(e.target.value)}
                        className="bg-[#111827] border-white/10 text-white"
                      />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="ghost" onClick={() => setEditingId(null)} className="text-white hover:bg-white/10">Cancel</Button>
                      <Button 
                        onClick={() => handleUpdate(score.id)}
                        disabled={loadingId === score.id}
                        className="bg-[#10B981] hover:bg-[#10B981]/90 text-white"
                      >
                        {loadingId === score.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-syne text-2xl font-bold ${getScoreColor(score.score)}`}>
                        {score.score}
                      </div>
                      <div>
                        <p className="font-medium text-white">{formatDate(score.played_at)}</p>
                        <p className="text-xs text-white/50">{getScoreLabel(score.score)} game</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => startEdit(score)}
                        disabled={loadingId === score.id}
                        className="text-white/50 hover:text-white hover:bg-white/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(score.id)}
                        disabled={loadingId === score.id}
                        className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10"
                      >
                        {loadingId === score.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Footer Stats Summary */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Average Score</p>
            <p className="text-3xl font-syne font-bold text-white">{averageScore}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-white mb-1">Entry Progress</p>
            <p className="text-xs text-[#10B981]">{scores.length}/5 scores logged</p>
          </div>
        </div>
        <Progress value={(scores.length / 5) * 100} className="h-2 bg-white/10" />
        
        {scores.length < 5 && scores.length > 0 && (
          <p className="text-xs text-white/40 mt-3 text-center">
            Log {5 - scores.length} more scores to maximize your draw chances!
          </p>
        )}
      </div>
    </div>
  );
}
