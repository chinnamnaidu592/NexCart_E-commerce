import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}) {
  return (
    <div className="bg-white rounded-sm border border-[#E7E5E4] p-6 text-left">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.16em]">
          {title}
        </span>
        <div className="p-2 rounded-xs bg-[#F5F5F4] text-[#1C1917] border border-[#E7E5E4]">
          <Icon className="w-4 h-4 stroke-[1.5]" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="font-sans text-3xl font-normal text-[#1C1917] tracking-tight tabular-nums">
          {value}
        </h3>
        {trend && (
          <span className="inline-flex items-center text-xs font-mono font-medium text-[#166534] gap-0.5 tabular-nums">
            <TrendingUp className="w-3.5 h-3.5 stroke-[1.5]" />
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="text-[11px] text-[#A8A29E] mt-1.5">{subtitle}</p>}
    </div>
  );
}
