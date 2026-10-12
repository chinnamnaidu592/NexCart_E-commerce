import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { Filter, CreditCard, Smartphone, Monitor, ShoppingCart } from 'lucide-react';

export default function ConversionFunnelAnalytics({ funnelData = {}, paymentMethods = [] }) {
  const {
    sessions = 18450,
    productViews = 11290,
    addToCarts = 2680,
    checkouts = 1140,
    purchases = 642,
    cartAbandonment = 57.5,
  } = funnelData;

  const funnelSteps = [
    { label: 'Store Sessions', count: sessions, pct: 100, stepDrop: null },
    {
      label: 'Catalog & PDP Views',
      count: productViews,
      pct: Math.round((productViews / sessions) * 100),
      stepDrop: `${Math.round((1 - productViews / sessions) * 100)}% drop`,
    },
    {
      label: 'Added to Basket',
      count: addToCarts,
      pct: Math.round((addToCarts / sessions) * 100),
      stepDrop: `${Math.round((1 - addToCarts / productViews) * 100)}% drop`,
    },
    {
      label: 'Checkout Commenced',
      count: checkouts,
      pct: Math.round((checkouts / sessions) * 100),
      stepDrop: `${Math.round((1 - checkouts / addToCarts) * 100)}% drop`,
    },
    {
      label: 'Completed Orders',
      count: purchases,
      pct: Math.round((purchases / sessions) * 100 * 10) / 10,
      stepDrop: `${Math.round((1 - purchases / checkouts) * 100)}% drop`,
    },
  ];

  const overallConversion = ((purchases / sessions) * 100).toFixed(2);

  return (
    <div className="bg-white rounded-sm border border-[#E7E5E4] p-6 text-left shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#F5F5F4]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#78716C]">
                Funnel Telemetry
              </span>
              <span className="text-[#D6D3D1]">·</span>
              <span className="text-[10px] font-mono text-[#166534] font-medium">
                {overallConversion}% Conversion
              </span>
            </div>
            <h3 className="font-sans text-xl font-normal text-[#1C1917] tracking-tight mt-0.5">
              Shopper Purchase Funnel
            </h3>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-[#78716C] tracking-wider block">
              Cart Abandonment
            </span>
            <span className="font-mono text-xs font-medium text-[#1C1917] tabular-nums">
              {cartAbandonment}%
            </span>
          </div>
        </div>

        {/* Funnel Steps */}
        <div className="py-4 space-y-3">
          {funnelSteps.map((step, idx) => (
            <div key={step.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#1C1917] font-medium flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#78716C] w-4">{`0${idx + 1}`}</span>
                  {step.label}
                </span>
                <div className="flex items-center gap-2 font-mono text-xs tabular-nums">
                  <span className="text-[#1C1917] font-semibold">{step.count.toLocaleString()}</span>
                  <span className="text-[10px] text-[#78716C]">({step.pct}%)</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#F5F5F4] h-2 rounded-none overflow-hidden relative">
                <div
                  className="bg-[#1C1917] h-full transition-all duration-300"
                  style={{ width: `${Math.max((step.count / sessions) * 100, 2)}%` }}
                />
              </div>

              {step.stepDrop && (
                <div className="text-[10px] text-[#A8A29E] font-mono text-right">
                  {step.stepDrop} between stages
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Payment Channels Breakdown */}
        <div className="pt-4 border-t border-[#F5F5F4]">
          <span className="text-[10px] uppercase font-semibold text-[#78716C] tracking-wider block mb-2.5">
            Checkout Settlement Channels
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(paymentMethods.length ? paymentMethods : [
              { method: 'Instant UPI / QR', share: 58, volume: 184500 },
              { method: 'Cards & NetBanking', share: 31, volume: 98600 },
              { method: 'Cash on Delivery', share: 11, volume: 34980 },
            ]).map((pm) => (
              <div key={pm.method} className="bg-[#FAFAF9] p-2.5 border border-[#E7E5E4] rounded-xs">
                <span className="text-[10px] text-[#78716C] block truncate">{pm.method}</span>
                <span className="font-mono text-sm font-semibold text-[#1C1917] tabular-nums block mt-0.5">
                  {pm.share}%
                </span>
                <span className="text-[9px] font-mono text-[#A8A29E] block mt-0.5">
                  {formatCurrency(pm.volume)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device distribution note */}
      <div className="pt-3 border-t border-[#F5F5F4] mt-4 flex items-center justify-between text-[11px] text-[#78716C]">
        <div className="flex items-center gap-1.5">
          <Monitor className="w-3 h-3 stroke-[1.5]" />
          <span>Desktop 58%</span>
          <span className="text-[#D6D3D1]">·</span>
          <Smartphone className="w-3 h-3 stroke-[1.5]" />
          <span>Mobile 42%</span>
        </div>
        <span className="font-mono text-[10px] text-[#166534] font-medium">99.8% Gateway Uptime</span>
      </div>
    </div>
  );
}
