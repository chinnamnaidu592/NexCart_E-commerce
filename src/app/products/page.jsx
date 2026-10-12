'use client';

import React, { useState, useEffect } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import SortDropdown from '@/components/products/SortDropdown';
import Pagination from '@/components/products/Pagination';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { useProducts } from '@/hooks/useProducts';
import { useFilters } from '@/hooks/useFilters';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchParams, useRouter } from '@/router/RouterContext';
import { SlidersHorizontal, X } from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, categories, loading, error, refetch } = useProducts();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync initial query params from URL
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const initialSort = searchParams.get('sort') || 'featured';
  const initialPage = Number(searchParams.get('page')) || 1;

  const filters = useFilters(products, {
    category: initialCategory,
    searchQuery: initialQuery,
    sortBy: initialSort,
    page: initialPage,
  });

  const debouncedSearch = useDebounce(filters.searchQuery, 400);

  // Synchronize URL with active filter state without page reloads
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.set('category', filters.category);
    if (debouncedSearch) params.set('q', debouncedSearch);
    if (filters.sortBy && filters.sortBy !== 'featured') params.set('sort', filters.sortBy);
    if (filters.currentPage > 1) params.set('page', String(filters.currentPage));

    const newQuery = params.toString();
    const newPath = newQuery ? `/products?${newQuery}` : '/products';
    router.replace(newPath);
  }, [filters.category, debouncedSearch, filters.sortBy, filters.currentPage, router]);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ErrorState title="Error Loading Products" message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
      <Breadcrumbs items={[{ label: 'Products Catalog' }]} />

      <div className="flex justify-end gap-2.5 border-b border-[#E7E5E4] pb-3 pt-1">
        <div className="flex items-center gap-2.5">
          <SortDropdown value={filters.sortBy} onChange={filters.setSortBy} />
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden p-2 rounded-xs border border-[#E7E5E4] bg-white text-[#1C1917] hover:bg-[#F5F5F4] cursor-pointer shrink-0"
            aria-label="Filter products"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* Main Layout: Filters sidebar + Product grid */}
      <div className="flex flex-col lg:flex-row gap-6 pt-6 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block w-60 xl:w-64 shrink-0">
          <div className="sticky top-28 bg-white p-5 rounded-xs border border-[#E7E5E4] shadow-xs">
            <ProductFilters
              categories={categories}
              selectedCategory={filters.category}
              onSelectCategory={filters.setCategory}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onChangeMinPrice={filters.setMinPrice}
              onChangeMaxPrice={filters.setMaxPrice}
              minRating={filters.minRating}
              onChangeMinRating={filters.setMinRating}
              onReset={filters.resetFilters}
              hasActiveFilters={filters.hasActiveFilters}
            />
          </div>
        </div>

        {/* Product Grid & States */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <ProductGrid isLoading={true} skeletonCount={8} />
          ) : filters.paginatedProducts.length === 0 ? (
            <EmptyState
              title="No objects matched"
              description="No pieces match your selected filter parameters or search terms. Reset filters to review full collection."
              actionText="Reset All Filters"
              onAction={filters.resetFilters}
            />
          ) : (
            <>
              <ProductGrid products={filters.paginatedProducts} isLoading={false} />
              <Pagination
                currentPage={filters.currentPage}
                totalPages={filters.totalPages}
                onPageChange={filters.setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

      {/* Mobile Slide-Over Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-[#1C1917]/50 backdrop-blur-xs" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white border-l border-[#E7E5E4] p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E5E4] mb-6">
              <h3 className="font-sans text-xl font-normal text-[#1C1917]">Refine Criteria</h3>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1.5 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>
            <ProductFilters
              categories={categories}
              selectedCategory={filters.category}
              onSelectCategory={(c) => {
                filters.setCategory(c);
                setMobileFiltersOpen(false);
              }}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onChangeMinPrice={filters.setMinPrice}
              onChangeMaxPrice={filters.setMaxPrice}
              minRating={filters.minRating}
              onChangeMinRating={filters.setMinRating}
              onReset={() => {
                filters.resetFilters();
                setMobileFiltersOpen(false);
              }}
              hasActiveFilters={filters.hasActiveFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
}
