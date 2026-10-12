'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminTopbar from '@/components/layout/AdminTopbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/router/RouterContext';
import toast from 'react-hot-toast';

export default function AdminLayout({ children }) {
  const { user, isMerchant, isAdmin, isHydrated } = useAuth();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const hasAccess = Boolean(user && (user.role === 'admin' || user.role === 'merchant' || isMerchant || isAdmin));

  useEffect(() => {
    if (isHydrated) {
      if (!user) {
        toast.error('Merchant or Admin authentication required.');
        router.replace('/login?role=merchant&redirect=/admin');
      } else if (!hasAccess) {
        toast.error('Access restricted. Merchant partner or Admin credentials required.');
        router.replace('/');
      }
    }
  }, [user, hasAccess, isHydrated, router]);

  if (!isHydrated || !hasAccess) {
    return (
      <div className="min-h-screen bg-[#1C1917] flex items-center justify-center p-4">
        <div className="text-center text-[#A8A29E]">
          <p className="text-xs uppercase tracking-widest font-mono">
            Verifying store partner access permissions...
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
          title="Atelier Operations"
        />

        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
