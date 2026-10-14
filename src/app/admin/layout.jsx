'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminTopbar from '@/components/layout/AdminTopbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/router/RouterContext';
import { ROUTES } from '@/constants/routes';
import toast from 'react-hot-toast';

export default function AdminLayout({ children }) {
  const { user, isAdmin, isHydrated, logout } = useAuth();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const hasAccess = Boolean(user && isAdmin);

  useEffect(() => {
    if (!isHydrated || hasAccess || isLoggingOut) return;

    if (!user) {
      toast.error('Admin authentication required.');
      router.replace(`${ROUTES.LOGIN}?role=admin&redirect=${encodeURIComponent(ROUTES.ADMIN_DASHBOARD)}`);
    } else if (user.role === 'merchant') {
      toast.error('Admin access required. Redirecting to the Merchant portal.');
      router.replace(ROUTES.MERCHANT_DASHBOARD);
    } else {
      toast.error('Access restricted to Admin accounts.');
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
            Verifying Admin access permissions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex text-left">
      {/* Sidebar (Desktop static & Mobile drawer) */}
      <AdminSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onLogout={handleLogout}
          title="Atelier Operations"
        />

        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
