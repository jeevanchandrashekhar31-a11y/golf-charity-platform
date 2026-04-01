'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DrawSimulationResult } from '@/types';
import { Loader2, Play, Trophy, Archive, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
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

export default function DrawControl({ history }: { history: any[] }) {
  const [drawType, setDrawType] = useState<'random' | 'algorithmic'>('random');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isPublishing, setIsPublishing] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  const [simulation, setSimulation] = useState<DrawSimulationResult | null>(null);

  const currentMonth = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const handleSimulate = async () => {
    setIsSimulating(true);
    setSimulation(null);
    try {
      const res = await fetch('/api/draws/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drawType })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSimulation(data.data);
      toast.success('Simulation complete');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSimulating(false);
    }
  };

  const handlePublish = async (id: string) => {
    setIsPublishing(id);
    try {
      const res = await fetch('/api/draws/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drawId: id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Draw published to users');
      window.location.reload(); 
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsPublishing(null);
    }
  };

  return (
    <div className="space-y-12">
      {/* Section 1 - Controls */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Draw Engine Console</h2>
            <p className="text-white/50 text-sm">Target Month: <strong className="text-white capitalize">{currentMonth}</strong></p>
          </div>
          
          <div className="flex bg-[#0A0A0F] p-1 rounded-xl border border-white/10 w-full md:w-auto">
            <button 
              onClick={() => setDrawType('random')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${drawType === 'random' ? 'bg-[#10B981] text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
            >
              🎲 Random
            </button>
            <button 
              onClick={() => setDrawType('algorithmic')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${drawType === 'algorithmic' ? 'bg-[#3B82F6] text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
            >
              📊 Algorithmic
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button onClick={handleSimulate} disabled={isSimulating || isRunning} variant="outline" className="border-white/20 text-white bg-transparent hover:bg-white/10 h-12 px-8">
            {isSimulating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            Test Simulation
          </Button>

          <Button disabled={!simulation || isSimulating || isRunning} onClick={() => setConfirmDialogOpen(true)} className="bg-[#10B981] hover:bg-[#10B981]/90 text-white h-12 px-8 shadow-[0_0_15px_rgba(16,185,129,0.3)] border-0">
            {isRunning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
            Execute & Publish Draw
          </Button>

          <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
            <DialogContent className="bg-[#111827] border-white/10 text-white">
              <DialogHeader>
                <DialogTitle className="font-syne text-xl">Confirm Official Draw</DialogTitle>
                <DialogDescription className="text-white/60">
                  This will lock in the current algorithm ({drawType}), assign winners, save the results to the database forever, and instantly publish them to users' dashboards. Are you absolutely ready to execute?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4 gap-2">
                <Button variant="ghost" className="bg-transparent border border-white/20 text-white hover:bg-white/10" onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={async () => {
                    setIsRunning(true);
                    try {
                      const res = await fetch('/api/draws/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ drawType }) });
                      const runData = await res.json();
                      if (!res.ok) throw new Error(runData.error);
                      await handlePublish(runData.data.id);
                    } catch (e: any) {
                      toast.error(e.message);
                      setIsRunning(false);
                    }
                  }} 
                  className="bg-[#10B981] hover:bg-[#10B981]/90 border-0"
                >
                  Confirm & Publish
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Section 2 - Simulation Results */}
      {simulation && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111827] border border-[#10B981]/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Trophy className="text-[#10B981] w-5 h-5" /> Active Simulation Results
          </h2>
          
          <div className="flex justify-center flex-wrap gap-4 mb-10">
            {simulation.drawnNumbers.map((n: number, i: number) => (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} key={i} className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#10B981] to-emerald-700 flex items-center justify-center font-syne font-black text-2xl md:text-3xl text-white shadow-xl border border-white/20">
                {n}
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
              <p className="text-xs text-white/50 uppercase mb-1">Total Prize Pool</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(simulation.prizePool)}</p>
            </div>
            <div className="bg-[#0A0A0F] p-4 rounded-xl border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-16 h-16 bg-[#F59E0B]/10 rounded-bl-full" />
              <p className="text-xs text-white/50 uppercase mb-1">Jackpot (Match 5)</p>
              <p className="text-2xl font-bold text-[#F59E0B]">{formatCurrency((simulation.prizePool * 0.5) + simulation.jackpotRollover)}</p>
            </div>
            <div className="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
               <p className="text-xs text-white/50 uppercase mb-1">Match 4 Pool</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(simulation.prizePool * 0.3)}</p>
            </div>
            <div className="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
               <p className="text-xs text-white/50 uppercase mb-1">Match 3 Pool</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(simulation.prizePool * 0.2)}</p>
            </div>
          </div>

          <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0A0A0F]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#111827] text-white/50 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Tier</th>
                  <th className="px-6 py-4">Winners</th>
                  <th className="px-6 py-4">Prize Per Winner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                <tr>
                  <td className="px-6 py-4 font-medium text-[#F59E0B]">Match 5 (Jackpot)</td>
                  <td className="px-6 py-4">{simulation.tierWinners.match5}</td>
                  <td className="px-6 py-4">{formatCurrency(simulation.payoutPerWinner.match5)}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Match 4</td>
                  <td className="px-6 py-4">{simulation.tierWinners.match4}</td>
                  <td className="px-6 py-4">{formatCurrency(simulation.payoutPerWinner.match4)}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Match 3</td>
                  <td className="px-6 py-4">{simulation.tierWinners.match3}</td>
                  <td className="px-6 py-4">{formatCurrency(simulation.payoutPerWinner.match3)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {simulation.tierWinners.match5 === 0 && (
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-amber-500 text-sm">
                No players matched 5 numbers. The Match 5 pool ({formatCurrency((simulation.prizePool * 0.5) + simulation.jackpotRollover)}) will roll over to next month's jackpot!
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Section 3 - Draw History */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Archive className="text-white/50 w-5 h-5" /> Official Draw Records
        </h2>

        {history.length === 0 ? (
          <p className="text-white/50 py-4">No draws recorded yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#0A0A0F]">
             <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#111827] text-white/50 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Draw Month</th>
                  <th className="px-6 py-4">Algorithm</th>
                  <th className="px-6 py-4">Prize Pool</th>
                  <th className="px-6 py-4">Rollover</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                {history.map(d => (
                  <tr key={d.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium capitalize">{d.draw_month}</td>
                    <td className="px-6 py-4 capitalize">{d.draw_type}</td>
                    <td className="px-6 py-4">{formatCurrency(d.total_prize_pool)}</td>
                    <td className="px-6 py-4 text-[#F59E0B]">{formatCurrency(d.jackpot_rollover)}</td>
                    <td className="px-6 py-4">
                      {d.status === 'published' ? (
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">Published</span>
                      ) : (
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Simulated / Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {d.status === 'simulated' && (
                        <Button 
                          size="sm" 
                          onClick={() => handlePublish(d.id)}
                          disabled={isPublishing === d.id}
                          className="bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] mr-2"
                        >
                          {isPublishing === d.id ? <Loader2 className="w-3 h-3 animate-spin"/> : 'Publish'}
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">View Log</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
