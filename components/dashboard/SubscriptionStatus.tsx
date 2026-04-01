import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Props {
  status: string;
  plan: string | null;
  endDate: string | null;
}

export default function SubscriptionStatus({ status, plan, endDate }: Props) {
  const getStatusColor = () => {
    if (status === 'active') return 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30';
    if (status === 'cancelled') return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    return 'bg-red-500/10 text-red-500 border-red-500/30';
  };

  const formattedDate = endDate 
    ? new Date(endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'N/A';

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-syne text-lg font-bold text-white">Subscription</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor()}`}>
          {status}
        </span>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Current Plan</p>
          <p className="font-medium text-white capitalize">{plan ? `${plan} Plan` : 'None'}</p>
        </div>
        <div>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-1">{status === 'cancelled' ? 'Ends On' : 'Renews On'}</p>
          <p className="font-medium text-white">{formattedDate}</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5">
        <Link href="/dashboard/settings" className="flex items-center text-[#10B981] text-sm font-medium hover:text-[#10B981]/80 transition-colors group">
          Manage Subscription
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
