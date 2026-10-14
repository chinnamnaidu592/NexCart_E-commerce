'use client';

import React, { use, useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import LoginForm from '@/components/forms/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/router/RouterContext';
import { Shield, Store, Sparkles } from 'lucide-react';

const LOGIN_ROLES = ['customer', 'merchant', 'admin'];

function getLoginRole(roleParam) {
  if (roleParam === null) return 'customer';
  return LOGIN_ROLES.includes(roleParam) ? roleParam : null;
}

function getRoleDestination(role, redirectPath) {
  if (role === 'admin') return '/admin';
  if (role === 'merchant') return '/merchant';
  return redirectPath;
}

export default function LoginPage({ searchParams }) {
  const { login, loading, user } = useAuth();
  const router = useRouter();
  const params = use(searchParams);
  const roleParam =
    params.role === undefined ? null : typeof params.role === 'string' ? params.role : '';
  const redirectPath = typeof params.redirect === 'string' ? params.redirect : '/';

  // Missing role preserves the legacy Customer default; unknown roles remain invalid.
  const initialRole = getLoginRole(roleParam);
  const [role, setRole] = useState(initialRole);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync role when URL param updates
  useEffect(() => {
    setRole(getLoginRole(roleParam));
    setErrorMessage('');
  }, [roleParam]);

  // If already authenticated, redirect appropriately
  useEffect(() => {
    if (user) {
      router.replace(getRoleDestination(user.role, redirectPath));
    }
  }, [user, redirectPath, router]);

  const handleRoleChange = (newRole) => {
    if (!LOGIN_ROLES.includes(newRole)) return;
    if (newRole === role) return;
    setRole(newRole);
    setErrorMessage('');
    // Smoothly update URL query param without page reload
    const targetUrl = `/login?role=${newRole}${
      redirectPath !== '/' ? `&redirect=${encodeURIComponent(redirectPath)}` : ''
    }`;
    router.replace(targetUrl);
  };

  const handleLogin = async (identifier, password, currentRole) => {
    setErrorMessage('');
    try {
      const activeRole = currentRole;
      if (!LOGIN_ROLES.includes(activeRole)) {
        throw new Error('Choose a valid login role and try again.');
      }
      const loggedInUser = await login(identifier, password, activeRole);
      if (loggedInUser.role !== activeRole) {
        throw new Error(`This account is not registered for ${activeRole} login.`);
      }
      router.push(getRoleDestination(activeRole, redirectPath));
    } catch (err) {
      setErrorMessage(err.message || 'Login failed.');
    }
  };

  const isAdmin = role === 'admin';
  const isMerchant = role === 'merchant';
  const roleTitle = isAdmin ? 'Admin' : isMerchant ? 'Merchant' : 'Customer';

  return (
    <div className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-108px)] flex flex-col lg:flex-row bg-[#FAFAF9] overflow-hidden">
      {/* ========================================================
          LEFT 50%: Hero visual container with background imagery,
          brand messaging, and editorial overlay.
          Completely hidden on mobile (< 768px), visible on md/lg.
          ======================================================== */}
      <div className="hidden md:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-8 lg:p-12 text-white bg-[#1C1917] select-none shrink-0">
        {/* Background Visual Asset */}
        <div className="absolute inset-0 z-0">
          <img
            key={role}
            src={
              isMerchant
                ? 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=85'
                : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=85'
            }
            alt={isMerchant ? 'Merchant Atelier Operations' : 'Curated Client Boutique'}
            onError={(e) => {
              e.currentTarget.src = isMerchant
                ? '/src/assets/images/category_craft_objects_1791282688777.jpg'
                : '/src/assets/images/hero_scandinavian_craft_1791282659132.jpg';
            }}
            className="w-full h-full object-cover transition-opacity duration-700 ease-out"
          />
          {/* Multi-layered Contrast Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/70 to-[#1C1917]/35" />
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50" />
        </div>

        {/* Top Brand & Provenance Watermark */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-sans text-xl sm:text-2xl font-light tracking-tight text-[#FAFAF9]">
              Nex<span className="font-sans font-bold text-xs tracking-widest text-[#A8A29E] ml-1 uppercase">ARCHIVE</span>
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase backdrop-blur-md border ${
              isMerchant
                ? 'bg-amber-500/15 border-amber-400/30 text-amber-200'
                : isAdmin
                  ? 'bg-sky-500/15 border-sky-400/30 text-sky-200'
                  : 'bg-white/10 border-white/20 text-stone-200'
            }`}
          >
            {isMerchant ? (
              <>
                <Store className="w-3 h-3 text-amber-300 stroke-[2]" />
                Merchant Suite
              </>
            ) : isAdmin ? (
              <>
                <Shield className="w-3 h-3 text-sky-300 stroke-[2]" />
                Admin Access
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-stone-300 stroke-[2]" />
                Client Access
              </>
            )}
          </span>
        </div>

        {/* Center Editorial Messaging (Dynamic based on role) */}
        <div className="relative z-10 max-w-lg my-auto py-8">
          <div className="space-y-4">
            <span className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] text-[#A8A29E]">
              {isMerchant
                ? 'Atelier Partner Portal'
                : isAdmin
                  ? 'Marketplace Administration'
                  : 'Private Member Authentication'}
            </span>

            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-[1.1] tracking-tight">
              {isMerchant
                ? 'Grow Your Business. Manage Your Store.'
                : isAdmin
                  ? 'Manage the NexCart Marketplace.'
                  : 'Welcome Back! Happy Shopping!'}
            </h2>

            <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
              {isMerchant
                ? 'Oversee live inventory provisioning, track regional sales settlements, and monitor product fulfillment in one unified workspace.'
                : isAdmin
                  ? 'Sign in to access marketplace-wide administration tools.'
                  : 'Access your private wishlist, curated member discounts, personalized object allocations, and bespoke order dispatch archives.'}
            </p>
          </div>
        </div>

        {/* Bottom Trust & Authenticity Badges */}
        <div className="relative z-10 pt-6 border-t border-white/15">
          <div className="grid grid-cols-3 gap-4 text-[11px] text-stone-300 font-mono">
            {isMerchant ? (
              <>
                <div className="flex flex-col">
                  <span className="text-white font-semibold">Live Catalog Sync</span>
                  <span className="text-[10px] text-stone-400">Instant SKU updates</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold">Automated Payouts</span>
                  <span className="text-[10px] text-stone-400">Direct merchant wire</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold">Atelier Support</span>
                  <span className="text-[10px] text-stone-400">Dedicated partner desk</span>
                </div>
              </>
            ) : isAdmin ? (
              <>
                <div className="flex flex-col">
                  <span className="text-white font-semibold">Marketplace Oversight</span>
                  <span className="text-[10px] text-stone-400">Catalog & orders</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold">Customer Directory</span>
                  <span className="text-[10px] text-stone-400">Account management</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold">Admin Access</span>
                  <span className="text-[10px] text-stone-400">Existing admin accounts</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col">
                  <span className="text-white font-semibold">White-Glove Dispatch</span>
                  <span className="text-[10px] text-stone-400">Expedited & insured</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold">30-Day Returns</span>
                  <span className="text-[10px] text-stone-400">Complimentary courier</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold">Guaranteed Authenticity</span>
                  <span className="text-[10px] text-stone-400">Atelier certified</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          RIGHT 50%: Vertically centered authentication card
          Occupies full width on mobile (< 768px), 50% on desktop.
          Strict vertical space budget prevents scroll overflow.
          ======================================================== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-[#FAFAF9] overflow-y-auto">
        <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xs border border-[#E7E5E4] p-6 sm:p-8 shadow-2xs transition-all duration-300">
          {/* Card Header */}
          <div className="text-center mb-5">
            <span className="text-[10px] font-mono font-medium text-[#78716C] uppercase tracking-[0.18em] block mb-1">
              {role ? `${roleTitle} Sign In` : 'Sign In'}
            </span>
            <h1 className="font-sans text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight">
              {role ? `${roleTitle} Login` : 'Choose a Login Role'}
            </h1>
            <p className="text-xs text-[#78716C] mt-1.5 leading-relaxed">
              {isMerchant
                ? 'Sign in to access your store inventory and business metrics.'
                : isAdmin
                  ? 'Sign in with an existing Admin account to manage the marketplace.'
                  : role
                    ? 'Sign in to access your curated selections and member privileges.'
                    : 'The requested login role is not supported. Choose Customer, Merchant, or Admin.'}
            </p>
          </div>

          {/* Authentication Form with dynamic CTA & Fallback Switcher */}
          {role ? (
            <LoginForm
              role={role}
              onRoleChange={handleRoleChange}
              onSubmit={handleLogin}
              isLoading={loading}
              errorMessage={errorMessage}
              onClearError={() => setErrorMessage('')}
            />
          ) : (
            <div className="space-y-3" role="alert">
              <p className="text-xs text-[#991B1B] text-center">
                Unsupported login role. Select a valid role to continue.
              </p>
              <div className="flex justify-center gap-4 text-xs">
                {LOGIN_ROLES.map((loginRole) => (
                  <button
                    key={loginRole}
                    type="button"
                    onClick={() => handleRoleChange(loginRole)}
                    className="font-semibold text-[#1C1917] hover:underline capitalize"
                  >
                    {loginRole}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Registration Option */}
          <div className="mt-4 pt-3 border-t border-[#F5F5F4] text-center text-xs text-[#78716C]">
            {isMerchant ? (
              <span>
                Want to partner with NexCart?{' '}
                <Link
                  href="/register?role=merchant"
                  className="font-semibold text-[#1C1917] hover:underline"
                >
                  Register as Merchant
                </Link>
              </span>
            ) : isAdmin ? (
              <span className="text-[11px]">Admin access is limited to existing accounts.</span>
            ) : role ? (
              <span>
                Don&apos;t have an account?{' '}
                <Link
                  href="/register?role=customer"
                  className="font-semibold text-[#1C1917] hover:underline"
                >
                  Register
                </Link>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
