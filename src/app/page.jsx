'use client';

import React from 'react';
import Hero from '@/components/home/Hero';
import Benefits from '@/components/home/Benefits';
import CategoryGrid from '@/components/home/CategoryGrid';
import TrendingShowcase from '@/components/home/TrendingShowcase';
import EditorialSpotlight from '@/components/home/EditorialSpotlight';
import PromoBanner from '@/components/home/PromoBanner';
import CustomerReviews from '@/components/home/CustomerReviews';
import FaqSection from '@/components/home/FaqSection';
import ErrorState from '@/components/common/ErrorState';
import { useProducts } from '@/hooks/useProducts';

export default function HomePage() {
  const { products, loading, error, refetch } = useProducts();

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ErrorState title="Could not load storefront" message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <Benefits />
      <CategoryGrid />
      <TrendingShowcase products={products} isLoading={loading} />
      <EditorialSpotlight />
      <PromoBanner />
      <CustomerReviews />
      <FaqSection />
    </div>
  );
}
