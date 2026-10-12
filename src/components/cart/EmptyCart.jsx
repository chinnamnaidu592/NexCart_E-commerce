import React from 'react';
import EmptyState from '@/components/common/EmptyState';
import { ShoppingBag } from 'lucide-react';

export default function EmptyCart() {
  return (
    <EmptyState
      icon={ShoppingBag}
      title="Your shopping bag is empty"
      description="You have not allocated any objects to your acquisition basket. Explore our catalog to discover curated essentials."
      actionText="Browse Collection"
      actionHref="/products"
    />
  );
}
