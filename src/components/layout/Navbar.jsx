import React, { useState, useRef, useEffect } from 'react';
import Link from '@/components/common/Link';
import { useRouter } from '@/router/RouterContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { MAIN_NAV_LINKS } from '@/constants/navLinks';
import DepartmentsBar from '@/components/layout/DepartmentsBar';
import BrandLogo from '@/components/common/BrandLogo';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  ShieldCheck,
  Menu,
  LogOut,
  ChevronDown,
  Store,
} from 'lucide-react';

export default function Navbar({ onOpenMobileMenu }) {
  const router = useRouter();
  const { totalItemsCount, isHydrated: cartHydrated } = useCart();
  const { wishlistCount, isHydrated: wishlistHydrated } = useWishlist();
  const { user, isAdmin, isMerchant, logout } = useAuth();
  const [navSearch, setNavSearch] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const loginDropdownTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (loginDropdownTimeoutRef.current) {
        clearTimeout(loginDropdownTimeoutRef.current);
      }
    };
  }, []);

  const handleLoginDropdownEnter = () => {
    if (loginDropdownTimeoutRef.current) {
      clearTimeout(loginDropdownTimeoutRef.current);
    }
    setLoginDropdownOpen(true);
  };

  const handleLoginDropdownLeave = () => {
    loginDropdownTimeoutRef.current = setTimeout(() => {
      setLoginDropdownOpen(false);
    }, 150);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      router.push(`/products?q=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    }
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Primary Navbar Bar (z-20 to allow category bar to slide up behind it) */}
      <div className="relative z-20 bg-[#FAFAF9] border-b border-[#E7E5E4] transition-colors shadow-2xs">
        {/* Top Quiet Luxury Dispatch Banner */}
        <div className="bg-[#1C1917] text-[#FAFAF9] py-1.5 px-4 text-center text-[11px] tracking-wider uppercase border-b border-[#292524] hidden sm:block font-medium">
          <span>Complimentary expedited shipping on orders exceeding ₹999</span>
          <span className="mx-3 opacity-40">·</span>
          <span>30-day bespoke return guarantee</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-6 lg:gap-8">
            {/* Zone 1: Mobile toggle & Brand Wordmark */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onOpenMobileMenu}
                aria-label="Open mobile navigation menu"
                className="lg:hidden p-2 -ml-2 text-[#57534E] hover:text-[#1C1917] cursor-pointer"
              >
                <Menu className="w-5 h-5 stroke-[1.5]" />
              </button>

              <BrandLogo
                variant="dark"
                tagline="Archival Catalog"
                href="/"
              />
            </div>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {MAIN_NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs uppercase tracking-wider font-semibold text-[#57534E] hover:text-[#1C1917] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[#1C1917] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#92400E] bg-[#FEF3C7]/60 border border-[#FDE68A] px-2.5 py-1 rounded-xs hover:bg-[#FEF3C7] transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[1.5]" />
                  Admin
                </Link>
              )}
            </nav>

            {/* Zone 3: Search & Actions */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Minimalist Search Bar with subtle key hint */}
              <div className="hidden md:block w-48 lg:w-64">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={navSearch}
                    onChange={(e) => setNavSearch(e.target.value)}
                    aria-label="Search catalog"
                    className="w-full bg-white border border-[#E7E5E4] rounded-xs py-1.5 pl-8 pr-3 text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917] transition-colors"
                  />
                  <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.5]" />
                </form>
              </div>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                aria-label={`Wishlist with ${wishlistCount} items`}
                className="relative p-2 text-[#57534E] hover:text-[#1C1917] transition-colors"
              >
                <Heart className="w-4 h-4 stroke-[1.5]" />
                {wishlistHydrated && wishlistCount > 0 && (
                  <span className="absolute top-1 right-0.5 w-3.5 h-3.5 rounded-full bg-[#1C1917] text-white text-[9px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link
                href="/cart"
                aria-label={`Shopping bag with ${totalItemsCount} items`}
                className="relative p-2 text-[#57534E] hover:text-[#1C1917] transition-colors"
              >
                <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                {cartHydrated && totalItemsCount > 0 && (
                  <span className="absolute top-1 right-0.5 w-3.5 h-3.5 rounded-full bg-[#1C1917] text-white text-[9px] font-bold flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </Link>

              {/* User Profile / Auth */}
              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-xs border border-[#E7E5E4] hover:border-[#D6D3D1] cursor-pointer transition-colors bg-white"
                    aria-expanded={userDropdownOpen}
                  >
                    <img
                      src={user.image || '/src/assets/images/avatar_collector_portrait_1791282676033.jpg'}
                      alt={user.firstName || 'User avatar'}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-none object-cover"
                    />
                    <span className="text-xs font-medium text-[#1C1917] hidden sm:block max-w-[90px] truncate">
                      {user.firstName || user.username}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setUserDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E7E5E4] py-2 z-40 shadow-xl rounded-xs">
                        <div className="px-4 py-2 border-b border-[#F5F5F4]">
                          <p className="text-xs font-semibold text-[#1C1917] truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-[11px] text-[#78716C] truncate">{user.email}</p>
                        </div>

                        <div className="py-1">
                          <Link
                            href="/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#57534E] hover:bg-[#F5F5F4] hover:text-[#1C1917]"
                          >
                            <User className="w-3.5 h-3.5 stroke-[1.5]" /> Account & Orders
                          </Link>
                          {(isAdmin || isMerchant || user.role === 'merchant') && (
                            <Link
                              href="/admin"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#92400E] hover:bg-[#FFFBEB]"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 stroke-[1.5]" />{' '}
                              {isAdmin ? 'Admin Console' : 'Merchant Store Console'}
                            </Link>
                          )}
                        </div>

                        <div className="pt-1 border-t border-[#F5F5F4]">
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#991B1B] hover:bg-[#FEF2F2] cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5 stroke-[1.5]" /> Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div
                  className="relative"
                  onMouseEnter={handleLoginDropdownEnter}
                  onMouseLeave={handleLoginDropdownLeave}
                >
                  <button
                    type="button"
                    onClick={() => setLoginDropdownOpen((prev) => !prev)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setLoginDropdownOpen(false);
                    }}
                    aria-expanded={loginDropdownOpen}
                    aria-haspopup="true"
                    className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-[#1C1917] hover:text-[#57534E] py-1.5 px-3 rounded-xs border border-[#E7E5E4] hover:border-[#D6D3D1] bg-white transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Login</span>
                    <span className="text-[9px] text-[#78716C] ml-0.5 select-none" aria-hidden="true">▼</span>
                  </button>

                  {loginDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setLoginDropdownOpen(false)}
                      />
                      <div
                        role="menu"
                        className="absolute right-0 mt-2 w-60 bg-white border border-[#E7E5E4] py-1.5 z-40 shadow-xl rounded-xs divide-y divide-[#F5F5F4] animate-in fade-in zoom-in-95 duration-150"
                      >
                        <div className="p-1">
                          <Link
                            role="menuitem"
                            href="/login?role=customer"
                            onClick={() => setLoginDropdownOpen(false)}
                            className="group flex items-start gap-3 p-2 rounded-xs hover:bg-[#F5F5F4] transition-colors"
                          >
                            <div className="w-7 h-7 rounded-xs bg-[#1C1917]/5 flex items-center justify-center text-[#1C1917] group-hover:bg-[#1C1917] group-hover:text-white transition-colors shrink-0 mt-0.5">
                              <User className="w-3.5 h-3.5 stroke-[1.75]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#1C1917] flex items-center justify-between">
                                Customer Login
                                <span className="text-[10px] text-[#A8A29E] font-normal group-hover:text-[#1C1917]">→</span>
                              </p>
                              <p className="text-[11px] text-[#78716C] leading-tight mt-0.5">
                                Personal cart, wishlist & orders
                              </p>
                            </div>
                          </Link>
                        </div>

                        <div className="p-1">
                          <Link
                            role="menuitem"
                            href="/login?role=merchant"
                            onClick={() => setLoginDropdownOpen(false)}
                            className="group flex items-start gap-3 p-2 rounded-xs hover:bg-[#F5F5F4] transition-colors"
                          >
                            <div className="w-7 h-7 rounded-xs bg-[#1C1917]/5 flex items-center justify-center text-[#1C1917] group-hover:bg-[#1C1917] group-hover:text-white transition-colors shrink-0 mt-0.5">
                              <Store className="w-3.5 h-3.5 stroke-[1.75]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#1C1917] flex items-center justify-between">
                                Merchant Login
                                <span className="text-[10px] text-[#A8A29E] font-normal group-hover:text-[#1C1917]">→</span>
                              </p>
                              <p className="text-[11px] text-[#78716C] leading-tight mt-0.5">
                                Store dashboard & catalog controls
                              </p>
                            </div>
                          </Link>
                        </div>

                        <div className="p-1 pt-1.5 bg-[#FAFAF9]/60">
                          <Link
                            role="menuitem"
                            href="/register"
                            onClick={() => setLoginDropdownOpen(false)}
                            className="block px-2.5 py-1 text-[11px] text-[#78716C] hover:text-[#1C1917] transition-colors text-center"
                          >
                            Don&apos;t have an account? <span className="font-semibold underline">Register</span>
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row of 6 Main Departments below Navbar (z-10, slides up behind navbar on scroll down) */}
      <DepartmentsBar />
    </header>
  );
}
