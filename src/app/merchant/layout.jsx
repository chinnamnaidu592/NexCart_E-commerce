'use client';

import React, { useEffect, useState } from 'react';
import MerchantSidebar from '@/components/merchant/MerchantSidebar';
import MerchantTopbar from '@/components/merchant/MerchantTopbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/router/RouterContext';
import { ROUTES } from '@/constants/routes';
import toast from 'react-hot-toast';

export default function MerchantLayout({ children }) {
  const { user, isMerchant, isHydrated, logout } = useAuth();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const hasAccess = Boolean(user && isMerchant);

  useEffect(() => {
    if (!isHydrated || hasAccess || isLoggingOut) return;

    if (!user) {
      toast.error('Merchant authentication required.');
      router.replace(
        `${ROUTES.LOGIN}?role=merchant&redirect=${encodeURIComponent(ROUTES.MERCHANT_DASHBOARD)}`
      );
    } else if (user.role === 'admin') {
      toast.error('Merchant access required. Redirecting to the Admin portal.');
      router.replace(ROUTES.ADMIN_DASHBOARD);
    } else {
      toast.error('Access restricted to Merchant accounts.');
      router.replace(ROUTES.HOME);
    }
  }, [user, hasAccess, isHydrated, isLoggingOut, router]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    router.replace(ROUTES.HOME);
  };

  if (!isHydrated || !hasAccess) {
    return (
      <div className="min-h-screen bg-[#1C1917] flex items-center justify-center p-4">
        <div className="text-center text-[#A8A29E]">
          <p className="text-xs uppercase tracking-widest font-mono">
            Verifying Merchant access permissions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex text-left">
      <MerchantSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <MerchantTopbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
