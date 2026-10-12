import React, { useState } from 'react';
import { formatCurrency } from '@/utils/formatters';
import Link from '@/components/common/Link';
import { Search, ExternalLink, ArrowUpDown, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TopProductsAnalytics({ products = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('revenue'); // 'revenue' | 'units' | 'stock'

  const filteredProducts = products.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'units') return (b.unitsSold || 0) - (a.unitsSold || 0);
    if (sortBy === 'stock') return (a.stock || 0) - (b.stock || 0);
    return (b.revenue || 0) - (a.revenue || 0);
  });

  return (
    <div className="bg-white rounded-sm border border-[#E7E5E4] overflow-hidden text-left shadow-xs">
      <div className="p-6 border-b border-[#F5F5F4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#78716C]">
              Inventory Velocity
            </span>
            <span className="text-[#D6D3D1]">·</span>
            <span className="text-[10px] font-mono text-[#78716C]">
              {products.length} Tracked SKUs
            </span>
          </div>
          <h3 className="font-sans text-xl sm:text-2xl font-normal text-[#1C1917] tracking-tight mt-0.5">
            Top Selling Products & Stock Health
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 stroke-[1.5] text-[#78716C] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter products..."
              className="text-xs bg-[#F5F5F4] border border-[#E7E5E4] rounded-xs pl-8 pr-3 py-1.5 text-[#1C1917] focus:outline-none focus:bg-white w-40 sm:w-48"
            />
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-medium text-[#1C1917] bg-[#F5F5F4] border border-[#E7E5E4] rounded-xs px-2 py-1.5 cursor-pointer focus:outline-none"
          >
            <option value="revenue">Sort by Revenue</option>
            <option value="units">Sort by Units Sold</option>
            <option value="stock">Sort by Lowest Stock</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F5F5F4] text-[#78716C] uppercase tracking-[0.12em] font-semibold border-b border-[#E7E5E4]">
              <th scope="col" className="py-3 px-6">Product</th>
              <th scope="col" className="py-3 px-6">Category</th>
              <th scope="col" className="py-3 px-6 text-right">Units Sold</th>
              <th scope="col" className="py-3 px-6 text-right">Gross Intake</th>
              <th scope="col" className="py-3 px-6 text-right">Available Stock</th>
              <th scope="col" className="py-3 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F4]">
            {sortedProducts.slice(0, 8).map((product, idx) => {
              const stock = product.stock ?? 25;
              const isLowStock = stock <= 10;
              const isOutOfStock = stock <= 0;

              return (
                <tr key={product.id || idx} className="hover:bg-[#FAFAF9] transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xs bg-[#F5F5F4] border border-[#E7E5E4] shrink-0 overflow-hidden flex items-center justify-center">
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-[10px] font-mono text-[#78716C]">SKU</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-medium text-[#1C1917] hover:underline block truncate max-w-xs"
                        >
                          {product.title}
                        </Link>
                        <span className="text-[10px] font-mono text-[#78716C] block">
                          {formatCurrency(product.price)} base price
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-6">
                    <span className="text-[11px] text-[#78716C] capitalize font-medium">
                      {product.category || 'General'}
                    </span>
                  </td>

                  <td className="py-3.5 px-6 text-right font-mono font-medium text-[#1C1917] tabular-nums">
                    {product.unitsSold || 18} units
                  </td>

                  <td className="py-3.5 px-6 text-right font-mono font-semibold text-[#1C1917] tabular-nums">
                    {formatCurrency(product.revenue || (product.price * (product.unitsSold || 18)))}
                  </td>

                  <td className="py-3.5 px-6 text-right">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#991B1B]">
                        <AlertCircle className="w-3 h-3 stroke-[1.5]" />
                        Out of Stock
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#B45309]">
                        <AlertCircle className="w-3 h-3 stroke-[1.5]" />
                        Low ({stock} left)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#166534]">
                        <CheckCircle2 className="w-3 h-3 stroke-[1.5]" />
                        {stock} in stock
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-6 text-right">
                    <Link
                      href={`/products/${product.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1C1917] hover:underline"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3 stroke-[1.5]" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-[#FAFAF9] border-t border-[#E7E5E4] flex items-center justify-between text-xs">
        <span className="text-[#78716C]">
          Showing top {Math.min(sortedProducts.length, 8)} of {sortedProducts.length} items
        </span>
        <Link
          href="/admin/products"
          className="font-medium text-[#1C1917] hover:underline flex items-center gap-1 uppercase tracking-wider text-[11px]"
        >
          Manage Full Inventory →
        </Link>
      </div>
    </div>
  );
}
