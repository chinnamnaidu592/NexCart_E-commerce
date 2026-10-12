/**
 * Static marketing content, copy, and icons for Home page sections
 * Extracted per project requirements to prevent hardcoding inside UI components.
 */
export const HERO_CONTENT = {
  badge: 'AUTUMN / WINTER 2026 EDIT · EDITION 04',
  title: 'Objects of Permanent Character & Quiet Utility',
  description:
    'A curated inventory of enduring lifestyle goods, precision electronics, and everyday essentials. Handcrafted standards, transparent provenance, and expedited delivery.',
  primaryCta: {
    label: 'Explore Catalog',
    href: '/products',
  },
  secondaryCta: {
    label: 'View Best Sellers',
    href: '/bestsellers',
  },
  stats: [
    { value: '50,000+', label: 'Considered Orders' },
    { value: '99.4%', label: 'Provenance Verified' },
    { value: '30-Day', label: 'Bespoke Return Guarantee' },
  ],
};

export const BENEFITS_CONTENT = [
  {
    id: 'shipping',
    title: 'Complimentary Shipping',
    description: 'Expedited courier dispatch on orders exceeding the ₹999 threshold.',
    iconName: 'Truck',
  },
  {
    id: 'payment',
    title: 'Certified Security',
    description: 'Direct 256-bit encrypted checkout with verified zero-storage card protection.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'returns',
    title: 'Considered Returns',
    description: 'Generous 30-day window with instant prepaid return manifests.',
    iconName: 'RotateCcw',
  },
  {
    id: 'support',
    title: 'Concierge Care',
    description: 'Direct specialist support available for provenance and order advisory.',
    iconName: 'Headphones',
  },
];

export const PROMO_BANNER_CONTENT = {
  tag: 'CURATOR INVITATION',
  headline: 'Special Acquisition Privilege on Select Essentials',
  subheadline: 'Apply archival voucher SAVE10 at checkout for an additional 10% courtesy on your order.',
  ctaText: 'Explore Curated Drops',
  ctaHref: '/products',
  promoCode: 'SAVE10',
};
