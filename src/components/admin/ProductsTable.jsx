import React, { useState } from 'react';
import Link from '@/components/common/Link';
import ConfirmModal from '@/components/common/ConfirmModal';
import Pagination from '@/components/products/Pagination';
import { formatCurrency } from '@/utils/formatters';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';

export default function ProductsTable({
  products = [],
  onDeleteProduct,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = products.filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.title?.toLowerCase().includes(term) ||
      p.category?.toLowerCase().includes(term) ||
      p.brand?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden text-left shadow-xs">
      {/* Top Header bar with Search and Add Button */}
      <div className="p-6 border-b border-[#F5F5F4] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search by title, department, maker..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs bg-[#F5F5F4] border border-[#E7E5E4] rounded-sm pl-9 pr-4 py-2 text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917]"
          />
          <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.5]" />
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-[#1C1917] hover:bg-[#292524] text-white text-xs uppercase tracking-wider font-semibold transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
          Add Item
        </Link>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F5F5F4] text-[#78716C] uppercase tracking-[0.12em] font-semibold border-b border-[#E7E5E4]">
              <th scope="col" className="py-3 px-6">Product Item</th>
              <th scope="col" className="py-3 px-6">Department</th>
              <th scope="col" className="py-3 px-6">Price</th>
              <th scope="col" className="py-3 px-6">Inventory</th>
              <th scope="col" className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F4]">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-14 text-center text-[#78716C]">
                  No items matched your query criteria.
                </td>
              </tr>
            ) : (
              paginated.map((product) => (
                <tr key={product.id} className="hover:bg-[#FAFAF9] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.thumbnail || '/images/category_craft_objects_1791282688777.jpg'}
                        alt={product.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xs object-contain bg-[#F5F5F4] border border-[#E7E5E4] p-1 mix-blend-multiply"
                      />
                      <div className="min-w-0 max-w-xs">
                        <p className="font-medium text-[#1C1917] truncate">{product.title}</p>
                        <p className="text-[10px] font-mono text-[#A8A29E]">ID #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#57534E] capitalize">
                    {product.category}
                  </td>
                  <td className="py-4 px-6 font-mono font-medium text-[#1C1917] tabular-nums">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-none border ${
                        product.stock > 10
                          ? 'bg-[#F0FDF4] text-[#166534] border-[#DCFCE7]'
                          : product.stock > 0
                          ? 'bg-[#FFFBEB] text-[#92400E] border-[#FEF3C7]'
                          : 'bg-[#FEF2F2] text-[#991B1B] border-[#FEE2E2]'
                      }`}
                    >
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors"
                        aria-label={`Edit ${product.title}`}
                      >
                        <Edit2 className="w-3.5 h-3.5 stroke-[1.5]" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setProductToDelete(product)}
                        className="p-1.5 text-[#78716C] hover:text-[#991B1B] transition-colors cursor-pointer"
                        aria-label={`Delete ${product.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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

      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Catalog Item"
        message={`Are you certain you wish to delist "${productToDelete?.title}"? This item will be removed from storefront displays.`}
        confirmText="Confirm Delist"
        isDestructive={true}
      />
    </div>
  );
}
