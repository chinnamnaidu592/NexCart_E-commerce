import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import Link from '@/components/common/Link';
import { Truck, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { ORDER_STATUSES } from '@/constants/orderStatus';

export default function FulfillmentAnalytics({ orders = [] }) {
  const statusCounts = {
    [ORDER_STATUSES.DELIVERED]: 0,
    [ORDER_STATUSES.SHIPPED]: 0,
    [ORDER_STATUSES.PROCESSING]: 0,
    [ORDER_STATUSES.PENDING]: 0,
  };

  const statusValues = {
    [ORDER_STATUSES.DELIVERED]: 0,
    [ORDER_STATUSES.SHIPPED]: 0,
    [ORDER_STATUSES.PROCESSING]: 0,
    [ORDER_STATUSES.PENDING]: 0,
  };

  orders.forEach((ord) => {
    const st = ord.status || ORDER_STATUSES.PENDING;
    if (statusCounts[st] !== undefined) {
      statusCounts[st] += 1;
      statusValues[st] += Number(ord.total) || 0;
    } else {
      statusCounts[ORDER_STATUSES.PENDING] += 1;
      statusValues[ORDER_STATUSES.PENDING] += Number(ord.total) || 0;
    }
  });

  const total = orders.length || 1;

  const pipelines = [
    {
      status: ORDER_STATUSES.DELIVERED,
      label: 'Delivered',
      count: statusCounts[ORDER_STATUSES.DELIVERED],
      value: statusValues[ORDER_STATUSES.DELIVERED],
      icon: CheckCircle2,
      textColor: 'text-[#166534]',
      badgeBg: 'bg-[#F0FDF4]',
      badgeBorder: 'border-[#BBF7D0]',
    },
    {
      status: ORDER_STATUSES.SHIPPED,
      label: 'In Transit',
      count: statusCounts[ORDER_STATUSES.SHIPPED],
      value: statusValues[ORDER_STATUSES.SHIPPED],
      icon: Truck,
      textColor: 'text-[#1E40AF]',
      badgeBg: 'bg-[#EFF6FF]',
      badgeBorder: 'border-[#BFDBFE]',
    },
    {
      status: ORDER_STATUSES.PROCESSING,
      label: 'Processing',
      count: statusCounts[ORDER_STATUSES.PROCESSING],
      value: statusValues[ORDER_STATUSES.PROCESSING],
      icon: Clock,
      textColor: 'text-[#B45309]',
      badgeBg: 'bg-[#FFFBEB]',
      badgeBorder: 'border-[#FDE68A]',
    },
    {
      status: ORDER_STATUSES.PENDING,
      label: 'Pending Verification',
      count: statusCounts[ORDER_STATUSES.PENDING],
      value: statusValues[ORDER_STATUSES.PENDING],
      icon: AlertTriangle,
      textColor: 'text-[#991B1B]',
      badgeBg: 'bg-[#FEF2F2]',
      badgeBorder: 'border-[#FECACA]',
    },
  ];

  return (
    <div className="bg-white rounded-sm border border-[#E7E5E4] p-6 text-left shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F5F5F4]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#78716C]">
              Logistics Health
            </span>
            <span className="text-[#D6D3D1]">·</span>
            <span className="text-[10px] font-mono text-[#78716C]">
              {orders.length} Active Shipments
            </span>
          </div>
          <h3 className="font-sans text-xl font-normal text-[#1C1917] tracking-tight mt-0.5">
            Fulfillment Pipeline Status
          </h3>
        </div>

        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:underline"
        >
          <span>Dispatch Queue</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
        </Link>
      </div>

      {/* Grid of Status Stages */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-5">
        {pipelines.map((pipe) => {
          const Icon = pipe.icon;
          const share = Math.round((pipe.count / total) * 100);

          return (
            <div
              key={pipe.status}
              className={`p-4 border rounded-xs ${pipe.badgeBg} ${pipe.badgeBorder} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${pipe.textColor}`}>
                  {pipe.label}
                </span>
                <Icon className={`w-4 h-4 stroke-[1.5] ${pipe.textColor}`} />
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-[#1C1917] tabular-nums">
                    {pipe.count}
                  </span>
                  <span className="font-mono text-xs text-[#78716C] tabular-nums">
                    ({share}%)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#78716C] block mt-1 tabular-nums">
                  {formatCurrency(pipe.value)} gross
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Carrier Benchmark Footnote */}
      <div className="pt-3 border-t border-[#F5F5F4] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#78716C]">
        <div className="flex items-center gap-3">
          <span>Avg. Dispatch: <strong className="text-[#1C1917] font-mono font-medium">1.4 days</strong></span>
          <span className="text-[#D6D3D1]">·</span>
          <span>Courier On-Time: <strong className="text-[#166534] font-mono font-medium">98.4%</strong></span>
          <span className="text-[#D6D3D1]">·</span>
          <span>Transit SLA: <strong className="text-[#1C1917] font-mono font-medium">3.1 days</strong></span>
        </div>
        <span className="text-[#78716C] font-mono text-[10px]">
          FedEx · DHL · USPS APIs Active
        </span>
      </div>
    </div>
  );
}
