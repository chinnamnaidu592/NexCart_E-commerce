import React from 'react';

export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-[#E7E5E4]/70 rounded-xs ${className}`}
      aria-hidden="true"
    />
  );
}
