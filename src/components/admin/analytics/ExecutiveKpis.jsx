import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Repeat,
  Percent,
  Clock,
  RotateCcw,
  CreditCard,
} from 'lucide-react';

export default function ExecutiveKpis({ metrics }) {
  const {
    grossRevenue = 0,
    grossRevenuePrior = 0,
    grossRevenueTrend = '+18.4%',
    netProfit = 0,
    netProfitMargin = '24.8%',
    totalOrders = 0,
    totalOrdersPrior = 0,
    totalOrdersTrend = '+12.1%',
    averageOrderValue = 0,
    aovTrend = '+5.6%',
    conversionRate = 3.42,
    conversionTrend = '+0.4%',
    repeatCustomerRate = 28.6,
    avgFulfillmentDays = 1.4,
    returnRate = 1.1,
  } = metrics || {};

  const isRevPositive = !grossRevenueTrend.startsWith('-');
  const isOrdersPositive = !totalOrdersTrend.startsWith('-');

  return (
    <div className="space-y-4 text-left">
      {/* Primary KPI Grid (4 High-level financial drivers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white rounded-sm border border-[#E7E5E4] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.14em]">
              Gross Revenue (GMV)
            </span>
            <div className="p-1.5 rounded-xs bg-[#F5F5F4] text-[#1C1917] border border-[#E7E5E4]">
              <DollarSign className="w-3.5 h-3.5 stroke-[1.5]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-sans text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight tabular-nums">
              {formatCurrency(grossRevenue)}
            </h3>
            <span
              className={`inline-flex items-center text-xs font-mono font-medium gap-0.5 tabular-nums ${
                isRevPositive ? 'text-[#166534]' : 'text-[#991B1B]'
              }`}
            >
              {isRevPositive ? (
                <TrendingUp className="w-3.5 h-3.5 stroke-[1.5]" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 stroke-[1.5]" />
              )}
              {grossRevenueTrend}
            </span>
          </div>
          <div className="mt-2 pt-2.5 border-t border-[#F5F5F4] flex items-center justify-between text-[11px] text-[#78716C]">
            <span>Prior period:</span>
            <span className="font-mono tabular-nums text-[#1C1917] font-medium">
              {formatCurrency(grossRevenuePrior)}
            </span>
          </div>
        </div>

        {/* Net Operating Revenue */}
        <div className="bg-white rounded-sm border border-[#E7E5E4] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.14em]">
              Estimated Net Profit
            </span>
            <div className="p-1.5 rounded-xs bg-[#F5F5F4] text-[#1C1917] border border-[#E7E5E4]">
              <CreditCard className="w-3.5 h-3.5 stroke-[1.5]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-sans text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight tabular-nums">
              {formatCurrency(netProfit)}
            </h3>
            <span className="inline-flex items-center text-xs font-mono font-medium text-[#78716C] tabular-nums">
              Margin {netProfitMargin}
            </span>
          </div>
          <div className="mt-2 pt-2.5 border-t border-[#F5F5F4] flex items-center justify-between text-[11px] text-[#78716C]">
            <span>Cost of goods & fees:</span>
            <span className="font-mono tabular-nums text-[#1C1917] font-medium">
              {formatCurrency(grossRevenue - netProfit)}
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-sm border border-[#E7E5E4] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.14em]">
              Completed Orders
            </span>
            <div className="p-1.5 rounded-xs bg-[#F5F5F4] text-[#1C1917] border border-[#E7E5E4]">
              <ShoppingBag className="w-3.5 h-3.5 stroke-[1.5]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-sans text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight tabular-nums">
              {totalOrders}
            </h3>
            <span
              className={`inline-flex items-center text-xs font-mono font-medium gap-0.5 tabular-nums ${
                isOrdersPositive ? 'text-[#166534]' : 'text-[#991B1B]'
              }`}
            >
              {isOrdersPositive ? (
                <TrendingUp className="w-3.5 h-3.5 stroke-[1.5]" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 stroke-[1.5]" />
              )}
              {totalOrdersTrend}
            </span>
          </div>
          <div className="mt-2 pt-2.5 border-t border-[#F5F5F4] flex items-center justify-between text-[11px] text-[#78716C]">
            <span>Prior period:</span>
            <span className="font-mono tabular-nums text-[#1C1917] font-medium">
              {totalOrdersPrior} orders
            </span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white rounded-sm border border-[#E7E5E4] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.14em]">
              Avg. Order Value (AOV)
            </span>
            <div className="p-1.5 rounded-xs bg-[#F5F5F4] text-[#1C1917] border border-[#E7E5E4]">
              <Percent className="w-3.5 h-3.5 stroke-[1.5]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-sans text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight tabular-nums">
              {formatCurrency(averageOrderValue)}
            </h3>
            <span className="inline-flex items-center text-xs font-mono font-medium text-[#166534] gap-0.5 tabular-nums">
              <TrendingUp className="w-3.5 h-3.5 stroke-[1.5]" />
              {aovTrend}
            </span>
          </div>
          <div className="mt-2 pt-2.5 border-t border-[#F5F5F4] flex items-center justify-between text-[11px] text-[#78716C]">
            <span>Basket density:</span>
            <span className="font-mono tabular-nums text-[#1C1917] font-medium">
              3.2 items / basket
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Operational Indicators (4 scannable micro-metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-[#FAFAF9] p-3 rounded-sm border border-[#E7E5E4]">
        <div className="px-3 py-2 border-r border-[#E7E5E4] last:border-r-0">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
            <Percent className="w-3 h-3 stroke-[1.5]" />
            <span>Storefront Conversion</span>
          </div>
          <p className="font-mono text-base font-semibold text-[#1C1917] mt-1 tabular-nums">
            {conversionRate}%{' '}
            <span className="text-[11px] text-[#166534] font-normal">{conversionTrend}</span>
          </p>
          <span className="text-[10px] text-[#A8A29E] block mt-0.5">Sessions to purchase</span>
        </div>

        <div className="px-3 py-2 lg:border-r border-[#E7E5E4]">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
            <Repeat className="w-3 h-3 stroke-[1.5]" />
            <span>Returning Customer</span>
          </div>
          <p className="font-mono text-base font-semibold text-[#1C1917] mt-1 tabular-nums">
            {repeatCustomerRate}%
          </p>
          <span className="text-[10px] text-[#A8A29E] block mt-0.5">Cohort 30d repeat</span>
        </div>

        <div className="px-3 py-2 border-r border-[#E7E5E4] last:border-r-0">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
            <Clock className="w-3 h-3 stroke-[1.5]" />
            <span>Fulfillment Velocity</span>
          </div>
          <p className="font-mono text-base font-semibold text-[#1C1917] mt-1 tabular-nums">
            {avgFulfillmentDays} <span className="text-xs font-normal text-[#78716C]">days</span>
          </p>
          <span className="text-[10px] text-[#A8A29E] block mt-0.5">From placement to carrier</span>
        </div>

        <div className="px-3 py-2">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
            <RotateCcw className="w-3 h-3 stroke-[1.5]" />
            <span>Return / Dispute Rate</span>
          </div>
          <p className="font-mono text-base font-semibold text-[#1C1917] mt-1 tabular-nums">
            {returnRate}%
          </p>
          <span className="text-[10px] text-[#A8A29E] block mt-0.5">Well below 3.0% threshold</span>
        </div>
      </div>
    </div>
  );
}
