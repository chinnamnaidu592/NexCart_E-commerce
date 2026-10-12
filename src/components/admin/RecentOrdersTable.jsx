import React from 'react';
import Link from '@/components/common/Link';
import OrderStatusBadge from './OrderStatusBadge';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function RecentOrdersTable({ orders = [] }) {
  const displayOrders = orders.slice(0, 6);

  return (
    <div className="bg-white rounded-sm border border-[#E7E5E4] overflow-hidden text-left">
      <div className="p-7 border-b border-[#F5F5F4] flex items-baseline justify-between">
        <div>
          <h3 className="font-sans text-2xl font-normal text-[#1C1917]">Recent Transactions</h3>
          <p className="text-xs text-[#78716C] mt-0.5">Verified dispatches and checkout manifests</p>
        </div>
        <Link
          href="/admin/orders"
          className="text-xs uppercase tracking-wider font-semibold text-[#1C1917] hover:underline"
        >
          View all orders →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F5F5F4] text-[#78716C] uppercase tracking-[0.12em] font-semibold border-b border-[#E7E5E4]">
              <th scope="col" className="py-3 px-6">Order ID</th>
              <th scope="col" className="py-3 px-6">Customer</th>
              <th scope="col" className="py-3 px-6">Date</th>
              <th scope="col" className="py-3 px-6">Gross</th>
              <th scope="col" className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F4]">
            {displayOrders.map((ord) => (
              <tr key={ord.id} className="hover:bg-[#FAFAF9] transition-colors">
                <td className="py-4 px-6 font-mono text-xs font-medium text-[#1C1917]">
                  {ord.orderNumber || `ORD-${ord.id}`}
                </td>
                <td className="py-4 px-6 font-medium text-[#1C1917]">
                  {ord.customerName || ord.shippingAddress?.fullName || `User #${ord.userId}`}
                </td>
                <td className="py-4 px-6 text-[#78716C] font-mono">
                  {formatDate(ord.createdAt)}
                </td>
                <td className="py-4 px-6 font-mono font-medium text-[#1C1917] tabular-nums">
                  {formatCurrency(ord.total)}
                </td>
                <td className="py-4 px-6">
                  <OrderStatusBadge status={ord.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
