'use client';

import React from 'react';
import Link from '@/components/common/Link';
import EmptyState from '@/components/common/EmptyState';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { useWishlist } from '@/context/WishlistContext';
import { formatCurrency } from '@/utils/formatters';
import { Heart, Trash2, ArrowLeft } from 'lucide-react';

export default function WishlistPage() {
  const { items, isHydrated, removeFromWishlist, moveToCart, clearWishlist } = useWishlist();

  if (!isHydrated) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">Loading wishlist...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Wishlist' }]} />
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save favorite items while you browse so you can easily purchase them whenever you are ready."
          actionText="Discover Products"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 text-left">
      {/* Top Utility Row matching Cart page */}
      <div className="flex items-center justify-between pb-3">
        <Breadcrumbs items={[{ label: 'Wishlist' }]} />
        <button
          type="button"
          onClick={clearWishlist}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#991B1B] hover:text-[#7F1D1D] px-2.5 py-1.5 hover:bg-[#FEF2F2] rounded-xs transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
          Clear All Items
        </button>
      </div>

      {/* Main Container Card matching Cart page */}
      <div className="bg-white rounded-xl border border-[#E7E5E4] p-6 sm:p-7 shadow-xs">
        <div className="divide-y divide-[#E7E5E4]">
          {items.map((item) => {
            // Calculate original price if item has a discount percentage
            const discount = item.discountPercentage || 0;
            const originalPrice =
              discount > 0 ? item.price / (1 - discount / 100) : null;

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 py-6"
              >
                {/* Product Image & Details */}
                <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                  {/* Exact same light gray rounded square background used on cart page */}
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-sm bg-[#F5F5F4] border border-[#E7E5E4] p-2.5 flex items-center justify-center shrink-0">
                    <Link
                      href={`/products/${item.id}`}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <img
                        src={
                          item.thumbnail ||
                          '/images/category_craft_objects_1791282688777.jpg'
                        }
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium text-[#1C1917] hover:underline truncate">
                      <Link href={`/products/${item.id}`}>{item.title}</Link>
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-xs text-[#78716C]">
                      <span className="tabular-nums">
                        Unit Price:{' '}
                        {originalPrice && (
                          <span className="line-through text-stone-400 mr-1.5 text-xs">
                            {formatCurrency(originalPrice)}
                          </span>
                        )}
                        <span className="text-[#1C1917] font-medium">
                          {formatCurrency(item.price)}
                        </span>
                      </span>
                      <span className="text-[#D6D3D1] hidden sm:inline">·</span>
                      <span className="text-stone-600 font-normal">In Stock</span>
                    </div>
                  </div>
                </div>

                {/* Controls: Price, Add to Cart Button, and Trash Icon on Far Right */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-8 shrink-0">
                  <div className="text-right min-w-[80px] hidden md:block">
                    <span className="font-sans text-lg font-normal text-[#1C1917] block tabular-nums">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  {/* Solid ADD TO CART button matching design system */}
                  <button
                    type="button"
                    onClick={() => moveToCart(item)}
                    className="inline-flex items-center justify-center bg-[#1C1917] hover:bg-[#292524] text-white text-[11px] sm:text-xs font-semibold py-2.5 px-5 tracking-wider uppercase rounded-xs transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
                  >
                    ADD TO CART
                  </button>

                  {/* Exact trash can icon from cart page positioned on far right */}
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(item.id, item.title)}
                    aria-label={`Remove ${item.title} from wishlist`}
                    className="p-2 text-[#A8A29E] hover:text-[#991B1B] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Return to Catalog matching Cart page */}
        <div className="pt-6 mt-6 border-t border-[#E7E5E4] flex items-center justify-between">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#1C1917] hover:text-[#78716C] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
            Return to Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
