'use client';

import React from 'react';
import Link from '@/components/common/Link';
import { usePathname } from '@/router/RouterContext';
import BrandLogo from '@/components/common/BrandLogo';
import {
  Activity,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  PackageCheck,
  RotateCcw,
  Store,
  X,
} from 'lucide-react';

const MERCHANT_LINKS = [
  { name: 'Store Dashboard', href: '/merchant', icon: LayoutDashboard },
  { name: 'My Products', href: '/merchant/products', icon: ClipboardList },
  { name: 'Inventory', href: '/merchant/inventory', icon: Boxes },
  { name: 'My Orders', href: '/merchant/orders', icon: PackageCheck },
  { name: 'Cancellation Requests', href: '/merchant/cancellation', icon: RotateCcw },
  { name: 'Performance', href: '/merchant/performance', icon: Activity },
];

export default function MerchantSidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const content = (
    <div className="h-full flex flex-col justify-between p-6 bg-[#1C1917] text-[#A8A29E] border-r border-[#292524]">
      <div>
        <div className="flex items-center justify-between pb-6 pt-1 border-b border-[#292524]">
          <BrandLogo
            variant="light"
            tagline="Merchant Portal"
            href="/merchant"
          />
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 text-[#78716C] hover:text-[#FAFAF9] cursor-pointer"
              aria-label="Close merchant sidebar"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          )}
        </div>

        <nav className="mt-8 space-y-1" aria-label="Merchant navigation">
          {MERCHANT_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href ||
              (link.href !== '/merchant' && pathname.startsWith(`${link.href}/`));

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-none text-[11px] uppercase tracking-[0.14em] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#292524] text-[#FAFAF9] border-l-2 border-[#FAFAF9]'
                    : 'text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-[#292524]/50'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[1.5]" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-[#292524]">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2.5 text-xs uppercase tracking-wider text-[#78716C] hover:text-[#FAFAF9] transition-colors"
        >
          <Store className="w-4 h-4 stroke-[1.5]" />
          <span>Return to Storefront</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 min-h-screen">
        {content}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-[#1C1917]/70 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-[#1C1917] shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
