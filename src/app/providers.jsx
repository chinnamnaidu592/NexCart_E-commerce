'use client';

import React, { Suspense, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileMenu from '@/components/layout/MobileMenu';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { usePathname } from '@/router/RouterContext';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import Loading from './loading';

function LayoutShell({ children }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isMerchantRoute = pathname === '/merchant' || pathname.startsWith('/merchant/');
  const isPortalRoute = isAdminRoute || isMerchantRoute;
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#1C1917] selection:bg-[#1C1917] selection:text-[#F5F5F4]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1C1917',
            color: '#FAFAF9',
            borderRadius: '2px',
            border: '1px solid #44403C',
            padding: '12px 18px',
            fontSize: '0.8rem',
            fontWeight: '500',
            letterSpacing: '0.01em',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: { primary: '#15803D', secondary: '#FFFFFF' },
          },
          error: {
            iconTheme: { primary: '#B91C1C', secondary: '#FFFFFF' },
          },
        }}
      >
        {(toastItem) => (
          <ToastBar toast={toastItem}>
            {({ icon, message }) => (
              <>
                {icon}
                <div className="flex-1">{message}</div>
                <button
                  type="button"
                  aria-label="Close notification"
                  title="Close notification"
                  onClick={() => toast.dismiss(toastItem.id)}
                  className="ml-2 p-1 text-[#A8A29E] hover:text-[#FAFAF9] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FAFAF9]"
                >
                  ×
                </button>
              </>
            )}
          </ToastBar>
        )}
      </Toaster>

      {!isPortalRoute && (
        <>
          <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
          <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </>
      )}

      <main className="flex-1">{children}</main>

      {!isPortalRoute && !isAuthRoute && <Footer />}
    </div>
  );
}

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Suspense fallback={<Loading />}>
            <LayoutShell>{children}</LayoutShell>
          </Suspense>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
