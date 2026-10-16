'use client';

import React from 'react';
import Link from '@/components/common/Link';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/formatters';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  AlertTriangle,
  Plus,
  ArrowRight,
  Layers,
  CheckCircle2,
  Clock,
  RotateCcw,
} from 'lucide-react';

export default function MerchantDashboardPage() {
  const { user } = useAuth();
  const storeName = user?.storeName || 'NexCart Atelier';

  const stats = [
    {
      label: "Today's Revenue",
      value: formatCurrency(38450),
      trend: '+14.2% vs yesterday',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      label: 'Store Listings',
      value: '24 SKUs',
      trend: '4 pending approval',
      isPositive: true,
      icon: Package,
    },
    {
      label: 'Pending Fulfillments',
      value: '7 Orders',
      trend: '3 expedited delivery',
      isPositive: false,
      icon: ShoppingBag,
    },
    {
      label: 'Low Stock Alerts',
      value: '2 Items',
      trend: 'Restock advised',
      isPositive: false,
      icon: AlertTriangle,
    },
  ];

  const recentOrders = [
    {
      id: 'ORD-IN-8891',
      customer: 'Ananya Sharma',
      city: 'Hyderabad, Telangana',
      items: 'Scandinavian Minimalist Lounge Chair (x1)',
      amount: 42499,
      status: 'Ready to Dispatch',
      date: 'Today, 10:45 AM',
    },
    {
      id: 'ORD-IN-8884',
      customer: 'Rahul Verma',
      city: 'Delhi, NCR',
      items: 'Artisanal Ceramic Pour-Over (x2)',
      amount: 3998,
      status: 'Processing',
      date: 'Today, 08:30 AM',
    },
    {
      id: 'ORD-IN-8872',
      customer: 'Priya Sundaram',
      city: 'Chennai, Tamil Nadu',
      items: 'Precision Brass Mechanical Pen (x1)',
      amount: 1899,
      status: 'Shipped',
      date: 'Yesterday',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Store Header Banner */}
      <div className="bg-white  p-5 sm:p-6 rounded-xs border border-[#E7E5E4]  flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-emerald-50 text-emerald-700   border border-emerald-200 ">
              Active Seller Store
            </span>
            <span className="text-xs text-[#78716C] font-mono">Store ID: #{user?.id || '3'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#1C1917]  tracking-tight">
            Welcome back, {storeName}
          </h1>
          <p className="text-xs text-[#78716C]  mt-0.5">
            Your store is in good standing with a 99.4% dispatch rate this billing cycle.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/merchant/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1C1917]  hover:bg-[#292524] text-white  rounded-xs transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/merchant/inventory"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#F5F5F4]  text-[#1C1917]  border border-[#E7E5E4]  hover:bg-stone-200 rounded-xs transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Restock</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white  p-4.5 rounded-xs border border-[#E7E5E4]  shadow-2xs"
            >
              <div className="flex items-center justify-between text-[#78716C]  mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider">{s.label}</span>
                <Icon className="w-4 h-4 stroke-[1.5]" />
              </div>
              <p className="text-xl font-bold text-[#1C1917]  tabular-nums">
                {s.value}
              </p>
              <p
                className={`text-[11px] mt-1 ${
                  s.isPositive ? 'text-emerald-600 ' : 'text-[#78716C] '
                }`}
              >
                {s.trend}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/merchant/orders"
          className="group p-4 bg-white  rounded-xs border border-[#E7E5E4]  hover:border-emerald-600 transition-colors shadow-2xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#1C1917] ">
              Process Orders
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#78716C] group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-[#78716C] ">
            Generate shipping manifests and mark orders dispatched.
          </p>
        </Link>

        <Link
          href="/merchant/inventory"
          className="group p-4 bg-white  rounded-xs border border-[#E7E5E4]  hover:border-emerald-600 transition-colors shadow-2xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#1C1917] ">
              Inventory Ledger
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#78716C] group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-[#78716C] ">
            Inspect current stock counts and update SKU thresholds.
          </p>
        </Link>

        <Link
          href="/merchant/cancellation"
          className="group p-4 bg-white  rounded-xs border border-[#E7E5E4]  hover:border-emerald-600 transition-colors shadow-2xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#1C1917] ">
              Cancellation Requests
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#78716C] group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-[#78716C] ">
            Review client cancellation and return requests.
          </p>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white  rounded-xs border border-[#E7E5E4]  overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-[#F5F5F4]  flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#1C1917] ">
              Recent Orders For Your Store
            </h2>
            <p className="text-xs text-[#78716C] ">
              Orders containing items fulfillment from your inventory.
            </p>
          </div>
          <Link
            href="/merchant/orders"
            className="text-xs font-semibold uppercase tracking-wider text-emerald-600 hover:underline"
          >
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F5F4]  text-[#78716C]  uppercase tracking-[0.12em] font-semibold border-b border-[#E7E5E4] ">
                <th className="py-2.5 px-4">Order ID</th>
                <th className="py-2.5 px-4">Customer & City</th>
                <th className="py-2.5 px-4">Allocated Items</th>
                <th className="py-2.5 px-4">Total</th>
                <th className="py-2.5 px-4">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F4] ">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#FAFAF9]  transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-[#1C1917] ">
                    {ord.id}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-[#1C1917] ">{ord.customer}</p>
                    <p className="text-[11px] text-[#78716C] ">{ord.city}</p>
                  </td>
                  <td className="py-3 px-4 text-[#57534E]  max-w-xs truncate">
                    {ord.items}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#1C1917]  tabular-nums">
                    {formatCurrency(ord.amount)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase font-mono ${
                        ord.status === 'Shipped'
                          ? 'bg-emerald-50 text-emerald-700  '
                          : ord.status === 'Ready to Dispatch'
                          ? 'bg-amber-50 text-amber-700  '
                          : 'bg-stone-100 text-stone-700  '
                      }`}
                    >
                      {ord.status}
                    </span>
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
