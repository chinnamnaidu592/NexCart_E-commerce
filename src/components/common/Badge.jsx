import React from 'react';

/**
 * Editorial Tag / Status component adhering to Zero-Pill discipline.
 * Uses quiet rectangular geometry, refined tracking, and muted tonal palettes.
 */
export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) {
  const variants = {
    neutral: 'bg-[#F5F5F4] text-[#57534E] border-[#E7E5E4]',
    primary: 'bg-[#1C1917] text-[#FAFAF9] border-[#1C1917]',
    success: 'bg-[#F0FDF4] text-[#166534] border-[#DCFCE7]',
    warning: 'bg-[#FFFBEB] text-[#92400E] border-[#FEF3C7]',
    danger: 'bg-[#FEF2F2] text-[#991B1B] border-[#FEE2E2]',
    sale: 'bg-[#78350F] text-[#FEF3C7] border-[#92400E] tracking-widest',
  };

  const dotColors = {
    neutral: 'bg-[#78716C]',
    primary: 'bg-[#FAFAF9]',
    success: 'bg-[#166534]',
    warning: 'bg-[#B45309]',
    danger: 'bg-[#DC2626]',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider uppercase font-semibold',
    md: 'text-[11px] px-2.5 py-0.5 tracking-wider uppercase font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border ${
        variants[variant] || variants.neutral
      } ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || 'bg-[#78716C]'}`} />}
      {children}
    </span>
  );
}
