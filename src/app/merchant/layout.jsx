'use client';

import React, { useState, useEffect } from 'react';
import MerchantSidebar from '@/components/merchant/MerchantSidebar';
import MerchantTopbar from '@/components/merchant/MerchantTopbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/router/RouterContext';
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
      router.replace('/login?role=merchant&redirect=%2Fmerchant');
    } else if (user.role === 'admin') {
      toast.error('Merchant access required. Redirecting to the Admin portal.');
      router.replace('/admin');
    } else {
      toast.error('Access restricted to Merchant accounts.');
      router.replace('/');
    }
  }, [user, hasAccess, isHydrated, isLoggingOut, router]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    router.replace('/');
  };

  if (!isHydrated || !hasAccess) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-4">
        <div className="text-center text-[#78716C]">
          <p className="text-xs uppercase tracking-widest font-mono">
            Verifying merchant store permissions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]  flex text-left transition-colors">
      {/* Sidebar (Desktop static & Mobile drawer) */}
      <MerchantSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <MerchantTopbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onLogout={handleLogout}
          title="Merchant Store Console"
        />

        <main className="flex-1 p-5 sm:p-7 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
