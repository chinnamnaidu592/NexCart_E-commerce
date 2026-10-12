import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component with accessible focus-visible rings,
 * modern styling, subtle micro-interactions, and loading spinner support.
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xs transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.99] tracking-wider uppercase text-xs';

  const variants = {
    primary:
      'bg-[#1C1917] text-white hover:bg-[#292524] border border-[#1C1917] shadow-2xs font-semibold',
    secondary:
      'bg-[#F5F5F4] text-[#1C1917] border border-[#E7E5E4] hover:bg-[#E7E5E4] hover:border-[#D6D3D1] font-semibold',
    outline:
      'border border-[#D6D3D1] bg-white text-[#1C1917] hover:bg-[#FAFAF9] hover:border-[#1C1917] font-semibold',
    ghost:
      'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F4] border border-transparent font-semibold',
    danger:
      'bg-[#991B1B] text-white border border-[#991B1B] hover:bg-[#7F1D1D] shadow-2xs font-semibold',
    success:
      'bg-[#166534] text-white border border-[#166534] hover:bg-[#14532D] shadow-2xs font-semibold',
  };

  const sizes = {
    sm: 'text-[11px] px-3 py-1.5 gap-1.5',
    md: 'text-xs px-5 py-2.5 gap-2',
    lg: 'text-xs sm:text-sm px-6 py-3 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
}
