'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/utils/formatters';
import { ShoppingBag, Truck, CheckCircle2, Clock, Search, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_MERCHANT_ORDERS = [
  {
    id: 'ORD-IN-8891',
    customer: 'Ananya Sharma',
    email: 'ananya.s@example.com',
    phone: '+91 98765 43210',
    shippingAddress: 'Flat 402, Lotus Towers, Banjara Hills, Hyderabad, Telangana - 500034',
    items: [
      { name: 'Scandinavian Minimalist Lounge Chair', qty: 1, price: 42499 },
    ],
    total: 42499,
    status: 'Ready to Dispatch',
    trackingNumber: '',
    date: 'Oct 16, 2026, 10:45 AM',
  },
  {
    id: 'ORD-IN-8884',
    customer: 'Rahul Verma',
    email: 'rahul.v@example.com',
    phone: '+91 91234 56789',
    shippingAddress: 'C-12, Green Park Extension, New Delhi, Delhi - 110016',
    items: [
      { name: 'Artisanal Ceramic Pour-Over Dripper', qty: 2, price: 1999 },
    ],
    total: 3998,
    status: 'Processing',
    trackingNumber: '',
    date: 'Oct 16, 2026, 08:30 AM',
  },
  {
    id: 'ORD-IN-8872',
    customer: 'Priya Sundaram',
    email: 'priya.sun@example.com',
    phone: '+91 99887 76655',
    shippingAddress: 'Villa 7, Palm Grove, ECR, Chennai, Tamil Nadu - 600041',
    items: [
      { name: 'Precision Machined Brass Desk Clock', qty: 1, price: 8499 },
    ],
    total: 8499,
    status: 'Shipped',
    trackingNumber: 'BLUEDART-EXP-992104',
    date: 'Oct 15, 2026, 03:15 PM',
  },
  {
    id: 'ORD-IN-8850',
    customer: 'Vikramaditya Roy',
    email: 'v.roy@example.com',
    phone: '+91 97654 32109',
    shippingAddress: '14/B Rowland Road, Ballygunge, Kolkata, West Bengal - 700019',
    items: [
      { name: 'Nordic Oak Floating Desk & Audio Console', qty: 1, price: 34999 },
    ],
    total: 34999,
    status: 'Delivered',
    trackingNumber: 'DELHIVERY-PRV-44102',
    date: 'Oct 13, 2026',
  },
];

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState(INITIAL_MERCHANT_ORDERS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [activeTrackingInput, setActiveTrackingInput] = useState({});

  const handleMarkDispatched = (orderId) => {
    const tracking = activeTrackingInput[orderId] || `NEX-AIR-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, status: 'Shipped', trackingNumber: tracking }
          : ord
      )
    );
    toast.success(`Order ${orderId} marked as dispatched with tracking #${tracking}`);
  };

  const filtered = orders.filter((ord) => {
    const matchesFilter = statusFilter === 'all' || ord.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      ord.id.toLowerCase().includes(search.toLowerCase()) ||
      ord.customer.toLowerCase().includes(search.toLowerCase()) ||
      ord.shippingAddress.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E5E4]">
        <div>
          <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.2em] block mb-1">
            Fulfillment Center
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
            Store Orders & Consignments
          </h1>
          <p className="text-xs text-[#78716C] mt-1 font-mono">
            Manage allocations for your atelier goods, print packing manifests, and register dispatch tracking.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#F5F5F4]  p-1 border border-[#E7E5E4]  rounded-xs text-xs">
          {['all', 'Ready to Dispatch', 'Processing', 'Shipped', 'Delivered'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 uppercase tracking-wider text-[10px] font-semibold rounded-xs transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#1C1917]  text-white  shadow-2xs'
                  : 'text-[#78716C]  hover:text-[#1C1917]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search by order ID, customer, address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-white  border border-[#E7E5E4]  rounded-xs pl-8 pr-3 py-2 text-[#1C1917]  placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917]"
        />
        <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.map((ord) => (
          <div
            key={ord.id}
            className="bg-white  border border-[#E7E5E4]  rounded-xs p-5 shadow-2xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F5F5F4] ">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#1C1917] ">
                    {ord.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase font-mono ${
                      ord.status === 'Shipped' || ord.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700  '
                        : ord.status === 'Ready to Dispatch'
                        ? 'bg-amber-50 text-amber-700  '
                        : 'bg-stone-100 text-stone-700  '
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>
                <span className="text-[11px] text-[#78716C]  font-mono">
                  Placed: {ord.date}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-[#78716C] block">
                  Store Amount
                </span>
                <span className="text-base font-bold text-[#1C1917]  tabular-nums">
                  {formatCurrency(ord.total)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] block mb-1">
                  Recipient & Indian Dispatch Destination
                </span>
                <p className="font-semibold text-[#1C1917] ">{ord.customer}</p>
                <p className="text-[#57534E]  mt-0.5 leading-relaxed">
                  {ord.shippingAddress}
                </p>
                <p className="text-[#78716C] font-mono text-[11px] mt-1">Contact: {ord.phone}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] block mb-1">
                  Store Items ({ord.items.length})
                </span>
                <div className="space-y-1.5">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-[#57534E] ">
                      <span>
                        {it.name} <strong className="text-[#1C1917] ">x{it.qty}</strong>
                      </span>
                      <span className="font-mono tabular-nums">{formatCurrency(it.price * it.qty)}</span>
                    </div>
                  ))}
                </div>

                {ord.trackingNumber && (
                  <div className="mt-3 p-2 bg-[#F5F5F4]  rounded-xs font-mono text-[11px] text-[#1C1917]  flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Courier AWB: {ord.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            {ord.status !== 'Delivered' && ord.status !== 'Shipped' && (
              <div className="pt-3 border-t border-[#F5F5F4]  flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex-1 max-w-xs">
                  <input
                    type="text"
                    placeholder="Enter BlueDart/Delhivery AWB #..."
                    value={activeTrackingInput[ord.id] || ''}
                    onChange={(e) =>
                      setActiveTrackingInput({ ...activeTrackingInput, [ord.id]: e.target.value })
                    }
                    className="w-full text-xs bg-white  border border-[#E7E5E4]  rounded-xs px-2.5 py-1.5 text-[#1C1917]  focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => toast.success(`Packing Slip generated for ${ord.id}`)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#57534E]  border border-[#E7E5E4]  hover:bg-stone-100 rounded-xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Packing Slip</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkDispatched(ord.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-xs transition-colors cursor-pointer shadow-2xs"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dispatch Package</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
