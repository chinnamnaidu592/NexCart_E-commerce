import React from 'react';
import Link from '@/components/common/Link';
import { DEPARTMENTS } from '@/constants/departments';
import { ArrowRight } from 'lucide-react';

const CATEGORY_PHOTOS = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&crop=entropy&w=900&h=700&q=85',
  fashion: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&crop=entropy&w=900&h=700&q=85',
  'home-living': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&crop=entropy&w=900&h=700&q=85',
  'beauty-wellness': 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&crop=entropy&w=900&h=700&q=85',
  groceries: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&crop=entropy&w=900&h=700&q=85',
  'sports-automotive': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&crop=entropy&w=900&h=700&q=85',
};

export default function CategoryGrid() {
  return (
    <section className="py-8 sm:py-10 bg-[#FAFAF9] border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-6 gap-3 pb-3 border-b border-[#E7E5E4]">
          <div>
            <span className="text-[10px] font-mono font-medium text-[#78716C] uppercase tracking-[0.2em] block mb-0.5">
              Curated Divisions
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1917] tracking-tight">
              Explore Departments
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#1C1917] hover:text-[#78716C] transition-colors shrink-0"
          >
            <span>Complete Catalog Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Curved Department Cards with smooth rounded corners & overflow:hidden */}
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex w-max gap-3 pb-2 sm:grid sm:w-auto sm:grid-cols-2 sm:gap-5 sm:pb-0 lg:grid-cols-3 lg:gap-6">
            {DEPARTMENTS.map((dept) => {
              return (
                <Link
                  key={dept.id}
                  href={`/department/${dept.slug}`}
                  className="@container group relative flex h-40 w-36 flex-none cursor-pointer flex-col justify-end overflow-hidden rounded-xl border border-[#E7E5E4] bg-stone-100 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1C1917] hover:shadow-lg sm:h-56 sm:w-auto sm:flex-auto sm:rounded-2xl"
                >
                <img
                  src={CATEGORY_PHOTOS[dept.id]}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full rounded-xl object-cover transition-transform duration-700 ease-out group-hover:scale-105 sm:rounded-2xl"
                />

                {/* 2. Bottom gradient keeps the card copy legible over the image. */}
                <div className="absolute inset-x-0 bottom-0 h-[65%] rounded-b-2xl bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* 3. Card-relative content stays contained at each grid size. */}
                <div className="relative z-10 flex h-full w-full flex-col justify-end overflow-hidden rounded-xl p-3 sm:rounded-2xl sm:p-5 lg:p-6">
                  <h3 className="mb-1 text-sm font-sans font-medium leading-snug tracking-tight text-white line-clamp-2 sm:mb-1.5 sm:text-lg md:text-xl">
                    {dept.shortName || dept.name}
                  </h3>

                  <p className="mb-1.5 line-clamp-2 max-w-[90%] text-[10px] font-normal leading-snug text-gray-200 sm:mb-2.5 sm:text-xs sm:leading-relaxed">
                    {dept.description}
                  </p>

                  <div className="mt-1 h-px w-full bg-white/20 transition-colors duration-300 group-hover:bg-white/50" />
                </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
