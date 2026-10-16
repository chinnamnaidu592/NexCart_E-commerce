'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from '@/components/common/Link';
import ConfirmModal from '@/components/common/ConfirmModal';
import Pagination from '@/components/products/Pagination';
import Badge from '@/components/common/Badge';
import { ROUTES } from '@/constants/routes';
import { formatCurrency } from '@/utils/formatters';
import { Edit2, Plus, Search, Trash2 } from 'lucide-react';

const PAGE_SIZE = 10;

const getStockStatus = (stock) => {
  const count = Number(stock) || 0;
  if (count <= 0) return { label: 'Out of stock', variant: 'danger' };
  if (count <= 10) return { label: 'Low stock', variant: 'warning' };
  return { label: 'In stock', variant: 'success' };
};

export default function MerchantProductsTable({ products = [], onDeleteProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      [product.title, product.category, product.brand]
        .some((value) => String(value || '').toLowerCase().includes(query))
    );
  }, [products, searchTerm]);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const displayedPage = Math.min(currentPage, totalPages);
  const pageProducts = filteredProducts.slice((displayedPage - 1) * PAGE_SIZE, displayedPage * PAGE_SIZE);

  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const deleted = await onDeleteProduct(productToDelete.id);
      if (deleted !== false) setProductToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="overflow-hidden border border-[#E7E5E4] bg-white">
      <div className="flex flex-col items-stretch justify-between gap-4 border-b border-[#F5F5F4] p-5 sm:flex-row sm:items-center">
        <label className="relative block w-full max-w-sm">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by product, category, or brand"
            className="w-full border border-[#E7E5E4] bg-[#F5F5F4] py-2 pl-9 pr-3 text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:border-[#1C1917] focus:outline-none"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#78716C]" />
        </label>
        <Link
          href={ROUTES.MERCHANT_PRODUCTS_NEW}
          className="inline-flex items-center justify-center gap-2 bg-[#1C1917] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#292524]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Product
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E7E5E4] bg-[#F5F5F4] text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
              <th scope="col" className="px-5 py-3">Product</th>
              <th scope="col" className="px-5 py-3">Category</th>
              <th scope="col" className="px-5 py-3">Price</th>
              <th scope="col" className="px-5 py-3">Stock status</th>
              <th scope="col" className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F4]">
            {pageProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-[#78716C]">
                  {products.length ? 'No products match your search.' : 'You have not added any products yet.'}
                </td>
              </tr>
            ) : pageProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <tr key={product.id} className="hover:bg-[#FAFAF9]">
                  <td className="px-5 py-4">
                    <div className="flex min-w-56 items-center gap-3">
                      <Image
                        src={product.thumbnail || '/images/category_craft_objects_1791282688777.jpg'}
                        alt=""
                        width={44}
                        height={44}
                        unoptimized
                        referrerPolicy="no-referrer"
                        className="h-11 w-11 border border-[#E7E5E4] bg-[#F5F5F4] object-contain p-1"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#1C1917]">{product.title}</p>
                        <p className="mt-1 font-mono text-[10px] text-[#A8A29E]">ID #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 capitalize text-[#57534E]">{product.category || '—'}</td>
                  <td className="whitespace-nowrap px-5 py-4 font-mono tabular-nums text-[#1C1917]">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <Badge variant={stockStatus.variant} size="sm">{stockStatus.label}</Badge>
                    <span className="ml-2 text-[#57534E]">{Number(product.stock) || 0}</span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={ROUTES.MERCHANT_PRODUCTS_EDIT(product.id)}
                        aria-label={`Edit ${product.title}`}
                        className="p-1.5 text-[#78716C] transition-colors hover:text-[#1C1917]"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setProductToDelete(product)}
                        aria-label={`Delete ${product.title}`}
                        className="cursor-pointer p-1.5 text-[#78716C] transition-colors hover:text-[#991B1B]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t border-[#F5F5F4] px-4">
        <Pagination
          currentPage={displayedPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          scrollToTop={false}
        />
      </div>
      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Delete "${productToDelete?.title}" from your store? This product will no longer appear in the storefront.`}
        confirmText="Delete Product"
        isDestructive
        isLoading={isDeleting}
      />
    </section>
  );
}
