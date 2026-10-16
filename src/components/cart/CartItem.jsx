import React from 'react';
import Link from '@/components/common/Link';
import QuantityControl from './QuantityControl';
import { formatCurrency } from '@/utils/formatters';
import { calculateItemSubtotal } from '@/utils/calculations';
import { Trash2 } from 'lucide-react';

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const itemTotal = calculateItemSubtotal(item.price, item.quantity);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 py-6 border-b border-[#E7E5E4] last:border-b-0">
      {/* Product Image & Title */}
      <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-sm bg-[#F5F5F4] border border-[#E7E5E4] p-2.5 flex items-center justify-center shrink-0">
          <img
            src={item.thumbnail || '/images/category_craft_objects_1791282688777.jpg'}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="max-h-full max-w-full object-contain mix-blend-multiply"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium text-[#1C1917] hover:underline truncate">
            <Link href={`/products/${item.id}`}>{item.title}</Link>
          </h4>
          <p className="text-xs text-[#78716C] mt-1 tabular-nums">
            Unit Price: <span className="text-[#1C1917] font-medium">{formatCurrency(item.price)}</span>
          </p>
        </div>
      </div>

      {/* Controls: Quantity & Subtotal */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-10">
        <QuantityControl
          quantity={item.quantity}
          max={item.stock || 99}
          onIncrease={() => onIncrease(item.id)}
          onDecrease={() => onDecrease(item.id)}
        />

        <div className="text-right min-w-[80px]">
          <span className="font-sans text-base font-semibold text-[#1C1917] block tabular-nums">
            {formatCurrency(itemTotal)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.id, item.title)}
          aria-label={`Remove ${item.title} from cart`}
          className="p-2 text-[#A8A29E] hover:text-[#991B1B] transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4 stroke-[1.5]" />
        </button>
      </div>
    </div>
  );
}
