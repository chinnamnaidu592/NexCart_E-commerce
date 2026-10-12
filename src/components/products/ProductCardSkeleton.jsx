import React from 'react';
import Skeleton from '@/components/common/Skeleton';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 space-y-3">
      <Skeleton className="w-full aspect-square rounded-xl bg-slate-100" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-2 w-14 bg-slate-100" />
          <Skeleton className="h-2 w-8 bg-slate-100" />
        </div>
        <Skeleton className="h-4 w-4/5 bg-slate-100" />
        <Skeleton className="h-3 w-1/2 bg-slate-100" />
      </div>
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
        <Skeleton className="h-5 w-16 bg-slate-100" />
        <Skeleton className="h-8 w-8 rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}
