import React from 'react';
import Link from '@/components/common/Link';
import RatingStars from './RatingStars';
import { formatCurrency } from '@/utils/formatters';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const originalPrice = product.discountPercentage
    ? product.price / (1 - product.discountPercentage / 100)
    : null;

  return (
    <div className="group relative bg-white rounded-xs border border-[#E7E5E4] hover:border-[#A8A29E] transition-all duration-300 flex flex-col justify-between h-full overflow-hidden shadow-2xs hover:shadow-xs">
      <div>
        {/* Product Image Frame */}
        <div className="relative aspect-square w-full bg-[#F5F5F4] overflow-hidden flex items-center justify-center p-3 sm:p-4 border-b border-[#F5F5F4]">
          <Link href={`/products/${product.id}`} className="w-full h-full flex items-center justify-center">
            <img
              src={product.thumbnail || product.images?.[0] || '/images/category_craft_objects_1791282688777.jpg'}
              alt={product.title || 'Product image'}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Understated Discount Indicator */}
          {product.discountPercentage > 5 && (
            <div className="absolute top-2 left-2 bg-[#1C1917] text-white text-[8.5px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-none shadow-2xs pointer-events-none">
              −{Math.round(product.discountPercentage)}%
            </div>
          )}

          {/* Wishlist Icon Button */}
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-label={isFavorited ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
            className={`absolute top-2 right-2 p-1.5 rounded-xs transition-colors cursor-pointer shadow-2xs ${
              isFavorited
                ? 'text-[#991B1B] bg-white'
                : 'text-[#A8A29E] hover:text-[#1C1917] bg-white/90 hover:bg-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 stroke-[1.5] ${isFavorited ? 'fill-[#991B1B]' : ''}`} />
          </button>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-[#FAFAF9]/90 flex items-center justify-center p-2 text-center pointer-events-none">
              <span className="text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 bg-[#1C1917] text-white">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Meta */}
        <div className="p-3 sm:p-3.5">
          <div className="flex items-center justify-between text-[9.5px] font-semibold text-[#78716C] uppercase tracking-[0.12em] mb-1 gap-2">
            <span className="truncate min-w-0 flex-1">{product.category || 'General'}</span>
            {product.brand && <span className="truncate shrink-0 max-w-[45%] text-[#A8A29E] font-normal">{product.brand}</span>}
          </div>

          <h3 className="font-normal text-[#1C1917] text-xs sm:text-[13px] hover:underline line-clamp-2 h-9 leading-snug">
            <Link href={`/products/${product.id}`}>{product.title}</Link>
          </h3>

          <div className="mt-1.5">
            <RatingStars rating={product.rating} reviewCount={product.reviews?.length} size="xs" />
          </div>
        </div>
      </div>

      {/* Pricing & Add Action aligned to bottom */}
      <div className="px-3 sm:px-3.5 pb-3 sm:pb-3.5 pt-2 border-t border-[#F5F5F4] flex items-center justify-between gap-1.5 mt-auto">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5 truncate">
            <span className="font-sans text-sm sm:text-base font-normal text-[#1C1917] tabular-nums">
              {formatCurrency(product.price)}
            </span>
            {originalPrice && (
              <span className="text-[10px] text-[#A8A29E] line-through tabular-nums">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
          <span className="text-[9.5px] font-medium text-[#78716C] block leading-tight truncate">
            {product.stock > 0 ? `${product.stock} in stock` : 'Restock pending'}
          </span>
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => addToCart(product, 1)}
          aria-label={`Add ${product.title} to cart`}
          className="p-1.5 sm:p-2 rounded-xs border border-[#D6D3D1] text-[#1C1917] hover:border-[#1C1917] hover:bg-[#1C1917] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          <ShoppingBag className="w-3.5 h-3.5 stroke-[1.5]" />
        </button>
      </div>
    </div>
  );
}
