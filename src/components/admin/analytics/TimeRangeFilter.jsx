import React from 'react';
import { Download, RefreshCw, Calendar } from 'lucide-react';

export const TIME_RANGES = [
  { id: '7d', label: '7 Days', title: 'Last 7 Days' },
  { id: '30d', label: '30 Days', title: 'Last 30 Days' },
  { id: '90d', label: '90 Days', title: 'Quarter to Date' },
  { id: 'ytd', label: 'Year to Date', title: 'Calendar Year 2026' },
];

export default function TimeRangeFilter({
  selectedRange,
  onRangeChange,
  onExportCsv,
  onRefresh,
  isRefreshing = false,
  lastUpdated,
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E7E5E4]">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#78716C]">
            Merchant Intelligence & Analytics
          </span>
          <span className="text-[#D6D3D1]">·</span>
          <span className="text-[10px] font-mono text-[#78716C]">
            Live Sync {lastUpdated ? `· ${lastUpdated}` : ''}
          </span>
        </div>
        <h2 className="font-sans text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight mt-1">
          Store Performance & Analytics
        </h2>
        <p className="text-xs text-[#78716C] mt-1">
          Real-time commerce telemetry, gross transaction volume, conversion funnel, and unit economics.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Period Selector Tabs */}
        <div
          role="tablist"
          aria-label="Analytics Time Horizon"
          className="flex items-center bg-[#F5F5F4] p-1 border border-[#E7E5E4] rounded-xs"
        >
          {TIME_RANGES.map((range) => {
            const isActive = selectedRange === range.id;
            return (
              <button
                key={range.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onRangeChange(range.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#1C1917] text-[#FAFAF9] shadow-xs'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-white border border-[#E7E5E4] rounded-xs hover:bg-[#F5F5F4] transition-colors disabled:opacity-60 cursor-pointer"
          title="Refresh analytics data"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 stroke-[1.5] ${isRefreshing ? 'animate-spin text-[#1C1917]' : 'text-[#78716C]'}`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Export CSV Button */}
        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#1C1917] rounded-xs hover:bg-[#292524] transition-colors cursor-pointer whitespace-nowrap shadow-xs"
        >
          <Download className="w-3.5 h-3.5 stroke-[1.5]" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}
