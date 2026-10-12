import React from 'react';
import Link from '@/components/common/Link';
import Button from '@/components/common/Button';
import { PROMO_BANNER_CONTENT } from '@/constants/homeContent';

export default function PromoBanner() {
  return (
    <section className="py-10 sm:py-12 bg-[#FAFAF9] border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#1C1917] text-[#FAFAF9] p-6 sm:p-10 border border-[#292524] shadow-sm">
          <div className="max-w-2xl space-y-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-px bg-[#A8A29E]" />
              <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-[#A8A29E]">
                {PROMO_BANNER_CONTENT.tag}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
              {PROMO_BANNER_CONTENT.headline}
            </h3>

            <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed max-w-xl font-normal">
              {PROMO_BANNER_CONTENT.subheadline}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link href={PROMO_BANNER_CONTENT.ctaHref}>
                <Button
                  variant="secondary"
                  size="md"
                  className="bg-[#FAFAF9] text-[#1C1917] hover:bg-[#E7E5E4] border-0"
                >
                  {PROMO_BANNER_CONTENT.ctaText}
                </Button>
              </Link>

              <div className="inline-flex items-center justify-center px-3.5 py-2 rounded-xs border border-[#44403C] bg-[#292524] text-xs font-mono font-medium tracking-widest text-[#E7E5E4]">
                CODE: {PROMO_BANNER_CONTENT.promoCode}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
