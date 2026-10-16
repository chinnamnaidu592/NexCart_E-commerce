'use client';

import React, { useState } from 'react';
import { ClipboardCheck, CheckCircle2, XCircle, Search, Store, Tag } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import toast from 'react-hot-toast';

const INITIAL_PENDING_PRODUCTS = [
  {
    id: 'PRD-AUDIT-01',
    title: 'Nordic Oak Floating Desk & Audio Console',
    category: 'furniture',
    seller: 'NexCart Atelier',
    sellerId: 3,
    price: 34999,
    stock: 8,
    submittedDate: '2026-10-14',
    status: 'pending',
    thumbnail: '/src/assets/images/hero_scandinavian_craft_1791282659132.jpg',
  },
  {
    id: 'PRD-AUDIT-02',
    title: 'Damascus Steel Folding Utility Knife',
    category: 'craft-objects',
    seller: 'Laurent Craft Studio',
    sellerId: 4,
    price: 6499,
    stock: 25,
    submittedDate: '2026-10-15',
    status: 'pending',
    thumbnail: '/src/assets/images/category_craft_objects_1791282688777.jpg',
  },
  {
    id: 'PRD-AUDIT-03',
    title: 'Hand-Loomed Merino Wool Bedspread',
    category: 'home-decoration',
    seller: 'Vedic Loom Textiles',
    sellerId: 6,
    price: 11999,
    stock: 12,
    submittedDate: '2026-10-11',
    status: 'approved',
    thumbnail: '/src/assets/images/category_craft_objects_1791282688777.jpg',
  },
  {
    id: 'PRD-AUDIT-04',
    title: 'Low-Grade Uncertified Wireless Earbuds',
    category: 'electronics',
    seller: 'Generic Audio Co',
    sellerId: 9,
    price: 799,
    stock: 100,
    submittedDate: '2026-10-09',
    status: 'rejected',
    thumbnail: '/src/assets/images/hero_scandinavian_craft_1791282659132.jpg',
  },
];

export default function AdminProductApprovalsPage() {
  const [products, setProducts] = useState(INITIAL_PENDING_PRODUCTS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const handleApprove = (id, title) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved' } : p))
    );
    toast.success(`Product "${title}" approved for live customer storefront.`);
  };

  const handleReject = (id, title) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'rejected' } : p))
    );
    toast.error(`Product "${title}" rejected from marketplace.`);
  };

  const filtered = products.filter((p) => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.seller.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E5E4]">
        <div>
          <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.2em] block mb-1">
            Catalog Gatekeeping
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
            Product Listing Approvals
          </h1>
          <p className="text-xs text-[#78716C] mt-1 font-mono">
            Audit merchant SKU submissions for luxury provenance, quality standards, and pricing accuracy.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#F5F5F4]  p-1 border border-[#E7E5E4]  rounded-xs text-xs">
          {['all', 'pending', 'approved', 'rejected'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`px-3 py-1 uppercase tracking-wider text-[11px] font-semibold rounded-xs transition-colors cursor-pointer capitalize ${
                filter === st
                  ? 'bg-[#1C1917]  text-white  shadow-2xs'
                  : 'text-[#78716C]  hover:text-[#1C1917] '
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
          placeholder="Search by product title, seller, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-white  border border-[#E7E5E4]  rounded-xs pl-8 pr-3 py-2 text-[#1C1917]  placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917] "
        />
        <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Products Table */}
      <div className="bg-white  border border-[#E7E5E4]  rounded-xs overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F5F4]  text-[#78716C]  uppercase tracking-[0.12em] font-semibold border-b border-[#E7E5E4] ">
                <th className="py-3 px-5">Product Item</th>
                <th className="py-3 px-5">Seller / Atelier</th>
                <th className="py-3 px-5">Category & Stock</th>
                <th className="py-3 px-5">Listing Price</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F4] ">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[#78716C]">
                    No items in product approval queue.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAFAF9]  transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-10 h-10 rounded-xs object-cover bg-stone-100 border border-[#E7E5E4] "
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-[#1C1917]  truncate">
                            {item.title}
                          </p>
                          <p className="text-[10px] font-mono text-[#A8A29E]">ID: {item.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5 font-medium text-[#1C1917] ">
                        <Store className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item.seller}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#A8A29E]">Partner #{item.sellerId}</span>
                    </td>

                    <td className="py-4 px-5">
                      <p className="capitalize text-[#57534E] ">{item.category}</p>
                      <p className="text-[11px] text-[#78716C]">{item.stock} initial units</p>
                    </td>

                    <td className="py-4 px-5 font-semibold text-[#1C1917]  tabular-nums">
                      {formatCurrency(item.price)}
                    </td>

                    <td className="py-4 px-5">
                      {item.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase font-mono bg-emerald-50 text-emerald-700   border border-emerald-200 ">
                          <CheckCircle2 className="w-3 h-3" /> Live
                        </span>
                      ) : item.status === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase font-mono bg-red-50 text-red-700   border border-red-200 ">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase font-mono bg-amber-50 text-amber-700   border border-amber-200 ">
                          Pending Audit
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-right">
                      {item.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleApprove(item.id, item.title)}
                            className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-xs transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(item.id, item.title)}
                            className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-[#F5F5F4]  hover:bg-red-50 text-red-600 rounded-xs border border-[#E7E5E4]  transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-[#A8A29E]">Settled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
