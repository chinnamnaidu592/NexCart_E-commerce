'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/formatters';
import {
  TrendingUp,
  Star,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldCheck,
  Award,
} from 'lucide-react';

export default function MerchantPerformancePage() {
  const { user } = useAuth();
  const storeName = user?.storeName || 'NexCart Atelier';

  const metrics = [
    {
      title: 'Overall Store Rating',
      value: '4.92 / 5.0',
      note: 'Based on 148 verified client reviews',
      icon: Star,
      color: 'text-amber-500',
    },
    {
      title: 'Fulfillment Dispatch SLA',
      value: '99.4%',
      note: 'Orders dispatched within 24 hours',
      icon: Clock,
      color: 'text-emerald-500',
    },
    {
      title: 'Return / Dispute Rate',
      value: '0.8%',
      note: 'Well below 2.5% marketplace benchmark',
      icon: RotateCcw,
      color: 'text-blue-500',
    },
    {
      title: 'Catalog Authenticity Score',
      value: '100%',
      note: 'Certified provenance on all live SKUs',
      icon: ShieldCheck,
      color: 'text-purple-500',
    },
  ];

  const monthlyGrowth = [
    { month: 'Jun 2026', gmv: 340000, orders: 48 },
    { month: 'Jul 2026', gmv: 420000, orders: 62 },
    { month: 'Aug 2026', gmv: 510000, orders: 74 },
    { month: 'Sep 2026', gmv: 680000, orders: 95 },
    { month: 'Oct 2026 (MTD)', gmv: 490000, orders: 68 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-[#E7E5E4]">
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-4 h-4 text-emerald-600" />
          <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.2em]">
            Merchant Excellence Tier
          </span>
        </div>
        <h1 className="font-sans text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
          {storeName} · Store Health & Performance
        </h1>
        <p className="text-xs text-[#78716C] mt-1 font-mono">
          Audited fulfillment velocity, buyer ratings, and financial performance for your seller atelier.
        </p>
      </div>

      {/* SLA Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.title}
              className="bg-white  p-5 rounded-xs border border-[#E7E5E4]  shadow-2xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716C] ">
                  {m.title}
                </span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <p className="text-2xl font-bold text-[#1C1917]  tabular-nums">
                {m.value}
              </p>
              <p className="text-[11px] text-[#78716C]  mt-1">
                {m.note}
              </p>
            </div>
          );
        })}
      </div>

      {/* Revenue Progression Table */}
      <div className="bg-white  border border-[#E7E5E4]  rounded-xs overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-[#F5F5F4] ">
          <h2 className="text-sm font-semibold text-[#1C1917] ">
            Monthly Store Gross Merchandise Value (GMV)
          </h2>
          <p className="text-xs text-[#78716C] ">
            Verified revenue settlements disbursed to your registered banking credentials.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F5F4]  text-[#78716C]  uppercase tracking-[0.12em] font-semibold border-b border-[#E7E5E4] ">
                <th className="py-3 px-5">Billing Period</th>
                <th className="py-3 px-5">Orders Fulfilled</th>
                <th className="py-3 px-5">Gross Merchandise Volume</th>
                <th className="py-3 px-5">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F4] ">
              {monthlyGrowth.map((row) => (
                <tr key={row.month} className="hover:bg-[#FAFAF9]  transition-colors">
                  <td className="py-3.5 px-5 font-medium text-[#1C1917] ">
                    {row.month}
                  </td>
                  <td className="py-3.5 px-5 tabular-nums text-[#57534E] ">
                    {row.orders} orders
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-[#1C1917]  tabular-nums">
                    {formatCurrency(row.gmv)}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase font-mono bg-emerald-50 text-emerald-700   border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Disbursed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
