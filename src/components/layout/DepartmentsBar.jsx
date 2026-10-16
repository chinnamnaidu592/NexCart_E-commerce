import React, { useState, useEffect, useRef } from 'react';
import Link from '@/components/common/Link';
import { usePathname, useSearchParams } from '@/router/RouterContext';
import { DEPARTMENTS, getDepartmentBySlug } from '@/constants/departments';

export default function DepartmentsBar({ className = '' }) {
  const pathname = usePathname();
  const cleanPath = (pathname || '').replace(/\/+$/, '') || '/';

  // Visible ONLY on products, department/category, deals, and best-seller pages.
  const isAllowedPage =
    cleanPath === '/products' ||
    cleanPath.startsWith('/products/') ||
    cleanPath.startsWith('/department/') ||
    cleanPath.startsWith('/departments/') ||
    cleanPath === '/department' ||
    cleanPath === '/departments' ||
    cleanPath === '/deals' ||
    cleanPath === '/top-deals' ||
    cleanPath === '/bestsellers' ||
    cleanPath === '/best-sellers';

  if (!isAllowedPage) return null;

  return <DepartmentsBarContent className={className} pathname={pathname} />;
}

function DepartmentsBarContent({ className, pathname }) {
  const searchParams = useSearchParams();
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const isScrolledDownRef = useRef(false);
  const lastScrollYRef = useRef(0);

  // Robust, zero-excess-state scroll listener
  useEffect(() => {
    // Reset state and refs on route change so subnav is always visible initially
    setIsScrolledDown(false);
    isScrolledDownRef.current = false;
    lastScrollYRef.current = typeof window !== 'undefined' ? window.scrollY : 0;

    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollYRef.current;
      const diff = currentScrollY - previousScrollY;

      // Rule 1: At or near the top of the page (within 50px), ALWAYS show sub-nav
      if (currentScrollY <= 50) {
        if (isScrolledDownRef.current) {
          isScrolledDownRef.current = false;
          setIsScrolledDown(false);
        }
        lastScrollYRef.current = currentScrollY;
        ticking = false;
        return;
      }

      // Rule 2: Ignore micro-jitters (< 10px scroll difference)
      if (Math.abs(diff) < 10) {
        ticking = false;
        return;
      }

      // Rule 3: User scrolling down -> hide behind navbar (ONLY update state once if not already hidden)
      if (diff > 0 && currentScrollY > 70) {
        if (!isScrolledDownRef.current) {
          isScrolledDownRef.current = true;
          setIsScrolledDown(true);
        }
      }
      // Rule 4: User scrolling up -> reveal sub-nav (ONLY update state once if currently hidden)
      else if (diff < 0) {
        if (isScrolledDownRef.current) {
          isScrolledDownRef.current = false;
          setIsScrolledDown(false);
        }
      }

      lastScrollYRef.current = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  // Determine if a department is active from the URL (/department/[slug] or ?dept=...)
  const activeSlug = pathname.startsWith('/department/')
    ? pathname.replace('/department/', '').split('/')[0]
    : pathname.startsWith('/departments/')
    ? pathname.replace('/departments/', '').split('/')[0]
    : searchParams.get('dept') || searchParams.get('category') || null;

  const currentActiveDept = activeSlug ? getDepartmentBySlug(activeSlug) : null;

  return (
    <div
      className={`relative z-10 bg-[#FAFAF9] border-b border-[#E7E5E4] transition-transform duration-300 ease-in-out py-2 sm:py-2.5 ${
        isScrolledDown ? '-translate-y-full pointer-events-none' : 'translate-y-0'
      } ${className}`}
      aria-label="Department navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 6 Clean Department Cards below Navbar with balanced box sizing */}
        <div className="grid grid-cols-3 sm:grid-cols-6 items-center gap-2 sm:gap-2.5">
          {DEPARTMENTS.map((dept) => {
            const isActive = currentActiveDept?.id === dept.id;

            return (
              <Link
                key={dept.id}
                href={`/department/${dept.slug}`}
                className={`group relative flex items-center justify-center h-12 sm:h-14 rounded-xs overflow-hidden border transition-colors duration-200 select-none bg-stone-900 ${
                  isActive ? 'border-[#1C1917]' : 'border-[#E7E5E4] hover:border-[#D6D3D1]'
                }`}
                title={dept.name}
              >
                {/* 1. Reverted Category Image */}
                <img
                  src={dept.image}
                  alt={dept.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = dept.fallbackImage;
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-[0.7] group-hover:brightness-[0.6]"
                />

                {/* 2. Simple background color change on hover (no glowing borders) */}
                <div
                  className={`absolute inset-0 transition-colors duration-200 ${
                    isActive ? 'bg-black/70' : 'bg-black/50 group-hover:bg-black/70'
                  }`}
                />

                {/* 3. Category Name on Top in Capital Letters */}
                <div className="relative z-10 px-1.5 text-center w-full">
                  <span className="block text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-white drop-shadow-sm truncate">
                    {dept.shortName || dept.name}
                  </span>
                </div>

                {/* 4. Active Indicator Accent Bar (simple, no glow) */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
