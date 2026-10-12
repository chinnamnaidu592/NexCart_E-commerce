import React from 'react';
import { ORDER_STATUS_CONFIG, ORDER_STATUSES } from '@/constants/orderStatus';

export default function OrderStatusBadge({ status = ORDER_STATUSES.PENDING }) {
  const config = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG[ORDER_STATUSES.PENDING];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-[10px] uppercase font-mono tracking-wider font-semibold border ${config.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
