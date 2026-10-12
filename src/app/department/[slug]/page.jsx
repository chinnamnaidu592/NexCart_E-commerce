'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from '@/components/common/Link';
import ProductCard from '@/components/products/ProductCard';
import ProductCardSkeleton from '@/components/products/ProductCardSkeleton';
import SortDropdown from '@/components/products/SortDropdown';
import Pagination from '@/components/products/Pagination';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { useProducts } from '@/hooks/useProducts';
import { useSearchParams } from '@/router/RouterContext';
import { DEPARTMENTS, getDepartmentBySlug } from '@/constants/departments';
import {
  SlidersHorizontal,
  X,
  Check,
  Star,
  RefreshCw,
} from 'lucide-react';

export default function DepartmentPage({ slugOverride }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const { products, loading, error, refetch } = useProducts();

  // Resolve department from slug or search query
  const slug =
    slugOverride ||
    params?.slug ||
    searchParams.get('dept') ||
    searchParams.get('category') ||
    'electronics';
  const department = useMemo(() => {
    return getDepartmentBySlug(slug) || DEPARTMENTS[0];
  }, [slug]);

  // Query / Filter state
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    () => searchParams.get('sub') || 'all'
  );
  const [sortBy, setSortBy] = useState('featured');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const itemsPerPage = 16;

  // If URL changes slug, reset sub-category and pagination
  useEffect(() => {
    const urlSub = searchParams.get('sub');
    setSelectedSubCategory(urlSub || 'all');
    setCurrentPage(1);
  }, [slug, searchParams]);

  // Helper to match product to this department (exact normalized slug comparison)
  const matchesSubcategory = (productCat, subSlug) => {
    if (!productCat || !subSlug) return false;
    const p = productCat.toLowerCase().trim().replace(/[\s_]+/g, '-');
    const s = subSlug.toLowerCase().trim().replace(/[\s_]+/g, '-');
    return p === s;
  };

  // All products belonging to this entire department
  const departmentProducts = useMemo(() => {
    if (!products || !products.length) return [];
    return products.filter((product) => {
      const pCat = product.category || '';
      return department.subCategories.some((sub) =>
        matchesSubcategory(pCat, sub.slug)
      );
    });
  }, [products, department]);

  // Filter products by selected subcategory, price, rating
  const filteredProducts = useMemo(() => {
    let result = [...departmentProducts];

    // Filter by specific subcategory
    if (selectedSubCategory !== 'all') {
      result = result.filter((p) =>
        matchesSubcategory(p.category, selectedSubCategory)
      );
    }

    // Filter by price
    if (minPrice !== '' && !isNaN(minPrice)) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice !== '' && !isNaN(maxPrice)) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    // Filter by rating
    if (minRating > 0) {
      result = result.filter((p) => (p.rating || 0) >= minRating);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-high':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discount-high':
        result.sort(
          (a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0)
        );
        break;
      case 'title-asc':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'featured':
      default:
        // maintain default curated order
        break;
    }

    return result;
  }, [
    departmentProducts,
    selectedSubCategory,
    minPrice,
    maxPrice,
    minRating,
    sortBy,
  ]);

  // Paginated slice
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const hasActiveFilters =
    selectedSubCategory !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    minRating > 0;

  const handleResetFilters = () => {
    setSelectedSubCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setCurrentPage(1);
  };

  const handleSelectSubCategory = (subSlug) => {
    setSelectedSubCategory(subSlug);
    setCurrentPage(1);
    setMobileSidebarOpen(false);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ErrorState
          title="Could not load department products"
          message={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
        <Breadcrumbs
          items={[
            { label: 'Storefront', href: '/products' },
            { label: department.name },
          ]}
        />

        <div className="flex items-center justify-between gap-3 border-b border-[#E7E5E4] pb-3 pt-1">
          <h1 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#78716C]">
            {department.name}
          </h1>
          <div className="flex items-center gap-2.5">
            <SortDropdown
              value={sortBy}
              onChange={(val) => {
                setSortBy(val);
                setCurrentPage(1);
              }}
            />
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xs border border-[#E7E5E4] bg-white text-[#1C1917] hover:bg-[#F5F5F4] cursor-pointer shrink-0"
              aria-label="Filter sub-categories"
            >
              <SlidersHorizontal className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Main Department Layout: Sidebar Session + Products Grid */}
        <div className="flex flex-col lg:flex-row gap-6 pt-6 items-start">
          {/* ========================================================= */}
          {/* DESKTOP SIDEBAR SESSION: Specific Sub-Categories & Refinement */}
          {/* ========================================================= */}
          <aside className="hidden lg:block w-60 xl:w-64 shrink-0">
            <div className="sticky top-28 bg-white border border-[#E7E5E4] p-5 rounded-xs space-y-6 shadow-xs">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1C1917]">
                  Sub-Categories
                </h2>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-[11px] text-[#78716C] hover:text-[#1C1917] underline cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    Reset
                  </button>
                )}
              </div>

              {/* Sub-Category Navigation List */}
              <div className="space-y-0.5 max-h-60 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => handleSelectSubCategory('all')}
                  className={`w-full flex items-center px-2.5 py-1.5 text-xs transition-colors cursor-pointer text-left rounded-none ${
                    selectedSubCategory === 'all'
                      ? 'bg-[#1C1917] text-white font-medium'
                      : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F4]'
                  }`}
                >
                  <span className="truncate">All {department.shortName} (Combined)</span>
                </button>

                {department.subCategories.map((sub) => {
                  const isSelected = selectedSubCategory === sub.slug;

                  return (
                    <button
                      key={sub.slug}
                      type="button"
                      onClick={() => handleSelectSubCategory(sub.slug)}
                      className={`w-full flex items-center px-2.5 py-1.5 text-xs transition-colors cursor-pointer text-left rounded-none ${
                        isSelected
                          ? 'bg-[#1C1917] text-white font-medium'
                          : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F4]'
                      }`}
                    >
                      <span className="truncate">{sub.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Price Range Filter */}
              <div className="pt-4 border-t border-[#F5F5F4]">
                <h3 className="text-[11px] uppercase tracking-wider font-semibold text-[#1C1917] mb-2.5">
                  Price Range ($)
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs bg-[#F5F5F4] border border-[#E7E5E4] rounded-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917]"
                  />
                  <span className="text-[#A8A29E] text-xs">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs bg-[#F5F5F4] border border-[#E7E5E4] rounded-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
              </div>

              {/* Customer Rating Filter */}
              <div className="pt-4 border-t border-[#F5F5F4]">
                <h3 className="text-[11px] uppercase tracking-wider font-semibold text-[#1C1917] mb-2.5">
                  Customer Rating
                </h3>
                <div className="space-y-1">
                  {[4.5, 4.0, 3.5].map((rating) => {
                    const isRatingActive = minRating === rating;
                    return (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => {
                          setMinRating(isRatingActive ? 0 : rating);
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-xs cursor-pointer transition-colors ${
                          isRatingActive
                            ? 'bg-[#F5F5F4] font-medium text-[#1C1917]'
                            : 'text-[#57534E] hover:bg-[#FAFAF9] hover:text-[#1C1917]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308]" />
                          <span>{rating} Stars & Up</span>
                        </div>
                        {isRatingActive && (
                          <Check className="w-3 h-3 text-[#1C1917]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Department Assurance Info */}
              <div className="p-3.5 rounded-xs border border-[#E7E5E4] bg-[#FAFAF9] text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] block font-semibold">
                  {department.shortName} Assurance
                </span>
                <p className="text-[11px] text-[#57534E] mt-1 leading-relaxed">
                  Every object is provenance-verified with certified authenticity.
                </p>
              </div>
            </div>
          </aside>

          {/* Main product area and sort controls */}
          <main className="flex-1 min-w-0">
            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                <span className="text-[10px] font-mono text-[#78716C] uppercase tracking-wider">
                  Active filters:
                </span>

                {selectedSubCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs border border-[#E7E5E4] bg-white text-[11px] text-[#1C1917]">
                    <span>
                      Sub: {(department.subCategories.find((s) => s.slug === selectedSubCategory)?.name || selectedSubCategory).toUpperCase()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSelectSubCategory('all')}
                      className="hover:text-red-600 cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}

                {(minPrice || maxPrice) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs border border-[#E7E5E4] bg-white text-[11px] text-[#1C1917]">
                    <span>${minPrice || '0'} – ${maxPrice || '∞'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setMinPrice('');
                        setMaxPrice('');
                      }}
                      className="hover:text-red-600 cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}

                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs border border-[#E7E5E4] bg-white text-[11px] text-[#1C1917]">
                    <span>{minRating}+ Stars</span>
                    <button
                      type="button"
                      onClick={() => setMinRating(0)}
                      className="hover:text-red-600 cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] text-[#78716C] hover:text-[#1C1917] underline ml-1 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products Grid or Empty State: Arranging four products for a row */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white p-8 rounded-xs border border-[#E7E5E4] text-center">
                <EmptyState
                  title="No items match your criteria"
                  description={`No objects found in ${department.name} with the active filters. Try resetting or selecting another sub-category.`}
                  actionLabel="Reset Department Filters"
                  onAction={handleResetFilters}
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE DRAWER: Sub-categories for small screens */}
      {/* ========================================================= */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto bg-white border-l border-[#E7E5E4]">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-sans text-lg text-[#1C1917]">
                  {department.shortName} Sub-Categories
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-[#78716C] hover:text-[#1C1917]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-0.5 max-h-60 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => handleSelectSubCategory('all')}
                  className={`w-full flex items-center px-2.5 py-1.5 text-left text-xs rounded-none ${
                    selectedSubCategory === 'all'
                      ? 'bg-[#1C1917] text-white font-medium'
                      : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F4]'
                  }`}
                >
                  <span>All {department.shortName} (Combined)</span>
                </button>

                {department.subCategories.map((sub) => (
                  <button
                    key={sub.slug}
                    type="button"
                    onClick={() => handleSelectSubCategory(sub.slug)}
                    className={`w-full flex items-center px-2.5 py-1.5 text-left text-xs rounded-none ${
                      selectedSubCategory === sub.slug
                        ? 'bg-[#1C1917] text-white font-medium'
                        : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F4]'
                    }`}
                  >
                    <span>{sub.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E7E5E4] space-y-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full py-2 text-xs uppercase tracking-wider font-semibold border border-[#E7E5E4] text-[#57534E] rounded-xs"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="w-full py-2 text-xs uppercase tracking-wider font-semibold bg-[#1C1917] text-white rounded-xs"
              >
                Apply & View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
