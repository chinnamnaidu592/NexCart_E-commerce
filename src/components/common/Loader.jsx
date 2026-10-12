import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ message = 'Loading catalog...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <Loader2 className="w-7 h-7 text-[#1C1917] animate-spin stroke-[1.5]" />
      {message && (
        <p className="text-xs uppercase tracking-widest font-mono text-[#78716C] animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center w-full">
        {content}
      </div>
    );
  }

  return content;
}
