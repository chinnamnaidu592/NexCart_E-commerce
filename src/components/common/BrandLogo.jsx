import React from 'react';
import Link from '@/components/common/Link';

export default function BrandLogo({
  variant = 'dark', // 'dark' (for light backgrounds) | 'light' (for dark backgrounds)
  showTagline = true,
  className = '',
  tagline = 'Archival Catalog',
  href = '/',
}) {
  const isLightModeText = variant === 'light'; // Text on dark background (like Footer)

  const content = (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Precision Geometric NexCart SVG Emblem */}
      <svg
        className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-transform duration-200 group-hover:scale-[1.02]"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Emblem Shield / Hex Badge */}
        <rect
          width="44"
          height="44"
          rx="10"
          className={isLightModeText ? 'fill-[#292524] stroke-[#44403C]' : 'fill-[#1C1917] stroke-[#292524]'}
          strokeWidth="1.2"
        />

        {/* Tote Bag Architectural Handle */}
        <path
          d="M17 11.5C17 9.5 18.8 8 21 8H23C25.2 8 27 9.5 27 11.5"
          className={isLightModeText ? 'stroke-[#FAFAF9]' : 'stroke-[#E7E5E4]'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Monogram "N" + Cart Structure */}
        {/* Left Vertical Pillar */}
        <path
          d="M13 31V14.5H18.5V31H13Z"
          className={isLightModeText ? 'fill-[#FAFAF9]' : 'fill-[#FAFAF9]'}
        />

        {/* Dynamic Faceted Diagonal */}
        <path
          d="M18 14.5L25.5 31H30.5L23 14.5H18Z"
          className={isLightModeText ? 'fill-[#D6D3D1]' : 'fill-[#E7E5E4]'}
        />

        {/* Right Vertical Pillar */}
        <path
          d="M25 14.5H30.5V31H25V14.5Z"
          className={isLightModeText ? 'fill-[#FAFAF9]' : 'fill-[#FAFAF9]'}
        />

        {/* Subtle Luxury Amber Accent Dot */}
        <circle cx="30" cy="11.5" r="1.8" fill="#D97706" />
      </svg>

      {/* Typography Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-baseline leading-none">
          <span
            className={`font-sans text-xl sm:text-2xl font-bold tracking-tight ${
              isLightModeText ? 'text-[#FAFAF9]' : 'text-[#1C1917]'
            }`}
          >
            Nex
          </span>
          <span
            className={`font-sans text-xl sm:text-2xl font-light italic ml-0.5 ${
              isLightModeText ? 'text-[#A8A29E]' : 'text-[#78716C]'
            }`}
          >
            Cart
          </span>
        </div>

        {showTagline && (
          <span
            className={`text-[9px] font-sans font-semibold uppercase tracking-[0.2em] mt-1 hidden sm:block ${
              isLightModeText ? 'text-[#78716C]' : 'text-[#A8A29E]'
            }`}
          >
            {tagline}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="NexCart Storefront Home" className="inline-block shrink-0">
        {content}
      </Link>
    );
  }

  return content;
}
