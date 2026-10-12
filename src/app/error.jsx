'use client';

import React from 'react';
import ErrorState from '@/components/common/ErrorState';

export default function ErrorBoundary({ error, reset }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <ErrorState
        title="Application Error"
        message={error?.message || 'An unexpected runtime issue occurred. Please try reloading the page.'}
        onRetry={reset || (() => window.location.reload())}
      />
    </div>
  );
}
