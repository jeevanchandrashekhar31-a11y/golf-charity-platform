'use client';

import { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export default function UserTable({ users }: { users: any[] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const filtered = users.filter(u => {
    const s = search.toLowerCase();
    const matchSearch = (u.full_name || '').toLowerCase().includes(s) || (u.email || '').toLowerCase().includes(s);
    const matchFilter = filter === 'all' || u.subscription_status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input 
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name or email..." 
            className="pl-10 bg-[#0A0A0F] border-white/10 text-white focus-visible:ring-[#10B981]"
          />
        </div>
        <select 
          value={filter} onChange={e => setFilter(e.target.value)}
          className="bg-[#0A0A0F] border border-white/10 text-white rounded-md h-10 px-3 w-full md:w-auto outline-none focus:ring-1 focus:ring-[#10B981]"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden shadow-xl overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#0A0A0F] text-white/50 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Scores</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold">{u.full_name || 'N/A'}</p>
                  <p className="text-xs text-white/50">{u.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${u.subscription_status === 'active' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' : 'bg-white/5 text-white/50 border-white/10'}`}>
                    {u.subscription_status}
                  </span>
                </td>
                 <td className="px-6 py-4 capitalize">{u.subscription_plan || '-'}</td>
                 <td className="px-6 py-4 font-bold">{u.scores_count}/5</td>
                <td className="px-6 py-4 text-white/50">{new Date(u.created_at).toLocaleDateString('en-GB')}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedUser(u)} className="text-white hover:bg-white/10">
                    View <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <SheetContent className="bg-[#111827] border-white/10 text-white w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-white font-syne text-2xl font-bold">User Details</SheetTitle>
          </SheetHeader>
          
          {selectedUser && (
            <div className="mt-8 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center font-bold text-xl uppercase">
                   {selectedUser.full_name ? selectedUser.full_name.substring(0,2) : 'GP'}
                </div>
                <div>
                  <h3 className="font-bold text-xl">{selectedUser.full_name || 'Unknown'}</h3>
                  <p className="text-white/50">{selectedUser.email}</p>
                  <p className="text-xs text-[#10B981] mt-1">ID: {selectedUser.id}</p>
                </div>
              </div>

              <div className="bg-[#0A0A0F] rounded-xl p-5 border border-white/5 space-y-3">
                <h4 className="font-bold text-white/50 uppercase text-xs tracking-wider">Subscription Info</h4>
                <div className="flex justify-between">
                  <span className="text-white/70 text-sm">Status</span>
                  <span className={`text-sm font-bold ${selectedUser.subscription_status === 'active' ? 'text-[#10B981]' : 'text-white'}`}>{selectedUser.subscription_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70 text-sm">Plan</span>
                  <span className="text-sm font-bold capitalize">{selectedUser.subscription_plan || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70 text-sm">Renewal Date</span>
                  <span className="text-sm">{selectedUser.subscription_end_date ? new Date(selectedUser.subscription_end_date).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70 text-sm">Stripe ID</span>
                  <span className="text-xs font-mono text-white/50">{selectedUser.stripe_customer_id || 'N/A'}</span>
                </div>
              </div>

              <div className="bg-[#0A0A0F] rounded-xl p-5 border border-white/5 space-y-3">
                <h4 className="font-bold text-white/50 uppercase text-xs tracking-wider">Charity Routing</h4>
                <div className="flex justify-between">
                  <span className="text-white/70 text-sm">Contribution Rate</span>
                  <strong className="text-sm text-[#10B981]">{selectedUser.charity_contribution_percentage}%</strong>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-white/70 text-sm">Selected Charity</span>
                  <span className="text-xs px-2 py-1 bg-white/10 rounded">{selectedUser.selected_charity_id ? 'Linked' : 'None'}</span>
                </div>
              </div>

              <div>
                <Button className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  Manual Status Override
                </Button>
                <p className="text-center text-xs text-white/30 mt-2">Only use this tool to fix desynced Stripe states.</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
