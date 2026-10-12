import React, { useState } from 'react';
import Link from '@/components/common/Link';
import Button from '@/components/common/Button';
import { formatCurrency } from '@/utils/formatters';
import { APP_CONFIG } from '@/constants/config';
import { ArrowRight, X, ShieldCheck } from 'lucide-react';

export default function CartSummary({
  subtotal,
  promoDiscount,
  shippingFee,
  tax,
  total,
  promoCode,
  onApplyPromo,
  onRemovePromo,
  showCheckoutButton = true,
}) {
  const [couponInput, setCouponInput] = useState('');

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const success = onApplyPromo(couponInput.trim());
      if (success) setCouponInput('');
    }
  };

  const freeShippingDifference = APP_CONFIG.freeShippingThreshold - subtotal;

  return (
    <div className="bg-white rounded-xl border border-[#E7E5E4] p-6 space-y-5 shadow-xs">
      <h3 className="text-lg font-semibold text-[#1C1917] pb-3 border-b border-[#F5F5F4]">
        Order Calculation
      </h3>

      {/* Free Shipping Progress Indicator */}
      {subtotal > 0 && freeShippingDifference > 0 && (
        <div className="bg-[#F5F5F4] border border-[#E7E5E4] rounded-sm p-3.5 text-xs text-[#57534E] space-y-2">
          <p className="font-normal">
            Add <span className="font-semibold text-[#1C1917] tabular-nums">{formatCurrency(freeShippingDifference)}</span> more for complimentary courier delivery.
          </p>
          <div className="w-full bg-[#E7E5E4] h-1 rounded-none overflow-hidden">
            <div
              className="bg-[#1C1917] h-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (subtotal / APP_CONFIG.freeShippingThreshold) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Financial Line Items */}
      <div className="space-y-3.5 text-xs">
        <div className="flex justify-between text-[#78716C]">
          <span>Subtotal</span>
          <span className="font-medium text-[#1C1917] tabular-nums">{formatCurrency(subtotal)}</span>
        </div>

        {promoDiscount > 0 && (
          <div className="flex justify-between text-[#166534] font-medium">
            <span>Privilege Discount ({promoCode})</span>
            <span className="tabular-nums">−{formatCurrency(promoDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between text-[#78716C]">
          <span>Courier Shipping</span>
          <span className="font-medium text-[#1C1917] tabular-nums">
            {shippingFee === 0 ? (
              <span className="text-[#166534] font-semibold uppercase tracking-wider text-[10px]">Complimentary</span>
            ) : (
              formatCurrency(shippingFee)
            )}
          </span>
        </div>

        <div className="flex justify-between text-[#78716C]">
          <span>Estimated Sales Tax ({APP_CONFIG.taxRate * 100}%)</span>
          <span className="font-medium text-[#1C1917] tabular-nums">{formatCurrency(tax)}</span>
        </div>

        <div className="pt-3.5 border-t border-[#E7E5E4] flex justify-between items-baseline">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1917]">Payable Total</span>
          <span className="font-sans text-2xl font-bold text-[#1C1917] tabular-nums">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Promo Code Form */}
      <div className="pt-2">
        {promoCode ? (
          <div className="flex items-center justify-between bg-[#F0FDF4] border border-[#DCFCE7] px-3.5 py-2.5 text-xs">
            <span className="text-[#166534] font-medium tracking-wide">
              Courtesy code <strong className="font-mono">{promoCode}</strong> applied
            </span>
            <button
              type="button"
              onClick={onRemovePromo}
              className="text-[#166534] hover:text-[#991B1B] p-0.5 cursor-pointer"
              aria-label="Remove coupon"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleCouponSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Promo code (e.g. SAVE10)"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="w-full text-xs border border-[#E7E5E4] bg-[#F5F5F4] rounded-sm px-3 py-2 uppercase placeholder:normal-case text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
            />
            <Button type="submit" variant="secondary" size="sm">
              Apply
            </Button>
          </form>
        )}
      </div>

      {/* Checkout CTA */}
      {showCheckoutButton && (
        <Link href="/checkout" className="block w-full">
          <Button variant="primary" size="lg" className="w-full group">
            Proceed to Checkout
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      )}

      {/* Trust guarantees */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-[#A8A29E] pt-2">
        <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
        <span>Certified 256-Bit Encrypted Transfer</span>
      </div>
    </div>
  );
}
