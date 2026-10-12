import React, { useState } from 'react';
import { useRouter } from '@/router/RouterContext';
import { useAuth } from '@/context/AuthContext';
import { MAIN_NAV_LINKS } from '@/constants/navLinks';
import { DEPARTMENTS } from '@/constants/departments';
import BrandLogo from '@/components/common/BrandLogo';
import { X, Search, ShieldCheck, User, LogOut, ShoppingBag, Sparkles, Store } from 'lucide-react';

export default function MobileMenu({ isOpen, onClose }) {
  const router = useRouter();
  const { user, isAdmin, isMerchant, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      onClose();
    }
  };

  const navigateTo = (href) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-[#1C1917]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white border-r border-[#E7E5E4] p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200 shadow-xl">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E7E5E4]">
            <BrandLogo
              variant="dark"
              tagline="Archival Catalog"
              href="/"
            />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F5F4] rounded-xs cursor-pointer transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="mt-5 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F5F5F4] border border-[#E7E5E4] focus:border-[#1C1917] rounded-xs py-2 pl-8 pr-3 text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:bg-white transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.5]" />
          </form>

          {/* Nav Links */}
          <nav className="mt-5 space-y-1">
            {MAIN_NAV_LINKS.map((link) => (
              <button
                key={link.name}
                type="button"
                onClick={() => navigateTo(link.href)}
                className="w-full text-left py-2 px-2.5 rounded-xs text-xs font-semibold uppercase tracking-wider text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F4] cursor-pointer transition-colors flex items-center justify-between"
              >
                <span>{link.name}</span>
                {link.name === 'Top Deals' && (
                  <span className="bg-[#991B1B] text-white text-[8.5px] font-mono px-1.5 py-0.5 rounded-none uppercase">Deals</span>
                )}
                {link.name === 'Best Sellers' && (
                  <span className="bg-[#1C1917] text-white text-[8.5px] font-mono px-1.5 py-0.5 rounded-none uppercase">Ranked</span>
                )}
              </button>
            ))}

            {/* Departments list */}
            <div className="pt-3 pb-2">
              <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-[#A8A29E] block mb-2 px-2.5">
                Departments
              </span>
              <div className="space-y-1">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => navigateTo(`/department/${dept.slug}`)}
                    className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-xs border border-[#E7E5E4] hover:border-[#1C1917] text-left cursor-pointer transition-colors hover:bg-[#FAFAF9]"
                  >
                    <span className="text-xs text-[#1C1917]">
                      {dept.name}
                    </span>
                    <span className="text-[10px] uppercase font-mono text-[#78716C]">
                      View
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={() => navigateTo('/admin')}
                className="w-full flex items-center gap-2 text-left py-2.5 px-3 text-xs font-bold text-amber-700 bg-amber-50 rounded-xl cursor-pointer mt-4"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" /> Admin Console
              </button>
            )}
          </nav>
        </div>

        {/* Footer / Account */}
        <div className="pt-5 border-t border-slate-100 space-y-3">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={user.image || '/src/assets/images/avatar_collector_portrait_1791282676033.jpg'}
                  alt={user.firstName}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigateTo('/profile')}
                className="w-full flex items-center gap-2 py-2 text-xs font-medium text-[#57534E] hover:text-[#1C1917] cursor-pointer"
              >
                <User className="w-4 h-4 text-[#78716C]" /> View Account & Orders
              </button>

              {(isAdmin || isMerchant || user.role === 'merchant') && (
                <button
                  type="button"
                  onClick={() => navigateTo('/admin')}
                  className="w-full flex items-center gap-2 py-2 text-xs font-medium text-[#92400E] hover:text-[#78350F] cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#B45309]" />{' '}
                  {isAdmin ? 'Admin Console' : 'Merchant Store Console'}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center gap-2 py-2 text-xs font-medium text-[#991B1B] hover:text-[#7F1D1D] cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-[#A8A29E] block px-1">
                Account Access
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => navigateTo('/login?role=customer')}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-2 text-center text-xs font-semibold text-[#1C1917] border border-[#E7E5E4] rounded-xs hover:border-[#1C1917] hover:bg-[#F5F5F4] cursor-pointer transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#78716C]" />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('/login?role=merchant')}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-2 text-center text-xs font-semibold text-[#1C1917] border border-[#E7E5E4] rounded-xs hover:border-[#1C1917] hover:bg-[#F5F5F4] cursor-pointer transition-colors"
                >
                  <Store className="w-3.5 h-3.5 text-[#78716C]" />
                  <span>Merchant</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('/register')}
                className="w-full py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white bg-[#1C1917] rounded-xs hover:bg-[#292524] shadow-xs cursor-pointer transition-colors"
              >
                Create Client Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
