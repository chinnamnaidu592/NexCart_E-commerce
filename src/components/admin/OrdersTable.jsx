import React, { useState } from 'react';
import OrderStatusBadge from './OrderStatusBadge';
import Pagination from '@/components/products/Pagination';
import {
  MERCHANT_CANCELLATION_REQUEST_STATUSES,
  ORDER_STATUSES,
} from '@/constants/orderStatus';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/formatters';

export default function OrdersTable({ orders = [], onUpdateStatus }) {
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const statuses = ['ALL', ...Object.values(ORDER_STATUSES)];

  const filtered = orders.filter((o) => {
    if (selectedStatus === 'ALL') return true;
    return o.status === selectedStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden text-left shadow-xs">
      {/* Filter Tabs */}
      <div className="p-6 border-b border-[#F5F5F4] flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {statuses.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setSelectedStatus(st);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-sm text-[11px] uppercase tracking-wider font-semibold transition-colors cursor-pointer border ${
                selectedStatus === st
                  ? 'bg-[#1C1917] text-white border-[#1C1917]'
                  : 'bg-white text-[#57534E] border-[#E7E5E4] hover:border-[#A8A29E]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#78716C]">
          {filtered.length} manifests recorded
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F5F5F4] text-[#78716C] uppercase tracking-[0.12em] font-semibold border-b border-[#E7E5E4]">
              <th scope="col" className="py-3 px-6">Manifest ID</th>
              <th scope="col" className="py-3 px-6">Consignee</th>
              <th scope="col" className="py-3 px-6">Date</th>
              <th scope="col" className="py-3 px-6">Objects</th>
              <th scope="col" className="py-3 px-6">Settlement</th>
              <th scope="col" className="py-3 px-6">Fulfillment</th>
              <th scope="col" className="py-3 px-6">Merchant cancellation requests</th>
              <th scope="col" className="py-3 px-6 text-right">Update Phase</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F4]">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-14 text-center text-[#78716C]">
                  No orders recorded for this phase filter.
                </td>
              </tr>
            ) : (
              paginated.map((ord) => {
                const cancellationRequests =
                  ord.merchantCancellationRequestsById &&
                  typeof ord.merchantCancellationRequestsById === 'object' &&
                  !Array.isArray(ord.merchantCancellationRequestsById)
                    ? Object.entries(ord.merchantCancellationRequestsById)
                      .filter(([, request]) => request && typeof request === 'object' && !Array.isArray(request))
                    : [];

                return (
                  <tr key={ord.id} className="hover:bg-[#FAFAF9] transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-[#1C1917]">
                      {ord.orderNumber || `ORD-${ord.id}`}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-[#1C1917]">
                        {ord.customerName || ord.shippingAddress?.fullName || `User #${ord.userId}`}
                      </p>
                      <p className="text-[11px] font-mono text-[#78716C]">{ord.customerEmail || 'online order'}</p>
                    </td>
                    <td className="py-4 px-6 font-mono text-[#78716C]">
                      {formatDate(ord.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-[#57534E]">
                      {ord.items?.length || 1} objects
                    </td>
                    <td className="py-4 px-6 font-sans text-base font-normal text-[#1C1917] tabular-nums">
                      {formatCurrency(ord.total)}
                    </td>
                    <td className="py-4 px-6">
                      <OrderStatusBadge status={ord.status} />
                    </td>
                    <td className="min-w-64 px-6 py-4">
                      {cancellationRequests.length ? (
                        <ul className="space-y-3">
                          {cancellationRequests.map(([merchantId, request]) => (
                            <li key={merchantId} className="space-y-1">
                              <p className="font-semibold text-[#1C1917]">
                                Merchant #{merchantId} · {
                                  typeof request.status === 'string'
                                    ? request.status
                                    : MERCHANT_CANCELLATION_REQUEST_STATUSES.PENDING
                                }
                              </p>
                              <p className="text-[#57534E]">
                                {typeof request.reason === 'string' && request.reason
                                  ? request.reason
                                  : 'No reason recorded.'}
                              </p>
                              <p className="font-mono text-[10px] text-[#78716C]">
                                Requested {formatDateTime(request.requestedAt)}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-[#A8A29E]">None</span>
                      )}
                      {cancellationRequests.some(([, request]) =>
                        request.status === MERCHANT_CANCELLATION_REQUEST_STATUSES.PENDING
                      ) && (
                        <p className="mt-2 text-[10px] text-[#78716C]">
                          Set order status to Cancelled to approve this request.
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => onUpdateStatus(ord.id, e.target.value)}
                        aria-label="Update order status"
                        className="text-xs font-medium border border-[#E7E5E4] rounded-sm px-2 py-1 bg-white text-[#1C1917] focus:outline-none focus:border-[#1C1917] cursor-pointer"
                      >
                        {Object.values(ORDER_STATUSES).map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-[#F5F5F4]">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          scrollToTop={false}
        />
      </div>
    </div>
  );
}
