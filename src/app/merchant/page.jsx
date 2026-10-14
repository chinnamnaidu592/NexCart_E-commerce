import React from 'react';
import { Package, ShoppingBag, Store } from 'lucide-react';

const UPCOMING_FEATURES = [
  {
    title: 'My Products',
    description: 'Manage products belonging to your store.',
    icon: Package,
  },
  {
    title: 'My Orders',
    description: 'Review and manage orders for your store.',
    icon: ShoppingBag,
  },
];

export default function MerchantDashboardPage() {
  return (
    <div className="space-y-8 text-left">
      <section className="border-b border-[#E7E5E4] pb-6">
        <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.2em] block mb-1">
          Merchant Portal
        </span>
        <h2 className="font-sans text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
          Welcome to Your Store
        </h2>
        <p className="text-sm text-[#78716C] mt-2 max-w-2xl leading-relaxed">
          Your Merchant workspace is ready. Store-management tools will be added in
          upcoming updates.
        </p>
      </section>

      <section className="bg-white border border-[#E7E5E4] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#F5F5F4] border border-[#E7E5E4] text-[#1C1917]">
            <Store className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="font-sans text-xl font-normal text-[#1C1917]">
              Merchant tools are coming soon
            </h3>
            <p className="text-sm text-[#78716C] mt-1 leading-relaxed">
              This portal is separate from marketplace administration. No global
              catalog or order data is shown here.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Planned store management features" className="grid gap-4 sm:grid-cols-2">
        {UPCOMING_FEATURES.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="bg-white border border-[#E7E5E4] p-5 flex items-start gap-3"
          >
            <Icon className="w-4 h-4 text-[#78716C] mt-0.5 stroke-[1.5]" />
            <div>
              <h3 className="text-sm font-semibold text-[#1C1917]">{title}</h3>
              <p className="text-xs text-[#78716C] mt-1">{description}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
