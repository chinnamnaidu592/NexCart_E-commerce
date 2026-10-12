import React from 'react';
import { BENEFITS_CONTENT } from '@/constants/homeContent';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

const ICON_MAP = {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
};

export default function Benefits() {
  return (
    <section className="bg-[#FAFAF9] border-b border-[#E7E5E4] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#E7E5E4]">
          {BENEFITS_CONTENT.map((benefit, idx) => {
            const IconComponent = ICON_MAP[benefit.iconName] || ShieldCheck;
            return (
              <div
                key={benefit.id}
                className={`pt-4 sm:pt-0 ${idx !== 0 ? 'sm:pl-6 lg:pl-8' : ''}`}
              >
                <div className="flex items-center gap-2 mb-2 text-[#1C1917]">
                  <IconComponent className="w-4 h-4 stroke-[1.5] text-[#78716C]" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider">
                    {benefit.title}
                  </h4>
                </div>
                <p className="text-xs text-[#78716C] leading-relaxed font-light">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
