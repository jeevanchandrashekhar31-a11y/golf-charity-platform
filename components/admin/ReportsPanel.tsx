'use client';

import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6', '#F97316'];

const CUSTOM_TOOLTIP_STYLE = {
  backgroundColor: '#111827',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#F8FAFC',
  fontSize: '13px',
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={CUSTOM_TOOLTIP_STYLE} className="p-3 shadow-xl">
      <p className="font-bold mb-1 text-white/70">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' && entry.name.toLowerCase().includes('revenue') ? formatCurrency(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
}

export default function ReportsPanel({ monthlyRevenue, subscriberTrend, charityDistribution, drawStats }: {
  monthlyRevenue: any[];
  subscriberTrend: any[];
  charityDistribution: any[];
  drawStats: any[];
}) {
  return (
    <div className="space-y-10 pb-32">
      {/* Row 1: Revenue + Subscribers */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyRevenue} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `£${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6">Active Subscribers Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={subscriberTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="subscribers" name="Subscribers" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Pie + Draw Stats Table */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6">Charity Contribution Distribution</h2>
          {charityDistribution.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-white/30">No charity data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={charityDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                >
                  {charityDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl overflow-x-auto">
          <h2 className="text-lg font-bold text-white mb-6">Draw Statistics</h2>
          {drawStats.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-white/30">No draws recorded yet</div>
          ) : (
            <table className="w-full text-sm whitespace-nowrap text-left">
              <thead className="text-white/40 text-xs uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="pb-3 pr-4">Month</th>
                  <th className="pb-3 pr-4">Pool</th>
                  <th className="pb-3 pr-4">Match 5</th>
                  <th className="pb-3 pr-4">Match 4</th>
                  <th className="pb-3 pr-4">Rollover</th>
                </tr>
              </thead>
              <tbody className="text-white divide-y divide-white/5">
                {drawStats.map((d: any) => (
                  <tr key={d.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4 font-medium capitalize">{d.draw_month}</td>
                    <td className="py-3 pr-4">{formatCurrency(d.total_prize_pool)}</td>
                    <td className="py-3 pr-4">{d.match5_winners ?? 0}</td>
                    <td className="py-3 pr-4">{d.match4_winners ?? 0}</td>
                    <td className="py-3 text-[#F59E0B]">{formatCurrency(d.jackpot_rollover)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
