import React from 'react';
import Link from '@/components/common/Link';
import { ArrowRight } from 'lucide-react';

export default function EditorialSpotlight() {
  return (
    <section className="py-10 sm:py-12 bg-[#FAFAF9] border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Spotlight 1: Tech & Audio */}
          <div className="group relative rounded-xl sm:rounded-2xl overflow-hidden border border-[#E7E5E4] h-72 sm:h-88 flex flex-col justify-end p-6 sm:p-7 select-none bg-stone-900 shadow-xs hover:shadow-md transition-all duration-300">
            <img
              src="/src/assets/images/hero_scandinavian_craft_1791282659132.jpg"
              alt="Acoustic engineering and audio hardware"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.6] rounded-xl sm:rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent rounded-xl sm:rounded-2xl" />

            <div className="relative z-10 text-white space-y-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-white/80 block">
                CURATED SPOTLIGHT
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white leading-snug">
                Precision Audio & Electronics
              </h3>
              <p className="text-xs sm:text-sm text-white/85 max-w-md font-normal leading-relaxed">
                Studio-grade acoustics, high-performance computing, and connected desktop utility.
              </p>
              <div className="pt-1.5">
                <Link
                  href="/department/electronics"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white border-b border-white pb-0.5 hover:text-white/80 transition-colors"
                >
                  <span>Shop Electronics Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Spotlight 2: Wardrobe & Accessories */}
          <div className="group relative rounded-xl sm:rounded-2xl overflow-hidden border border-[#E7E5E4] h-72 sm:h-88 flex flex-col justify-end p-6 sm:p-7 select-none bg-stone-900 shadow-xs hover:shadow-md transition-all duration-300">
            <img
              src="/src/assets/images/category_craft_objects_1791282688777.jpg"
              alt="Sartorial tailoring and accessories"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.6] rounded-xl sm:rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent rounded-xl sm:rounded-2xl" />

            <div className="relative z-10 text-white space-y-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-white/80 block">
                SARTORIAL EDIT
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white leading-snug">
                Tailored Wardrobe & Timepieces
              </h3>
              <p className="text-xs sm:text-sm text-white/85 max-w-md font-normal leading-relaxed">
                Archival outerwear, artisanal footwear, and Swiss-grade timepieces with certified provenance.
              </p>
              <div className="pt-1.5">
                <Link
                  href="/department/fashion-apparel"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white border-b border-white pb-0.5 hover:text-white/80 transition-colors"
                >
                  <span>Shop Fashion & Apparel</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
