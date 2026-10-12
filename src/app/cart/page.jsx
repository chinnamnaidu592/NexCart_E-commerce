'use client';

import React from 'react';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button from '@/components/common/Button';
import Link from '@/components/common/Link';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    promoCode,
    totalItemsCount,
    subtotal,
    promoDiscount,
    shippingFee,
    tax,
    total,
    isHydrated,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  if (!isHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-xs uppercase tracking-widest font-mono text-[#78716C] animate-pulse">
          Synchronizing acquisition basket...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Acquisition Basket' }]} />
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 text-left">
      <div className="flex items-center justify-between pb-3">
        <Breadcrumbs items={[{ label: 'Shopping Bag' }]} />
        <button
          type="button"
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#991B1B] hover:text-[#7F1D1D] px-2.5 py-1.5 hover:bg-[#FEF2F2] rounded-xs transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        {/* Cart Item List */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E7E5E4] p-6 sm:p-7 shadow-xs">
          <div className="divide-y divide-[#E7E5E4]">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={increaseQty}
                onDecrease={decreaseQty}
                onRemove={removeFromCart}
              />
            ))}
          </div>

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

        {/* Order Calculation Summary */}
        <div className="lg:col-span-4">
          <CartSummary
            subtotal={subtotal}
            promoDiscount={promoDiscount}
            shippingFee={shippingFee}
            tax={tax}
            total={total}
            promoCode={promoCode}
            onApplyPromo={applyPromoCode}
            onRemovePromo={removePromoCode}
            showCheckoutButton={true}
          />
        </div>
      </div>
    </div>
  );
}
