'use client';

import React, { useState } from 'react';
import { Layers, AlertTriangle, Plus, CheckCircle2, Search, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_INVENTORY = [
  {
    sku: 'SKU-FURN-01',
    title: 'Scandinavian Minimalist Lounge Chair',
    category: 'Furniture',
    stock: 14,
    reorderThreshold: 5,
    incomingShipment: 10,
    eta: 'Oct 20, 2026',
  },
  {
    sku: 'SKU-KTCH-02',
    title: 'Artisanal Ceramic Pour-Over Dripper',
    category: 'Kitchen & Dining',
    stock: 35,
    reorderThreshold: 10,
    incomingShipment: 0,
    eta: '—',
  },
  {
    sku: 'SKU-DECO-03',
    title: 'Precision Machined Brass Desk Clock',
    category: 'Home & Living',
    stock: 4,
    reorderThreshold: 5,
    incomingShipment: 15,
    eta: 'Oct 18, 2026',
  },
  {
    sku: 'SKU-FURN-04',
    title: 'Nordic Oak Floating Desk & Audio Console',
    category: 'Furniture',
    stock: 8,
    reorderThreshold: 3,
    incomingShipment: 0,
    eta: '—',
  },
  {
    sku: 'SKU-KTCH-05',
    title: 'Cast Iron Teapot & Trivet Set',
    category: 'Kitchen & Dining',
    stock: 0,
    reorderThreshold: 8,
    incomingShipment: 20,
    eta: 'Tomorrow',
  },
];

export default function MerchantInventoryPage() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [restockAmount, setRestockAmount] = useState({});

  const handleInlineRestock = (sku, title) => {
    const qty = Number(restockAmount[sku] || 10);
    setInventory((prev) =>
      prev.map((item) =>
        item.sku === sku ? { ...item, stock: item.stock + qty } : item
      )
    );
    toast.success(`Restocked ${qty} units of "${title}".`);
    setRestockAmount((prev) => ({ ...prev, [sku]: '' }));
  };

  const filtered = inventory.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = inventory.filter((item) => item.stock <= item.reorderThreshold).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E5E4]">
        <div>
          <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.2em] block mb-1">
            Warehouse Allocations
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
            Inventory & Restocking Ledger
          </h1>
          <p className="text-xs text-[#78716C] mt-1 font-mono">
            Monitor real-time warehouse counts, set reorder thresholds, and register incoming consignments.
          </p>
        </div>

        {lowStockCount > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50  border border-amber-200  rounded-xs text-xs text-amber-800  font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{lowStockCount} items at or below reorder threshold</span>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Filter by title or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs bg-white  border border-[#E7E5E4]  rounded-xs pl-8 pr-3 py-2 text-[#1C1917]  placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917]"
        />
        <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Inventory Table */}
      <div className="bg-white  border border-[#E7E5E4]  rounded-xs overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F5F4]  text-[#78716C]  uppercase tracking-[0.12em] font-semibold border-b border-[#E7E5E4] ">
                <th className="py-3 px-5">SKU & Item Name</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">On-Hand Stock</th>
                <th className="py-3 px-5">Reorder Alert At</th>
                <th className="py-3 px-5">Incoming Transit</th>
                <th className="py-3 px-5 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F4] ">
              {filtered.map((item) => {
                const isCritical = item.stock <= item.reorderThreshold;
                return (
                  <tr key={item.sku} className="hover:bg-[#FAFAF9]  transition-colors">
                    <td className="py-3.5 px-5">
                      <p className="font-semibold text-[#1C1917] ">{item.title}</p>
                      <p className="text-[10px] font-mono text-[#A8A29E]">{item.sku}</p>
                    </td>

                    <td className="py-3.5 px-5 text-[#57534E] ">
                      {item.category}
                    </td>

                    <td className="py-3.5 px-5 tabular-nums">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-none text-xs ${
                          item.stock === 0
                            ? 'bg-red-50 text-red-700  '
                            : isCritical
                            ? 'bg-amber-50 text-amber-700  '
                            : 'text-[#1C1917] '
                        }`}
                      >
                        {item.stock} units
                      </span>
                    </td>

                    <td className="py-3.5 px-5 font-mono text-[#78716C] ">
                      ≤ {item.reorderThreshold} units
                    </td>

                    <td className="py-3.5 px-5">
                      {item.incomingShipment > 0 ? (
                        <div>
                          <p className="text-emerald-700  font-semibold">
                            +{item.incomingShipment} units
                          </p>
                          <p className="text-[10px] text-[#A8A29E] font-mono">ETA: {item.eta}</p>
                        </div>
                      ) : (
                        <span className="text-[#A8A29E] font-mono">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <input
                          type="number"
                          min="1"
                          placeholder="10"
                          value={restockAmount[item.sku] || ''}
                          onChange={(e) =>
                            setRestockAmount({ ...restockAmount, [item.sku]: e.target.value })
                          }
                          className="w-16 text-xs bg-white  border border-[#E7E5E4]  rounded-xs px-2 py-1 text-center text-[#1C1917]  focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleInlineRestock(item.sku, item.title)}
                          className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-xs transition-colors cursor-pointer"
                        >
                          + Add Stock
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
