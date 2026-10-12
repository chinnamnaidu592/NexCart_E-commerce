import React from 'react';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';

export default function RelatedProducts({ products = [] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-[#E7E5E4]">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E7E5E4]">
        <div>
          <span className="text-[10px] font-mono font-medium text-[#78716C] uppercase tracking-[0.18em] block mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 stroke-[1.5]" /> Curated Selections
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight">
            You Might Also Like
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
