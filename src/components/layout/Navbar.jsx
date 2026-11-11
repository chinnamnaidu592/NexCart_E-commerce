
'use client';

import React, { useState, useRef, useEffect, useSyncExternalStore } from 'react';
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
  Store,
  Shield,
} from 'lucide-react';

// The browser uses the server snapshot while hydrating the existing HTML.
// Once hydration completes, React switches to the client snapshot.
const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Navbar({ onOpenMobileMenu }) {
  const router = useRouter();
  const isClient = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot
  );

  const {
    totalItemsCount,
    isHydrated: cartHydrated,
  } = useCart();

  const {
    wishlistCount,
    isHydrated: wishlistHydrated,
  } = useWishlist();

  const {
    user,
    isAdmin,
    isMerchant,
    logout,
    isHydrated: authHydrated,
  } = useAuth();

  const authReady = isClient && authHydrated;

  const [navSearch, setNavSearch] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] =
    useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] =
    useState(false);

  const loginDropdownTimeoutRef = useRef(null);

  // Only display storage-dependent counts after hydration.
  const visibleWishlistCount = isClient && wishlistHydrated
    ? wishlistCount
    : 0;

  const visibleCartCount = isClient && cartHydrated
    ? totalItemsCount
    : 0;

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
      router.push(
        `/products?q=${encodeURIComponent(navSearch.trim())}`
      );

      setNavSearch('');
    }
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Main Navbar */}
      <div className="relative z-20 bg-[#FAFAF9] border-b border-[#E7E5E4] transition-colors shadow-2xs">


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-[5.5rem] items-center justify-between gap-4 lg:gap-5">

            {/* Zone 1: Mobile Menu & Brand */}
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

            {/* Zone 2: Navigation */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
              {MAIN_NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm uppercase tracking-wider font-semibold text-[#57534E] hover:text-[#1C1917] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[#1C1917] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  {link.name}
                </Link>
              ))}

              {/* Admin link only after auth hydration */}
              {authReady && isAdmin && (
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
            <div className="flex min-w-0 flex-1 items-center justify-end gap-3 pl-2 sm:gap-5 lg:pl-4">

              {/* Search */}
              <div className="hidden min-w-28 max-w-md flex-1 md:block">
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative"
                >
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={navSearch}
                    onChange={(e) =>
                      setNavSearch(e.target.value)
                    }
                    aria-label="Search catalog"
                    className="w-full bg-white border border-[#E7E5E4] rounded-xs py-1.5 pl-8 pr-3 text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917] transition-colors"
                  />

                  <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.5]" />
                </form>
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                aria-label={`Wishlist with ${visibleWishlistCount} items`}
                className="relative p-2 text-[#57534E] hover:text-[#1C1917] transition-colors"
              >
                <Heart className="w-4 h-4 stroke-[1.5]" />

                {isClient && wishlistHydrated &&
                  visibleWishlistCount > 0 && (
                    <span className="absolute top-1 right-0.5 w-3.5 h-3.5 rounded-full bg-[#1C1917] text-white text-[9px] font-bold flex items-center justify-center">
                      {visibleWishlistCount}
                    </span>
                  )}
              </Link>

              {/* Shopping Cart */}
              <Link
                href="/cart"
                aria-label={`Shopping bag with ${visibleCartCount} items`}
                className="relative p-2 text-[#57534E] hover:text-[#1C1917] transition-colors"
              >
                <ShoppingBag className="w-4 h-4 stroke-[1.5]" />

                {isClient && cartHydrated &&
                  visibleCartCount > 0 && (
                    <span className="absolute top-1 right-0.5 w-3.5 h-3.5 rounded-full bg-[#1C1917] text-white text-[9px] font-bold flex items-center justify-center">
                      {visibleCartCount}
                    </span>
                  )}
              </Link>

              {/* Authentication UI */}
              {!authReady ? (
                // Stable placeholder during initial hydration.
                <div
                  className="w-16 h-8"
                  aria-hidden="true"
                />
              ) : user ? (

                /* Logged-in User */
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setUserDropdownOpen(!userDropdownOpen)
                    }
                    className="flex items-center gap-2 p-1 rounded-xs border border-[#E7E5E4] hover:border-[#D6D3D1] cursor-pointer transition-colors bg-white"
                    aria-expanded={userDropdownOpen}
                  >
                    <img
                      src={
                        user.image ||
                        '/images/avatar_collector_portrait_1791282676033.jpg'
                      }
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
                        onClick={() =>
                          setUserDropdownOpen(false)
                        }
                      />

                      <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E7E5E4] py-2 z-40 shadow-xl rounded-xs">

                        {/* User Information */}
                        <div className="px-4 py-2 border-b border-[#F5F5F4]">
                          <p className="text-xs font-semibold text-[#1C1917] truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-[11px] text-[#78716C] truncate">
                            {user.email}
                          </p>
                        </div>

                        {/* Account Navigation */}
                        <div className="py-1">
                          <Link
                            href="/profile"
                            onClick={() =>
                              setUserDropdownOpen(false)
                            }
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#57534E] hover:bg-[#F5F5F4] hover:text-[#1C1917]"
                          >
                            <User className="w-3.5 h-3.5 stroke-[1.5]" />
                            Account & Orders
                          </Link>

                          {(isAdmin ||
                            isMerchant ||
                            user.role === 'merchant') && (
                              <Link
                                href={
                                  isAdmin
                                    ? '/admin'
                                    : '/merchant'
                                }
                                onClick={() =>
                                  setUserDropdownOpen(false)
                                }
                                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#92400E] hover:bg-[#FFFBEB]"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 stroke-[1.5]" />
                                {isAdmin
                                  ? 'Admin Console'
                                  : 'Merchant Store Console'}
                              </Link>
                            )}
                        </div>

                        {/* Logout */}
                        <div className="pt-1 border-t border-[#F5F5F4]">
                          <button
                            type="button"
                            onClick={async () => {
                              setUserDropdownOpen(false);
                              await logout();
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#991B1B] hover:bg-[#FEF2F2] cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5 stroke-[1.5]" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (

                /* Guest Login */
                <div
                  className="relative"
                  onMouseEnter={handleLoginDropdownEnter}
                  onMouseLeave={handleLoginDropdownLeave}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setLoginDropdownOpen((prev) => !prev)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setLoginDropdownOpen(false);
                      }
                    }}
                    aria-expanded={loginDropdownOpen}
                    aria-haspopup="true"
                    className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-[#1C1917] hover:text-[#57534E] py-1.5 px-3 rounded-xs border border-[#E7E5E4] hover:border-[#D6D3D1] bg-white transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Login</span>

                    <span
                      className="text-[9px] text-[#78716C] ml-0.5 select-none"
                      aria-hidden="true"
                    >
                      ▼
                    </span>
                  </button>

                  {loginDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() =>
                          setLoginDropdownOpen(false)
                        }
                      />

                      <div
                        role="menu"
                        className="absolute right-0 mt-2 w-60 bg-white border border-[#E7E5E4] py-1.5 z-40 shadow-xl rounded-xs divide-y divide-[#F5F5F4] animate-in fade-in zoom-in-95 duration-150"
                      >

                        {/* Customer Login */}
                        <div className="p-1">
                          <Link
                            role="menuitem"
                            href="/login?role=customer"
                            onClick={() =>
                              setLoginDropdownOpen(false)
                            }
                            className="group flex items-start gap-3 p-2 rounded-xs hover:bg-[#F5F5F4] transition-colors"
                          >
                            <div className="w-7 h-7 rounded-xs bg-[#1C1917]/5 flex items-center justify-center text-[#1C1917] group-hover:bg-[#1C1917] group-hover:text-white transition-colors shrink-0 mt-0.5">
                              <User className="w-3.5 h-3.5 stroke-[1.75]" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#1C1917] flex items-center justify-between">
                                Customer Login
                                <span className="text-[10px] text-[#A8A29E] font-normal group-hover:text-[#1C1917]">
                                  →
                                </span>
                              </p>

                              <p className="text-[11px] text-[#78716C] leading-tight mt-0.5">
                                Personal cart, wishlist & orders
                              </p>
                            </div>
                          </Link>
                        </div>

                        {/* Merchant Login */}
                        <div className="p-1">
                          <Link
                            role="menuitem"
                            href="/login?role=merchant"
                            onClick={() =>
                              setLoginDropdownOpen(false)
                            }
                            className="group flex items-start gap-3 p-2 rounded-xs hover:bg-[#F5F5F4] transition-colors"
                          >
                            <div className="w-7 h-7 rounded-xs bg-[#1C1917]/5 flex items-center justify-center text-[#1C1917] group-hover:bg-[#1C1917] group-hover:text-white transition-colors shrink-0 mt-0.5">
                              <Store className="w-3.5 h-3.5 stroke-[1.75]" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#1C1917] flex items-center justify-between">
                                Merchant Login
                                <span className="text-[10px] text-[#A8A29E] font-normal group-hover:text-[#1C1917]">
                                  →
                                </span>
                              </p>

                              <p className="text-[11px] text-[#78716C] leading-tight mt-0.5">
                                Store dashboard & catalog controls
                              </p>
                            </div>
                          </Link>
                        </div>

                        {/* Admin Login */}
                        <div className="p-1">
                          <Link
                            role="menuitem"
                            href="/login?role=admin"
                            onClick={() =>
                              setLoginDropdownOpen(false)
                            }
                            className="group flex items-start gap-3 p-2 rounded-xs hover:bg-[#F5F5F4] transition-colors"
                          >
                            <div className="w-7 h-7 rounded-xs bg-[#1C1917]/5 flex items-center justify-center text-[#1C1917] group-hover:bg-[#1C1917] group-hover:text-white transition-colors shrink-0 mt-0.5">
                              <Shield className="w-3.5 h-3.5 stroke-[1.75]" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#1C1917] flex items-center justify-between">
                                Admin Login
                                <span className="text-[10px] text-[#A8A29E] font-normal group-hover:text-[#1C1917]">
                                  →
                                </span>
                              </p>

                              <p className="text-[11px] text-[#78716C] leading-tight mt-0.5">
                                Marketplace administration
                              </p>
                            </div>
                          </Link>
                        </div>

                        {/* Registration */}
                        <div className="p-1 pt-1.5 bg-[#FAFAF9]/60">
                          <Link
                            role="menuitem"
                            href="/register"
                            onClick={() =>
                              setLoginDropdownOpen(false)
                            }
                            className="block px-2.5 py-1 text-[11px] text-[#78716C] hover:text-[#1C1917] transition-colors text-center"
                          >
                            Don&apos;t have an account?{' '}
                            <span className="font-semibold underline">
                              Register
                            </span>
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

      {/* Departments Navigation */}
      <DepartmentsBar />
    </header>
  );
}
