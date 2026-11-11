import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from '@/components/common/Link';
import Button from '@/components/common/Button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const BRAND_DEALS = [
  {
    id: 'sartorial-wardrobe',
    brand: 'THE SARTORIAL EDIT · TIMEPIECES & APPAREL',
    tag: 'AUTUMN ALLOCATION · DEAL 02',
    headline: 'Tailored Cashmere & Swiss Horology.',
    subheadline: 'Hand-tailored outerwear, Scottish cashmere knitwear, and mechanical chronometers with certified provenance documentation and lifetime care guarantee.',
    primaryCta: { label: 'Discover Sartorial Edit', href: '/department/fashion-apparel' },
    secondaryCta: { label: 'Best Sellers', href: '/bestsellers' },
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1920&auto=format&fit=crop&q=85',
    fallbackImage: '/images/category_craft_objects_1791282688777.jpg',
    alt: 'Luxury bespoke tailored garments and horology timepieces',
  },
  {
    id: 'acoustic-audio',
    brand: 'BANG & OLUFSEN · ARCHIVAL HARDWARE',
    tag: 'PRIVATE PRIVILEGE · DEAL 01',
    headline: 'Objects of Permanent Character & Quiet Utility.',
    subheadline: 'Studio-grade acoustics, reference turntables, and precision walnut audio components. Complimentary bespoke courier packaging and 25% courtesy allocation.',
    primaryCta: { label: 'Explore Audio Archive', href: '/department/electronics' },
    secondaryCta: { label: 'Curated Deals', href: '/deals' },
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1920&auto=format&fit=crop&q=85',
    fallbackImage: '/images/hero_scandinavian_craft_1791282659132.jpg',
    alt: 'High-end acoustic audio hardware and turntable craftsmanship',
  },
  {
    id: 'scandinavian-living',
    brand: 'NORDIC ATELIER · SPATIAL LIVING',
    tag: 'INTERIOR CRAFT · DEAL 03',
    headline: 'Sculptural Forms for Considered Living.',
    subheadline: 'Architectural white oak seating, brushed brass lighting, and textural stoneware ceramics. Complimentary white-glove delivery on all furniture orders.',

    primaryCta: { label: 'Explore Home & Living', href: '/department/home-living' },
    secondaryCta: { label: 'View All Products', href: '/products' },
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&auto=format&fit=crop&q=85',
    fallbackImage: '/images/hero_scandinavian_craft_1791282659132.jpg',
    alt: 'Minimalist Scandinavian architectural living room and interior design',
  },
  {
    id: 'botanical-apothecary',
    brand: 'HERBARIUM BUREAU · PURE EXTRACTS',
    tag: 'BOTANICAL LAB · DEAL 04',
    headline: 'Cold-Pressed Formulations & Rare Essences.',
    subheadline: 'Organic restorative serums and numbered artisanal fragrances formulated from wild-harvested botanicals. Complimentary full-size elixir with orders over ₹2,499.',

    primaryCta: { label: 'Explore Apothecary', href: '/department/beauty-wellness' },
    secondaryCta: { label: 'Member Privileges', href: '/deals' },
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1920&auto=format&fit=crop&q=85',
    fallbackImage: '/images/category_craft_objects_1791282688777.jpg',
    alt: 'Botanical glass dropper bottles, amber essences and skincare formulations',
  },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BRAND_DEALS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + BRAND_DEALS.length) % BRAND_DEALS.length);
  }, []);

  // Auto-sliding interval: slides every 5.5s unless hovered
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  const currentDeal = BRAND_DEALS[currentIndex];

  return (
    <section
      className="w-full bg-[#FAFAF9] py-4 select-none sm:py-6 lg:py-8"
      aria-label="Featured brand deals carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative w-full overflow-hidden rounded-2xl border border-[#E7E5E4] bg-[#1C1917] shadow-xl sm:rounded-3xl">
          {/* Horizontal Sliding Carousel Track */}
          <div className="relative h-[500px] w-full overflow-hidden sm:h-[540px] lg:h-[580px]">
            <div
              className="flex h-full w-full transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {BRAND_DEALS.map((deal, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={deal.id}
                    className="relative w-full h-full shrink-0 flex-none overflow-hidden"
                    aria-hidden={!isActive}
                  >
                    {/* Slide Background Image */}
                    <img
                      src={deal.image}
                      alt={deal.alt}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = deal.fallbackImage;
                      }}
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-7000 ease-out ${isActive ? 'scale-105' : 'scale-100'
                        }`}
                    />

                    {/* Multi-Layer Contrast Scrim for Absolute Text Readability */}
                    <div className="absolute inset-0 bg-black/45" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/25" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

                    {/* Foreground Content: Overlayed Promotional Text directly on slider image */}
                    <div className="relative z-20 flex h-full w-full flex-col justify-center px-5 sm:px-10 lg:px-14">
                      <div className="max-w-4xl translate-y-2 space-y-3 text-left sm:translate-y-6 sm:space-y-6">
                        {/* Tag & Brand Eyebrow */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] uppercase text-[#E7E5E4] font-medium">
                            {deal.tag}
                          </span>
                          <span className="text-white/40 hidden sm:inline">·</span>
                          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.16em] uppercase text-[#A8A29E] hidden sm:inline">
                            {deal.brand}
                          </span>
                        </div>

                        {/* Display Headline */}
                        <h1 className="max-w-4xl text-balance font-sans text-3xl font-medium leading-[1.04] tracking-[-0.04em] text-white drop-shadow-sm sm:text-6xl sm:leading-[1.02] lg:text-7xl">
                          {deal.headline}
                        </h1>

                        {/* Subtext Description */}
                        <p className="max-w-2xl text-xs font-normal leading-5 text-[#E7E5E4] drop-shadow-xs sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
                          {deal.subheadline}
                        </p>

                        {/* High-Converting Action Buttons */}
                        <div className="flex flex-row items-stretch gap-4 pt-1.5 sm:items-center sm:pt-2">
                          <Link href={deal.primaryCta.href} className="min-w-0 flex-1 sm:flex-none">
                            <Button
                              variant="ghost"
                              size="md"
                              className="w-full min-w-0 !rounded-full !border-white/15 !bg-white/10 px-2.5 text-[9px] font-semibold uppercase leading-tight tracking-[0.12em] !text-white backdrop-blur-sm shadow-sm transition-colors hover:!bg-white/20 sm:w-auto sm:px-6 sm:text-xs"
                            >
                              <span className="min-w-0 text-center">{deal.primaryCta.label}</span>
                              <ArrowRight className="ml-1 h-3.5 w-3.5 shrink-0 sm:ml-2" />
                            </Button>
                          </Link>

                          <Link href={deal.secondaryCta.href} className="min-w-0 flex-1 sm:flex-none">
                            <Button
                              variant="ghost"
                              size="md"
                              className="w-full min-w-0 !rounded-full !border-white/15 !bg-white/10 px-2.5 text-[9px] font-semibold uppercase leading-tight tracking-[0.12em] !text-white backdrop-blur-sm transition-colors hover:!bg-white/20 sm:w-auto sm:px-6 sm:text-xs"
                            >
                              <span className="min-w-0 text-center">{deal.secondaryCta.label}</span>
                            </Button>
                          </Link>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carousel Navigation Arrows */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous promotional brand deal"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 rounded-full border border-white/20 bg-black/40 p-2.5 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next promotional brand deal"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 rounded-full border border-white/20 bg-black/40 p-2.5 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Bottom Slide Pagination & Indicators */}
            <div className="absolute bottom-5 left-0 right-0 z-30">
              <div className="flex w-full items-center justify-between px-6 sm:px-10 lg:px-14">
                {/* Numbered Progress Counter */}
                <div className="text-[11px] font-mono text-white/70 uppercase tracking-widest hidden sm:block">
                  <span className="text-white font-semibold">0{currentIndex + 1}</span>
                  <span className="mx-1 text-white/30">/</span>
                  <span>0{BRAND_DEALS.length}</span>
                </div>

                {/* Segmented Indicator Bars */}
                <div className="flex items-center gap-2 mx-auto sm:mx-0">
                  {BRAND_DEALS.map((deal, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={deal.id}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Jump to brand deal ${idx + 1}: ${deal.brand}`}
                        className="group py-2 cursor-pointer"
                      >
                        <span
                          className={`block h-1 rounded-full transition-all duration-300 ${isActive
                              ? 'w-10 sm:w-12 bg-white'
                              : 'w-4 sm:w-6 bg-white/30 group-hover:bg-white/60'
                            }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Auto-Slide Indicator hint */}
                <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider hidden sm:block">
                  {isPaused ? 'Paused on Hover' : 'Auto-Sliding'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
