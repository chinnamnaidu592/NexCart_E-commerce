import React from 'react';
import Link from '@/components/common/Link';
import { DEPARTMENTS } from '@/constants/departments';
import { ArrowRight } from 'lucide-react';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {DEPARTMENTS.map((dept) => {
            return (
              <Link
                key={dept.id}
                href={`/department/${dept.slug}`}
                className="@container group relative flex h-60 cursor-pointer flex-col justify-end overflow-hidden rounded-2xl border border-[#E7E5E4] bg-stone-100 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1C1917] hover:shadow-lg sm:h-68"
              >
                {/* 1. Background Department Image */}
                <img
                  src={dept.image}
                  alt={dept.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = dept.fallbackImage;
                  }}
                  className="absolute inset-0 w-full h-full object-cover rounded-xl sm:rounded-2xl transition-transform duration-700 group-hover:scale-105 filter brightness-[0.65] group-hover:brightness-[0.75]"
                />

                {/* 2. Bottom gradient keeps the card copy legible over the image. */}
                <div className="absolute inset-x-0 bottom-0 h-[65%] rounded-b-2xl bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* 3. Card-relative content stays contained at each grid size. */}
                <div className="relative z-10 flex h-full w-full flex-col justify-end overflow-hidden rounded-2xl p-5 md:p-6 lg:p-7">
                  <h3 className="mb-2 text-xl font-sans leading-snug tracking-tight text-white md:text-2xl">
                    {dept.shortName || dept.name}
                  </h3>

                  <p className="mb-3 line-clamp-2 max-w-[90%] text-xs font-normal leading-relaxed text-gray-300 md:text-sm">
                    {dept.description}
                  </p>

                  <div className="mt-1 h-px w-full bg-white/20 transition-colors duration-300 group-hover:bg-white/50" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
