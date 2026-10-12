import React from 'react';
import Button from './Button';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error loading this data. Please check your connection and try again.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 sm:p-14 border border-[#FEE2E2] rounded-md bg-[#FEF2F2]/40 max-w-lg mx-auto my-12">
      <div className="w-12 h-12 rounded-sm bg-[#FEE2E2] text-[#991B1B] flex items-center justify-center mb-5">
        <AlertCircle className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="font-sans text-2xl font-normal text-[#1C1917] mb-2">{title}</h3>
      <p className="text-sm text-[#78716C] max-w-sm mb-8 leading-relaxed">{message}</p>

      {onRetry && (
        <Button variant="outline" size="md" onClick={onRetry}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
