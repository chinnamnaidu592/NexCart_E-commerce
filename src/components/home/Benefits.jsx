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
      <div className="overflow-x-auto sm:overflow-visible">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex w-max flex-nowrap divide-x divide-[#E7E5E4] sm:grid sm:w-auto sm:grid-cols-2 sm:gap-6 sm:divide-y-0 lg:grid-cols-4 lg:gap-8">
            {BENEFITS_CONTENT.map((benefit, idx) => {
              const IconComponent = ICON_MAP[benefit.iconName] || ShieldCheck;
              return (
                <div
                  key={benefit.id}
                  className={`w-[260px] shrink-0 px-4 sm:w-auto sm:min-w-0 sm:px-0 ${idx !== 0 ? 'sm:pl-6 lg:pl-8' : ''}`}
                >
                  <div className="mb-2 flex items-center gap-2 text-[#1C1917]">
                    <IconComponent className="h-4 w-4 shrink-0 stroke-[1.5] text-[#78716C]" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider">
                      {benefit.title}
                    </h4>
                  </div>
                  <p className="text-xs font-light leading-relaxed text-[#78716C]">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
