import React from 'react';
import Button from './Button';
import Link from './Link';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'Try adjusting your filters, search keywords, or explore our curated collections.',
  actionText,
  actionLabel,
  actionHref,
  onAction,
}) {
  const label = actionText || actionLabel;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-[#E7E5E4] rounded-sm bg-white max-w-lg mx-auto my-8 shadow-xs">
      {/* Icon Badge: subtle soft pastel background, refined hairline border, consistent stroke */}
      <div className="w-14 h-14 rounded-full bg-[#F5F5F4] border border-[#E7E5E4] text-[#1C1917] flex items-center justify-center mb-5 shadow-2xs">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>

      {/* Title: Active global heading typography */}
      <h3 className="font-sans text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight mb-2.5">
        {title}
      </h3>

      {/* Description: Active body font, muted text-neutral-600/text-[#57534E], relaxed line-height */}
      <p className="text-xs sm:text-sm text-[#57534E] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {/* Unified Action Button */}
      {label && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center font-semibold rounded-xs transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] focus-visible:ring-offset-2 active:scale-[0.99] tracking-wider uppercase text-xs bg-[#1C1917] text-white hover:bg-[#292524] border border-[#1C1917] shadow-2xs px-5 py-2.5"
        >
          {label}
        </Link>
      )}

      {label && !actionHref && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {label}
        </Button>
      )}
    </div>
  );
}
