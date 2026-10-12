import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function QuantityControl({
  quantity = 1,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
}) {
  const isMin = quantity <= min;
  const isMax = quantity >= max;

  return (
    <div className="inline-flex items-center border border-[#E7E5E4] rounded-sm bg-white">
      <button
        type="button"
        disabled={isMin}
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className="p-2 text-[#78716C] hover:text-[#1C1917] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <Minus className="w-3.5 h-3.5 stroke-[1.5]" />
      </button>

      <span className="w-8 sm:w-10 text-center text-xs font-mono font-medium text-[#1C1917] select-none tabular-nums">
        {quantity}
      </span>

      <button
        type="button"
        disabled={isMax}
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="p-2 text-[#78716C] hover:text-[#1C1917] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
      </button>
    </div>
  );
}
