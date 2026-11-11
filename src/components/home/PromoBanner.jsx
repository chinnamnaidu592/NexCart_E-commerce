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

            <div className="flex flex-row items-stretch gap-4 pt-2 sm:items-center">
              <Link href={PROMO_BANNER_CONTENT.ctaHref} className="min-w-0 flex-1 sm:flex-none">
                <Button
                  variant="ghost"
                  size="md"
                  className="w-full min-w-0 !rounded-full !border-white/15 !bg-white/10 px-2.5 text-[9px] font-semibold uppercase leading-tight tracking-[0.12em] !text-white backdrop-blur-sm shadow-sm transition-colors hover:!bg-white/20 sm:w-auto sm:px-6 sm:text-xs"
                >
                  <span className="min-w-0 text-center">{PROMO_BANNER_CONTENT.ctaText}</span>
                </Button>
              </Link>

              <div className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-white/15 bg-white/10 px-2.5 py-2.5 text-center text-[9px] font-semibold uppercase leading-tight tracking-[0.12em] text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:flex-none sm:px-6 sm:text-xs">
                CODE: {PROMO_BANNER_CONTENT.promoCode}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
