'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle, XCircle, CreditCard, Loader2, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUS_TABS = ['all', 'pending', 'verified', 'paid'] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  verified: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  paid: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30',
};

export default function WinnersTable({ winners: initialWinners }: { winners: any[] }) {
  const [winners, setWinners] = useState(initialWinners);
  const [tab, setTab] = useState<typeof STATUS_TABS[number]>('all');
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = tab === 'all' ? winners : winners.filter(w => w.payment_status === tab);

  const updateStatus = async (id: string, status: string) => {
    setLoading(status);
    try {
      const res = await fetch('/api/admin/winners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setWinners(prev => prev.map(w => w.id === id ? { ...w, payment_status: status } : w));
      if (selected?.id === id) setSelected((prev: any) => ({ ...prev, payment_status: status }));
      toast.success(`Status updated to ${status}`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(null);
    }
  };

  const matchLabel = (count: number) => {
    if (count === 5) return '🏆 Match 5 (Jackpot)';
    if (count === 4) return '🥈 Match 4';
    return '🥉 Match 3';
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 bg-[#111827] border border-white/5 rounded-2xl p-2 w-fit shadow-xl">
        {STATUS_TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? 'bg-[#10B981] text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden shadow-xl overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#0A0A0F] text-white/50 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Draw Month</th>
              <th className="px-6 py-4">Match Tier</th>
              <th className="px-6 py-4">Prize</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                  No winners found in this category.
                </td>
              </tr>
            ) : filtered.map(w => (
              <tr key={w.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold">{w.profiles?.full_name || 'Unknown'}</p>
                  <p className="text-xs text-white/40">{w.profiles?.email}</p>
                </td>
                <td className="px-6 py-4 capitalize">{w.draws?.draw_month}</td>
                <td className="px-6 py-4">{matchLabel(w.match_count)}</td>
                <td className="px-6 py-4 font-bold text-[#F59E0B]">{formatCurrency(w.prize_amount)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${STATUS_STYLES[w.payment_status] || 'bg-white/5 text-white/50 border-white/10'}`}>
                    {w.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSelected(w)} className="text-white hover:bg-white/10">
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Dialog */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="bg-[#111827] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-syne text-xl">Winner Review</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-6 mt-2">
              <div className="flex items-center gap-4 p-4 bg-[#0A0A0F] rounded-xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 flex items-center justify-center font-bold text-lg uppercase text-[#F59E0B]">
                  {selected.profiles?.full_name?.substring(0, 2) || 'GP'}
                </div>
                <div>
                  <p className="font-bold text-lg">{selected.profiles?.full_name || 'Unknown'}</p>
                  <p className="text-white/50 text-sm">{selected.profiles?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-white/40 uppercase mb-1">Draw Month</p>
                  <p className="font-bold capitalize">{selected.draws?.draw_month}</p>
                </div>
                <div className="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-white/40 uppercase mb-1">Match Tier</p>
                  <p className="font-bold">{matchLabel(selected.match_count)}</p>
                </div>
                <div className="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-white/40 uppercase mb-1">Prize Amount</p>
                  <p className="font-syne text-2xl font-bold text-[#F59E0B]">{formatCurrency(selected.prize_amount)}</p>
                </div>
                <div className="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-white/40 uppercase mb-1">Current Status</p>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${STATUS_STYLES[selected.payment_status] || ''}`}>
                    {selected.payment_status}
                  </span>
                </div>
              </div>

              {selected.proof_url && (
                <div className="border border-white/10 rounded-xl overflow-hidden">
                  <p className="text-xs text-white/40 uppercase p-3 border-b border-white/5">Submitted Proof</p>
                  <img src={selected.proof_url} alt="Winner proof" className="w-full max-h-48 object-cover" />
                </div>
              )}

              {!selected.proof_url && (
                <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <p className="text-sm text-amber-400">No proof image submitted yet.</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/5">
                <Button
                  onClick={() => updateStatus(selected.id, 'pending')}
                  disabled={!!loading || selected.payment_status === 'pending'}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center justify-center gap-1.5"
                >
                  {loading === 'pending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                  Reject
                </Button>
                <Button
                  onClick={() => updateStatus(selected.id, 'verified')}
                  disabled={!!loading || selected.payment_status === 'verified' || selected.payment_status === 'paid'}
                  className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center gap-1.5"
                >
                  {loading === 'verified' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Verify
                </Button>
                <Button
                  onClick={() => updateStatus(selected.id, 'paid')}
                  disabled={!!loading || selected.payment_status !== 'verified'}
                  className="bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 flex items-center justify-center gap-1.5"
                >
                  {loading === 'paid' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  Mark Paid
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
