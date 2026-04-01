import { ArrowRight, AlertCircle, Trophy } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface Props {
  totalWon: number;
  drawsEntered: number;
  hasPending: boolean;
}

export default function WinningsCard({ totalWon, drawsEntered, hasPending }: Props) {
  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/5 rounded-bl-[100px]" />
      <Trophy className="absolute top-6 right-6 w-12 h-12 text-[#F59E0B]/20" />

      <div className="flex items-center gap-2 mb-2 relative z-10">
        <h3 className="font-syne text-lg font-bold text-white">All-Time Winnings</h3>
      </div>
      
      <div className="font-syne text-5xl font-bold text-[#F59E0B] mb-4 relative z-10">
        {formatCurrency(totalWon)}
      </div>

      <div className="mb-6 relative z-10 flex-1">
        <p className="text-sm text-white/50">Entered <span className="text-white font-medium">{drawsEntered}</span> monthly draws</p>
      </div>

      {hasPending && (
        <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2 relative z-10">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-500/90 leading-relaxed">Prize pending verification.</p>
        </div>
      )}

      <div className="mt-auto pt-6 border-t border-white/5 relative z-10">
        <Link href="/dashboard/draws" className="flex items-center text-[#F59E0B] text-sm font-medium hover:text-[#F59E0B]/80 transition-colors group">
          View Prize Details
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
