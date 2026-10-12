import React, { useState } from 'react';
import { formatCurrency } from '@/utils/formatters';
import { BarChart3, LineChart, TrendingUp } from 'lucide-react';

export default function RevenueAnalyticsChart({ chartData = [], timeRange = '30d' }) {
  const [metricMode, setMetricMode] = useState('revenue'); // 'revenue' | 'orders' | 'aov'
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [chartType, setChartType] = useState('area'); // 'area' | 'bar'

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white rounded-sm border border-[#E7E5E4] p-8 text-center text-xs text-[#78716C]">
        No trend records available for this period.
      </div>
    );
  }

  // Extract values based on metricMode
  const getVal = (item) => {
    if (metricMode === 'orders') return item.orders || 0;
    if (metricMode === 'aov') {
      return item.orders > 0 ? Math.round(item.revenue / item.orders) : 0;
    }
    return item.revenue || 0;
  };

  const values = chartData.map(getVal);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values);
  const sumVal = values.reduce((a, b) => a + b, 0);
  const avgVal = Math.round(sumVal / values.length);

  // Peak index
  const peakIndex = values.indexOf(maxVal);
  const peakItem = chartData[peakIndex] || {};

  const formatMetricValue = (val) => {
    if (metricMode === 'orders') return `${val} orders`;
    return formatCurrency(val);
  };

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 240;
  const paddingX = 24;
  const paddingTop = 20;
  const paddingBottom = 30;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingTop - paddingBottom;

  // Compute coordinates for SVG line/area
  const points = chartData.map((item, idx) => {
    const x =
      paddingX +
      (chartData.length > 1 ? (idx / (chartData.length - 1)) * graphWidth : graphWidth / 2);
    const val = getVal(item);
    const y = paddingTop + graphHeight - (val / (maxVal * 1.15)) * graphHeight;
    return { x, y, item, val, idx };
  });

  // Construct smooth bezier path
  const linePath = points.reduce((path, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[idx - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpX2 = prev.x + (pt.x - prev.x) / 2;
    return `${path} C ${cpX1} ${prev.y}, ${cpX2} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + graphHeight} L ${points[0].x} ${
        paddingTop + graphHeight
      } Z`
    : '';

  // Average line Y coordinate
  const avgY = paddingTop + graphHeight - (avgVal / (maxVal * 1.15)) * graphHeight;

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div className="bg-white rounded-sm border border-[#E7E5E4] p-6 text-left shadow-xs">
      {/* Header with metric selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F5F5F4]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#78716C]">
              Transaction Trajectory
            </span>
            <span className="text-[#D6D3D1]">·</span>
            <span className="text-[10px] font-mono text-[#78716C] uppercase">
              {timeRange === '7d'
                ? 'Daily Run-Rate'
                : timeRange === '30d'
                ? '30-Day Velocity'
                : 'Aggregated Interval'}
            </span>
          </div>
          <h3 className="font-sans text-2xl font-normal text-[#1C1917] tracking-tight mt-0.5">
            {metricMode === 'revenue'
              ? 'Gross Revenue Flow'
              : metricMode === 'orders'
              ? 'Order Fulfillment Intake'
              : 'Average Basket Dynamics'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector Tabs */}
          <div
            role="tablist"
            className="flex items-center bg-[#F5F5F4] p-0.5 border border-[#E7E5E4] rounded-xs"
          >
            <button
              type="button"
              onClick={() => setMetricMode('revenue')}
              className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                metricMode === 'revenue'
                  ? 'bg-white text-[#1C1917] shadow-xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Revenue ($)
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('orders')}
              className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                metricMode === 'orders'
                  ? 'bg-white text-[#1C1917] shadow-xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Orders (Qty)
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('aov')}
              className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                metricMode === 'aov'
                  ? 'bg-white text-[#1C1917] shadow-xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Avg Basket
            </button>
          </div>

          {/* Chart Display Toggle (Area vs Bar) */}
          <div className="hidden sm:flex items-center bg-[#F5F5F4] p-0.5 border border-[#E7E5E4] rounded-xs">
            <button
              type="button"
              onClick={() => setChartType('area')}
              className={`p-1 rounded-xs transition-colors cursor-pointer ${
                chartType === 'area'
                  ? 'bg-white text-[#1C1917] shadow-xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
              title="Continuous curve view"
              aria-label="Area curve view"
            >
              <LineChart className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`p-1 rounded-xs transition-colors cursor-pointer ${
                chartType === 'bar'
                  ? 'bg-white text-[#1C1917] shadow-xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
              title="Segmented column view"
              aria-label="Bar column view"
            >
              <BarChart3 className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas with Interactive Hover */}
      <div className="relative pt-4 pb-2">
        {/* Floating Tooltip */}
        {activePoint && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 bg-[#1C1917] text-[#FAFAF9] p-2.5 rounded-xs shadow-md border border-[#44403C] text-xs font-mono"
            style={{
              left: `${(activePoint.x / svgWidth) * 100}%`,
              top: '12px',
            }}
          >
            <div className="text-[10px] text-[#A8A29E] uppercase tracking-wider">
              {activePoint.item.date || activePoint.item.day}
            </div>
            <div className="text-sm font-semibold text-white mt-0.5 tabular-nums">
              {formatMetricValue(activePoint.val)}
            </div>
            <div className="text-[10px] text-[#D6D3D1] mt-1 pt-1 border-t border-[#292524] flex items-center justify-between gap-3">
              <span>{activePoint.item.orders} orders</span>
              <span>{formatCurrency(activePoint.item.revenue)} gross</span>
            </div>
          </div>
        )}

        {/* Chart render */}
        {chartType === 'area' ? (
          <div className="w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-56 sm:h-64 overflow-visible"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1C1917" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#1C1917" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line
                x1={paddingX}
                y1={paddingTop + graphHeight * 0.25}
                x2={svgWidth - paddingX}
                y2={paddingTop + graphHeight * 0.25}
                stroke="#F5F5F4"
                strokeWidth="1"
              />
              <line
                x1={paddingX}
                y1={paddingTop + graphHeight * 0.5}
                x2={svgWidth - paddingX}
                y2={paddingTop + graphHeight * 0.5}
                stroke="#F5F5F4"
                strokeWidth="1"
              />
              <line
                x1={paddingX}
                y1={paddingTop + graphHeight * 0.75}
                x2={svgWidth - paddingX}
                y2={paddingTop + graphHeight * 0.75}
                stroke="#F5F5F4"
                strokeWidth="1"
              />
              <line
                x1={paddingX}
                y1={paddingTop + graphHeight}
                x2={svgWidth - paddingX}
                y2={paddingTop + graphHeight}
                stroke="#E7E5E4"
                strokeWidth="1"
              />

              {/* Baseline Average Line */}
              <line
                x1={paddingX}
                y1={avgY}
                x2={svgWidth - paddingX}
                y2={avgY}
                stroke="#A8A29E"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={svgWidth - paddingX - 4}
                y={avgY - 4}
                textAnchor="end"
                className="text-[9px] font-mono fill-[#78716C]"
              >
                Avg {formatMetricValue(avgVal)}
              </text>

              {/* Area fill */}
              <path d={areaPath} fill="url(#areaGradient)" />

              {/* Curve Stroke */}
              <path
                d={linePath}
                fill="none"
                stroke="#1C1917"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Point Triggers */}
              {points.map((pt) => {
                const isHovered = hoveredIndex === pt.idx;
                return (
                  <g key={pt.idx}>
                    {/* Hover column trigger */}
                    <rect
                      x={pt.x - graphWidth / (chartData.length * 2)}
                      y={paddingTop}
                      width={Math.max(graphWidth / chartData.length, 12)}
                      height={graphHeight}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(pt.idx)}
                    />

                    {/* Point marker */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 5 : 2.5}
                      fill={isHovered ? '#1C1917' : '#FAFAF9'}
                      stroke="#1C1917"
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      className="transition-all duration-150 pointer-events-none"
                    />

                    {/* Vertical guideline on hover */}
                    {isHovered && (
                      <line
                        x1={pt.x}
                        y1={paddingTop}
                        x2={pt.x}
                        y2={paddingTop + graphHeight}
                        stroke="#1C1917"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        className="pointer-events-none"
                      />
                    )}

                    {/* X-axis labels (render selective labels to prevent clutter) */}
                    {(chartData.length <= 12 || pt.idx % Math.ceil(chartData.length / 7) === 0) && (
                      <text
                        x={pt.x}
                        y={paddingTop + graphHeight + 18}
                        textAnchor="middle"
                        className="text-[10px] font-mono fill-[#78716C]"
                      >
                        {pt.item.label || pt.item.day || pt.item.date}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          /* Segmented Bar View */
          <div className="w-full">
            <div
              className="grid gap-1 sm:gap-2 items-end h-56 sm:h-64 pt-4 px-2"
              style={{
                gridTemplateColumns: `repeat(${chartData.length}, minmax(0, 1fr))`,
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {chartData.map((item, idx) => {
                const val = getVal(item);
                const heightPct = Math.max(Math.round((val / (maxVal * 1.1)) * 100), 4);
                const isHovered = hoveredIndex === idx;

                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center h-full justify-end cursor-pointer group"
                    onMouseEnter={() => setHoveredIndex(idx)}
                  >
                    <div className="w-full bg-[#F5F5F4] rounded-none h-full flex items-end">
                      <div
                        className={`w-full transition-all duration-200 ${
                          isHovered
                            ? 'bg-[#1C1917]'
                            : 'bg-[#44403C] hover:bg-[#1C1917]'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-[#78716C] mt-2 truncate w-full text-center">
                      {item.label || item.day || item.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Summary Footer with High/Low/Average Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#F5F5F4] text-xs">
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#78716C] tracking-wider block">
            Period Aggregate
          </span>
          <span className="font-mono font-medium text-[#1C1917] tabular-nums mt-0.5 block">
            {formatMetricValue(sumVal)}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#78716C] tracking-wider block">
            Daily Run-Rate Avg
          </span>
          <span className="font-mono font-medium text-[#1C1917] tabular-nums mt-0.5 block">
            {formatMetricValue(avgVal)}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#78716C] tracking-wider block">
            Peak Velocity ({peakItem.label || peakItem.day || 'Day'})
          </span>
          <span className="font-mono font-medium text-[#166534] tabular-nums mt-0.5 block">
            {formatMetricValue(maxVal)}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#78716C] tracking-wider block">
            Minimum Baseline
          </span>
          <span className="font-mono font-medium text-[#78716C] tabular-nums mt-0.5 block">
            {formatMetricValue(minVal)}
          </span>
        </div>
      </div>
    </div>
  );
}
