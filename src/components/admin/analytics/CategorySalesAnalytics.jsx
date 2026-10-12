import React, { useState } from 'react';
import { formatCurrency } from '@/utils/formatters';
import { Layers, ArrowUpDown, ChevronRight } from 'lucide-react';

export default function CategorySalesAnalytics({ categories = [] }) {
  const [sortBy, setSortBy] = useState('revenue'); // 'revenue' | 'units' | 'share'

  const sortedCategories = [...categories].sort((a, b) => {
    if (sortBy === 'units') return (b.units || 0) - (a.units || 0);
    if (sortBy === 'share') return (b.share || 0) - (a.share || 0);
    return (b.revenue || 0) - (a.revenue || 0);
  });

  const totalCatRevenue = categories.reduce((sum, c) => sum + (c.revenue || 0), 0);

  return (
    <div className="bg-white rounded-sm border border-[#E7E5E4] p-6 text-left shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#F5F5F4]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#78716C]">
                Portfolio Allocation
              </span>
              <span className="text-[#D6D3D1]">·</span>
              <span className="text-[10px] font-mono text-[#78716C]">
                {categories.length} Active Departments
              </span>
            </div>
            <h3 className="font-sans text-xl font-normal text-[#1C1917] tracking-tight mt-0.5">
              Category Sales Distribution
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-[#78716C] uppercase tracking-wider font-medium hidden sm:inline">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-medium text-[#1C1917] bg-[#F5F5F4] border border-[#E7E5E4] rounded-xs px-2 py-1 cursor-pointer focus:outline-none"
            >
              <option value="revenue">Gross Revenue</option>
              <option value="units">Units Dispatched</option>
              <option value="share">Volume Share %</option>
            </select>
          </div>
        </div>

        {/* Stacked Horizon Bar */}
        <div className="py-4">
          <div className="h-3 w-full bg-[#F5F5F4] rounded-none overflow-hidden flex">
            {sortedCategories.slice(0, 5).map((cat, idx) => {
              const share = totalCatRevenue > 0 ? (cat.revenue / totalCatRevenue) * 100 : 0;
              const opacities = ['bg-[#1C1917]', 'bg-[#44403C]', 'bg-[#78716C]', 'bg-[#A8A29E]', 'bg-[#D6D3D1]'];
              return (
                <div
                  key={cat.name}
                  className={`h-full ${opacities[idx % opacities.length]} transition-all duration-300`}
                  style={{ width: `${Math.max(share, 2)}%` }}
                  title={`${cat.name}: ${share.toFixed(1)}%`}
                />
              );
            })}
          </div>
        </div>

        {/* Category Rows */}
        <div className="divide-y divide-[#F5F5F4] max-h-80 overflow-y-auto pr-1">
          {sortedCategories.map((cat) => {
            const share = totalCatRevenue > 0 ? ((cat.revenue / totalCatRevenue) * 100).toFixed(1) : 0;
            return (
              <div key={cat.name} className="py-3 group hover:bg-[#FAFAF9] transition-colors px-1">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#1C1917] capitalize">{cat.name}</span>
                    {cat.tag && (
                      <span className="text-[9px] font-mono text-[#78716C] border border-[#E7E5E4] px-1.5 py-0.2 rounded-xs bg-[#F5F5F4]">
                        {cat.tag}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-medium text-[#1C1917] tabular-nums">
                      {formatCurrency(cat.revenue)}
                    </span>
                    <span className="text-[10px] text-[#78716C] font-mono ml-2 tabular-nums">
                      ({share}%)
                    </span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="flex items-center justify-between gap-3 text-[11px] text-[#78716C]">
                  <div className="w-full bg-[#F5F5F4] h-1.5 rounded-none overflow-hidden flex-1">
                    <div
                      className="bg-[#1C1917] h-full transition-all duration-300"
                      style={{ width: `${share}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] tabular-nums shrink-0">
                    {cat.units || 0} units
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-[#F5F5F4] mt-3 flex items-center justify-between text-[11px] text-[#78716C]">
        <span>Aggregated department sales:</span>
        <span className="font-mono font-semibold text-[#1C1917] tabular-nums">
          {formatCurrency(totalCatRevenue)}
        </span>
      </div>
    </div>
  );
}
