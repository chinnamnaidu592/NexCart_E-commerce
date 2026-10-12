'use client';

import React from 'react';
import EmptyState from '@/components/common/EmptyState';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <EmptyState
        icon={Compass}
        title="404 - Page Not Found"
        description="The page you are looking for doesn't exist, has been removed, or is temporarily unavailable."
        actionText="Back to NexCart Home"
        actionHref="/"
      />
    </div>
  );
}
