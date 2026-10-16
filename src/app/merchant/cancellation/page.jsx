'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/utils/formatters';
import { RotateCcw, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_CANCELLATIONS = [
  {
    id: 'REQ-CAN-201',
    orderId: 'ORD-IN-8840',
    customer: 'Tanvi Nair',
    item: 'Damascus Steel Folding Utility Knife',
    qty: 1,
    refundAmount: 6499,
    reason: 'Incorrect delivery address provided during checkout; reordering to new Bengaluru pincode.',
    requestedAt: '2026-10-15',
    status: 'pending',
  },
  {
    id: 'REQ-CAN-202',
    orderId: 'ORD-IN-8831',
    customer: 'Rohan Mehra',
    item: 'Artisanal Ceramic Pour-Over Dripper',
    qty: 2,
    refundAmount: 3998,
    reason: 'Accidental duplicate order placement.',
    requestedAt: '2026-10-14',
    status: 'approved',
  },
  {
    id: 'REQ-CAN-203',
    orderId: 'ORD-IN-8819',
    customer: 'Gaurav Joshi',
    item: 'Scandinavian Minimalist Lounge Chair',
    qty: 1,
    refundAmount: 42499,
    reason: 'Parcel already received in transit; client requested return after dispatch milestone.',
    requestedAt: '2026-10-11',
    status: 'rejected',
  },
];

export default function MerchantCancellationsPage() {
  const [requests, setRequests] = useState(INITIAL_CANCELLATIONS);
  const [filter, setFilter] = useState('all');

  const handleApprove = (id, amount) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );
    toast.success(`Cancellation ${id} approved. Initiating refund of ${formatCurrency(amount)}.`);
  };

  const handleReject = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    );
    toast.error(`Cancellation ${id} rejected. Consignment will proceed.`);
  };

  const filtered = requests.filter(
    (r) => filter === 'all' || r.status.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E5E4]">
        <div>
          <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.2em] block mb-1">
            Buyer Post-Purchase Requests
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
            Order Cancellations & Return Inquiries
          </h1>
          <p className="text-xs text-[#78716C] mt-1 font-mono">
            Review customer cancellation and refund requests before packaging dispatch is initiated.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#F5F5F4]  p-1 border border-[#E7E5E4]  rounded-xs text-xs">
          {['all', 'pending', 'approved', 'rejected'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`px-3 py-1 uppercase tracking-wider text-[10px] font-semibold rounded-xs transition-colors cursor-pointer capitalize ${
                filter === st
                  ? 'bg-[#1C1917]  text-white  shadow-2xs'
                  : 'text-[#78716C]  hover:text-[#1C1917]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white  border border-[#E7E5E4]  rounded-xs overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F5F4]  text-[#78716C]  uppercase tracking-[0.12em] font-semibold border-b border-[#E7E5E4] ">
                <th className="py-3 px-5">Request ID & Order</th>
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Item & Stated Reason</th>
                <th className="py-3 px-5">Refund Amount</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Merchant Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F4] ">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-[#FAFAF9]  transition-colors">
                  <td className="py-4 px-5">
                    <p className="font-mono font-bold text-[#1C1917] ">{req.id}</p>
                    <p className="text-[11px] font-mono text-[#78716C] ">Ref: {req.orderId}</p>
                  </td>

                  <td className="py-4 px-5">
                    <p className="font-semibold text-[#1C1917] ">{req.customer}</p>
                    <p className="text-[10px] font-mono text-[#A8A29E]">{req.requestedAt}</p>
                  </td>

                  <td className="py-4 px-5 max-w-sm">
                    <p className="font-medium text-[#1C1917] ">
                      {req.item} (x{req.qty})
                    </p>
                    <p className="text-[11px] text-[#78716C] mt-0.5 leading-relaxed italic">
                      &quot;{req.reason}&quot;
                    </p>
                  </td>

                  <td className="py-4 px-5 font-semibold text-[#1C1917]  tabular-nums">
                    {formatCurrency(req.refundAmount)}
                  </td>

                  <td className="py-4 px-5">
                    {req.status === 'approved' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase font-mono bg-emerald-50 text-emerald-700   border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Refunded
                      </span>
                    ) : req.status === 'rejected' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase font-mono bg-red-50 text-red-700   border border-red-200">
                        <XCircle className="w-3 h-3" /> Declined
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase font-mono bg-amber-50 text-amber-700   border border-amber-200">
                        <Clock className="w-3 h-3" /> Action Required
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-5 text-right">
                    {req.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleApprove(req.id, req.refundAmount)}
                          className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-xs transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(req.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-[#F5F5F4]  text-red-600 border border-[#E7E5E4]  hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-mono text-[#A8A29E]">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
