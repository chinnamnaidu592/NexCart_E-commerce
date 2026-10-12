'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import ProductGallery from '@/components/products/ProductGallery';
import RelatedProducts from '@/components/products/RelatedProducts';
import RatingStars from '@/components/products/RatingStars';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import QuantityControl from '@/components/cart/QuantityControl';
import { useProduct } from '@/hooks/useProduct';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatCurrency } from '@/utils/formatters';
import { Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params?.id;
  const { product, relatedProducts, loading, error, isNotFound, refetch } = useProduct(productId);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  if (loading) return <Loader message="Fetching product specifications..." fullScreen={true} />;

  if (isNotFound) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="Product Not Found"
          description={`The product with ID #${productId} could not be located or may have been discontinued.`}
          actionText="Browse Available Products"
          actionHref="/products"
        />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <ErrorState title="Could not load product" message={error} onRetry={refetch} />
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const originalPrice = product.discountPercentage
    ? product.price / (1 - product.discountPercentage / 100)
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-12">
      <Breadcrumbs
        items={[
          { label: 'Storefront', href: '/products' },
          { label: product.category, href: `/products?category=${product.category}` },
          { label: product.title },
        ]}
      />

      {/* Two-Column Grid Alignment (Desktop Viewport Fit: Gallery left + Details/CTA right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-3">
        {/* Gallery */}
        <div className="w-full">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Details & Actions: Contiguous Purchase Module (Sticky on desktop to keep CTA above the fold) */}
        <div className="md:sticky md:top-20 space-y-4 text-left">
          <div className="space-y-1.5 pb-3.5 border-b border-[#E7E5E4]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-medium text-[#78716C] uppercase tracking-[0.16em]">
                {product.category}
              </span>
              {product.brand && (
                <>
                  <span className="text-[#D6D3D1] font-light">/</span>
                  <span className="text-[10px] font-mono font-medium text-[#1C1917] uppercase tracking-[0.14em]">
                    {product.brand}
                  </span>
                </>
              )}
            </div>

            <h1 className="font-sans text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight leading-snug">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 pt-0.5">
              <RatingStars rating={product.rating} reviewCount={product.reviews?.length || 18} size="sm" />
              <span className="text-[#D6D3D1]">·</span>
              <span className="text-xs font-mono uppercase tracking-wider text-[#78716C]">
                {product.stock > 0 ? `${product.stock} units available` : 'Archived / Restock pending'}
              </span>
            </div>
          </div>

          {/* Pricing Module - Clean & Compact without oversized padding */}
          <div className="bg-[#F5F5F4] border border-[#E7E5E4] rounded-xs px-3.5 py-2.5 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-xl sm:text-2xl font-normal text-[#1C1917] tabular-nums">
                {formatCurrency(product.price)}
              </span>
              {originalPrice && (
                <span className="text-xs text-[#A8A29E] line-through tabular-nums">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>

            {product.discountPercentage > 0 && (
              <span className="bg-[#1C1917] text-white text-[9.5px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-none">
                −{Math.round(product.discountPercentage)}% Off
              </span>
            )}
          </div>

          {/* Description & Specification Notes: standard body sizing text-sm, leading-relaxed */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] block font-semibold">
              Specifications & Material Notes
            </span>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed font-normal">
              {product.description}
            </p>
          </div>

          {/* Purchase Controls - Tightened vertical padding */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">
                Select Quantity:
              </span>
              <QuantityControl
                quantity={quantity}
                max={product.stock || 50}
                onIncrease={() => setQuantity((q) => Math.min(q + 1, product.stock || 99))}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                size="md"
                disabled={isOutOfStock}
                onClick={() => addToCart(product, quantity)}
                className="flex-1 py-2.5"
              >
                <ShoppingBag className="w-4 h-4 mr-2 stroke-[1.5]" />
                {isOutOfStock ? 'Archived / Out of Stock' : 'Add to Acquisition Bag'}
              </Button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label="Wishlist toggle"
                className={`p-2.5 rounded-xs border transition-colors cursor-pointer ${
                  isFavorited
                    ? 'border-[#991B1B] bg-white text-[#991B1B]'
                    : 'border-[#D6D3D1] text-[#78716C] hover:border-[#1C1917] hover:text-[#1C1917] bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 stroke-[1.5] ${isFavorited ? 'fill-[#991B1B]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Guarantees with Hairline Dividers */}
          <div className="grid grid-cols-3 gap-2.5 pt-3.5 border-t border-[#E7E5E4] text-center">
            <div className="space-y-0.5">
              <Truck className="w-3.5 h-3.5 mx-auto text-[#1C1917] stroke-[1.5]" />
              <p className="text-[9.5px] font-semibold uppercase tracking-wider text-[#1C1917]">Insured Courier</p>
              <p className="text-[9px] text-[#78716C]">Free on ₹999+</p>
            </div>
            <div className="space-y-0.5">
              <ShieldCheck className="w-3.5 h-3.5 mx-auto text-[#1C1917] stroke-[1.5]" />
              <p className="text-[9.5px] font-semibold uppercase tracking-wider text-[#1C1917]">Certified Origin</p>
              <p className="text-[9px] text-[#78716C]">Archival provenance</p>
            </div>
            <div className="space-y-0.5">
              <RotateCcw className="w-3.5 h-3.5 mx-auto text-[#1C1917] stroke-[1.5]" />
              <p className="text-[9.5px] font-semibold uppercase tracking-wider text-[#1C1917]">30-Day Return</p>
              <p className="text-[9px] text-[#78716C]">Seamless exchange</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
