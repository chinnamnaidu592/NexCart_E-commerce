import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Julian Vance',
    role: 'Verified Collector · London',
    rating: 5,
    title: 'Exemplary craftsmanship and prompt international courier dispatch.',
    content:
      'The turntable soundstage exceeded expectations. Arrived in museum-grade protective packaging within 48 hours. Transparent provenance is rare today.',
    product: 'Bang & Olufsen Beosound',
    date: 'Autumn 2026',
  },
  {
    id: 2,
    name: 'Elena Rostova',
    role: 'Verified Patron · Stockholm',
    rating: 5,
    title: 'Tailoring matches Savile Row standards with unmatched durability.',
    content:
      'The merino overcoat drape is sublime. Subtle stitching, breathable lining, and flawless fit. NexCart customer concierge was exceptionally responsive.',
    product: 'Minimalist Cashmere Overcoat',
    date: 'Autumn 2026',
  },
  {
    id: 3,
    name: 'Marcus Chen',
    role: 'Verified Collector · Tokyo',
    rating: 5,
    title: 'Flawless checkout protocol and certified authenticity documentation.',
    content:
      'From 256-bit order encryption to the physical provenance card enclosed in the parcel, the entire experience radiates premium quiet luxury.',
    product: 'Automatic Chronograph Series',
    date: 'Autumn 2026',
  },
];

export default function CustomerReviews() {
  return (
    <section className="py-10 sm:py-12 bg-white border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <span className="text-[10px] font-mono font-medium text-[#78716C] uppercase tracking-[0.2em] block mb-1">
            Collector Verification
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1917] tracking-tight">
            Patron Acclaim & Testimonials
          </h2>
          <p className="text-xs text-[#78716C] mt-1">
            Direct dispatches and verified satisfaction notes from our international patron community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAFAF9] p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-[#E7E5E4] flex flex-col justify-between hover:border-[#1C1917] transition-all duration-300 shadow-xs hover:shadow-md"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 mb-3 text-[#EAB308]">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-[#1C1917] leading-snug mb-2">
                  &ldquo;{rev.title}&rdquo;
                </h3>

                <p className="text-xs text-[#57534E] leading-relaxed font-normal">
                  {rev.content}
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-[#E7E5E4]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-[#1C1917]">
                      {rev.name}
                    </h4>
                    <span className="text-[11px] text-[#78716C]">
                      {rev.role}
                    </span>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                </div>
                <div className="mt-1.5 text-[10px] font-mono text-[#A8A29E] flex items-center justify-between">
                  <span>Acquired: {rev.product}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
