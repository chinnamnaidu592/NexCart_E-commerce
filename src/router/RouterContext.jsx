'use client';

import { useMemo } from 'react';
import {
  usePathname as useNextPathname,
  useRouter as useNextRouter,
  useSearchParams as useNextSearchParams,
} from 'next/navigation';

export function useRouter() {
  const router = useNextRouter();
  return useMemo(
    () => ({
      push: (href, options) => router.push(href, options),
      replace: (href, options) => router.replace(href, options),
      back: () => router.back(),
      forward: () => router.forward(),
    }),
    [router]
  );
}

export function usePathname() {
  return useNextPathname() || '/';
}

export function useSearchParams() {
  return useNextSearchParams();
}
