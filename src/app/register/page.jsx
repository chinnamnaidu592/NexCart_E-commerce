'use client';

import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import RegisterForm from '@/components/forms/RegisterForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from '@/router/RouterContext';
import { User, Store } from 'lucide-react';

export default function RegisterPage() {
  const { register, loading, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial role from query params (?role=merchant or ?role=customer)
  const initialRole = searchParams.get('role') === 'merchant' ? 'merchant' : 'customer';
  const [role, setRole] = useState(initialRole);

  useEffect(() => {
    const paramRole = searchParams.get('role');
    if (paramRole === 'merchant' || paramRole === 'customer') {
      setRole(paramRole);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      const destination =
        user.role === 'admin' ? '/admin' : user.role === 'merchant' ? '/merchant' : '/';
      router.replace(destination);
    }
  }, [user, router]);

  const handleRoleToggle = (newRole) => {
    if (newRole === role) return;
    setRole(newRole);
    router.replace(`/register?role=${newRole}`);
  };

  const handleRegister = async (formData) => {
    try {
      const newUser = await register({
        ...formData,
        role,
      }, { autoLogin: role !== 'merchant' });
      if (newUser.role === 'merchant') {
        router.push('/login?role=merchant');
      } else {
        router.push('/');
      }
    } catch {
      // Error is caught and toasted in AuthContext
    }
  };

  const isMerchant = role === 'merchant';

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-6 sm:py-10 bg-[#FAFAF9]">
      <div className={`w-full ${isMerchant ? 'max-w-xl' : 'max-w-md'} bg-white rounded-xs border border-[#E7E5E4] p-5 sm:p-7 shadow-xs transition-all duration-200`}>
        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 p-1 bg-[#F5F5F4] rounded-xs mb-5 border border-[#E7E5E4]/60">
          <button
            type="button"
            onClick={() => handleRoleToggle('customer')}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
              !isMerchant
                ? 'bg-white text-[#1C1917] shadow-2xs font-semibold'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <User className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleToggle('merchant')}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
              isMerchant
                ? 'bg-white text-[#1C1917] shadow-2xs font-semibold'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <Store className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Merchant Partner</span>
          </button>
        </div>

        {/* Dynamic Card Header */}
        <div className="text-center mb-4">
          <span className="text-[10px] font-mono font-medium text-[#78716C] uppercase tracking-[0.18em] block mb-1">
            {isMerchant ? 'NexCart Merchant Portal' : 'Client Registry'}
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight">
            {isMerchant ? 'Register Store Atelier' : 'Create Client Profile'}
          </h1>
          <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
            {isMerchant
              ? 'Join NexCart as a verified partner to list collections, manage stock, and monitor commercial orders.'
              : 'Register to maintain verified orders, dispatch tracking, and custom wishlists.'}
          </p>
        </div>

        {/* Registration Form */}
        <RegisterForm role={role} onSubmit={handleRegister} isLoading={loading} />

        {/* Bottom Sign-In Link */}
        <div className="mt-4 pt-3 border-t border-[#F5F5F4] text-center text-xs text-[#78716C]">
          {isMerchant ? (
            <span>
              Already a partner?{' '}
              <Link
                href="/login?role=merchant"
                className="font-semibold text-[#1C1917] hover:underline"
              >
                Sign In to Merchant Console
              </Link>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <Link
                href="/login?role=customer"
                className="font-semibold text-[#1C1917] hover:underline"
              >
                Sign In to Account
              </Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
