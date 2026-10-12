import React from 'react';
import { formatCurrency } from '@/utils/formatters';

const SALES_DATA = [
  { day: 'Mon', revenue: 2420, orders: 18 },
  { day: 'Tue', revenue: 3100, orders: 24 },
  { day: 'Wed', revenue: 2850, orders: 21 },
  { day: 'Thu', revenue: 4120, orders: 32 },
  { day: 'Fri', revenue: 5390, orders: 45 },
  { day: 'Sat', revenue: 6840, orders: 58 },
  { day: 'Sun', revenue: 6150, orders: 49 },
];

export default function SalesOverview() {
  const maxRevenue = Math.max(...SALES_DATA.map((d) => d.revenue));
  const weekTotal = SALES_DATA.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="bg-white rounded-sm border border-[#E7E5E4] p-7 space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-5 border-b border-[#F5F5F4]">
        <div>
          <h3 className="font-sans text-2xl font-normal text-[#1C1917]">Weekly Revenue Flow</h3>
          <p className="text-xs text-[#78716C] mt-0.5">Seven-day gross receipts and volume analytics</p>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#78716C]">Gross Intake</span>
          <p className="font-sans text-2xl font-normal text-[#1C1917] tabular-nums">{formatCurrency(weekTotal)}</p>
        </div>
      </div>

      {/* Handcrafted Editorial Bar Chart */}
      <div className="pt-4 pb-2">
        <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end h-48 sm:h-56">
          {SALES_DATA.map((item) => {
            const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
            return (
              <div key={item.day} className="flex flex-col items-center h-full justify-end group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#1C1917] text-[#FAFAF9] text-[10px] font-mono py-1 px-2 mb-2 pointer-events-none whitespace-nowrap rounded-none">
                  {formatCurrency(item.revenue)} · {item.orders} ord
                </div>

                <div className="w-full bg-[#F5F5F4] rounded-none h-full flex items-end">
                  <div
                    className="w-full bg-[#1C1917] group-hover:bg-[#44403C] transition-all duration-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <span className="text-[11px] font-mono text-[#78716C] mt-2.5 uppercase">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
