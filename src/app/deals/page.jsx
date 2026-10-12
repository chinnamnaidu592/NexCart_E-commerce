'use client';

import React, { useState, useMemo } from 'react';
import Link from '@/components/common/Link';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ProductCard from '@/components/products/ProductCard';
import ProductCardSkeleton from '@/components/products/ProductCardSkeleton';
import Pagination from '@/components/products/Pagination';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { useProducts } from '@/hooks/useProducts';
import { ArrowRight, Tag, Sparkles, RotateCcw } from 'lucide-react';

const DEAL_BANNERS = [
  {
    id: 'deal-25',
    discount: '25% Discount',
    threshold: 25,
    tag: 'STUDIO & HARDWARE',
    code: 'SAVE25',
    headline: 'Curated 25% Courtesy',
    subtext: 'Acoustic audio, precision desk hardware, and everyday essentials.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80',
    fallbackImage: '/src/assets/images/hero_scandinavian_craft_1791282659132.jpg',
  },
  {
    id: 'deal-50',
    discount: '50% Discount',
    threshold: 50,
    tag: 'SARTORIAL EDIT',
    code: 'ARCHIVE50',
    headline: 'Half-Price Archival Edit',
    subtext: 'Scottish cashmere garments, Swiss timepieces, and luxury tailoring.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1000&auto=format&fit=crop&q=80',
    fallbackImage: '/src/assets/images/category_craft_objects_1791282688777.jpg',
  },
  {
    id: 'deal-75',
    discount: '75% Discount',
    threshold: 75,
    tag: 'FINAL ARCHIVE VAULT',
    code: 'FINAL75',
    headline: '75% Vault Clearance',
    subtext: 'Rare archival releases, design stoneware, and final allocations.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80',
    fallbackImage: '/src/assets/images/hero_scandinavian_craft_1791282659132.jpg',
  },
];

export default function DealsPage() {
  const { products, loading, error, refetch } = useProducts();
  const [selectedDiscountTier, setSelectedDiscountTier] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  // Filter deals
  const filteredDeals = useMemo(() => {
    if (!products || !products.length) return [];

    // All products with any discount
    let list = products.filter((p) => (p.discountPercentage || 0) > 0);

    // If user clicked one of the 3 discount banners:
    if (selectedDiscountTier === 25) {
      list = list.filter((p) => (p.discountPercentage || 0) >= 15);
    } else if (selectedDiscountTier === 50) {
      list = list.filter((p) => (p.discountPercentage || 0) >= 10);
    } else if (selectedDiscountTier === 75) {
      // Highest discounted items
      list = [...list].sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0)).slice(0, 12);
    }

    // Default sort by discount desc
    list.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));

    return list;
  }, [products, selectedDiscountTier]);

  // Pagination calculation
  const totalItems = filteredDeals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedDeals = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDeals.slice(start, start + itemsPerPage);
  }, [filteredDeals, currentPage, itemsPerPage]);

  const handleSelectTier = (tier) => {
    if (selectedDiscountTier === tier) {
      setSelectedDiscountTier(null);
    } else {
      setSelectedDiscountTier(tier);
    }
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <ErrorState
          title="Could not load curated deals"
          message={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-16">
      {/* Top Breadcrumb row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <Breadcrumbs
          items={[
            { label: 'Storefront', href: '/products' },
            { label: 'Top Deals' },
          ]}
        />
      </div>

      {/* Top Deals Visual Banner: Row of 3 Vertical Images side-by-side */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 w-full">
          {DEAL_BANNERS.map((banner) => {
            const isSelected = selectedDiscountTier === banner.threshold;

            return (
              <div
                key={banner.id}
                onClick={() => handleSelectTier(banner.threshold)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectTier(banner.threshold);
                  }
                }}
                className={`group relative h-[360px] sm:h-[400px] lg:h-[440px] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer select-none border transition-all duration-300 shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'ring-2 ring-[#1C1917] border-[#1C1917]'
                    : 'border-[#E7E5E4] hover:border-[#A8A29E]'
                }`}
              >
                {/* Background Image */}
                <img
                  src={banner.image}
                  alt={banner.discount}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = banner.fallbackImage;
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark Gradient Overlay for optimal contrast */}
                <div className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />

                {/* Content Overlay */}
                <div className="relative z-10 h-full p-6 sm:p-7 flex flex-col justify-between text-white">
                  {/* Top Badge: Highlighted Discount Badge */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[11px] font-mono uppercase tracking-wider font-semibold text-white">
                      <Tag className="w-3 h-3 text-white" />
                      {banner.tag}
                    </span>
                    <span className="text-[11px] font-mono tracking-widest text-white/70 uppercase">
                      Voucher: {banner.code}
                    </span>
                  </div>

                  {/* Bottom Text Area: Discount Highlight */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase font-mono tracking-[0.2em] text-[#E7E5E4] font-medium">
                        Limited Time Special
                      </p>
                      <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white leading-none drop-shadow-sm">
                        {banner.discount}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-[#D6D3D1] font-light leading-relaxed line-clamp-2">
                      {banner.subtext}
                    </p>

                    <div className="pt-1 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xs border border-white/40 transition-colors">
                        <span>{isSelected ? 'Filtering Active' : `Shop ${banner.discount}`}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Tier Status bar with easy Reset */}
        {selectedDiscountTier && (
          <div className="mt-4 flex items-center justify-between px-2 text-xs text-[#78716C] bg-white border border-[#E7E5E4] py-2 px-4 rounded-xs">
            <span>
              Showing curated items for <strong className="font-semibold text-[#1C1917]">{selectedDiscountTier}% Discount Tier</strong> ({totalItems} items)
            </span>
            <button
              type="button"
              onClick={() => setSelectedDiscountTier(null)}
              className="text-[#B91C1C] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset & View All Deals
            </button>
          </div>
        )}
      </section>

      {/* Product Grid directly begins below Top Deals Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : paginatedDeals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6">
            {paginatedDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-12">
            <EmptyState
              title="No discounted editions match your criteria"
              description="Click on any of the three Top Deals banners above or view all active promotions."
              actionLabel="View All Deals"
              onAction={() => setSelectedDiscountTier(null)}
            />
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 380, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
