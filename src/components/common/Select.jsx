import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Accessible Select component with editorial styling and subtle caret.
 */
const Select = forwardRef(function Select(
  { id, label, error, helperText, options = [], className = '', required = false, ...props },
  ref
) {
  const selectId = id || props.name || Math.random().toString(36).substring(2, 9);
  const errorId = `${selectId}-error`;

  return (
    <div className="w-full text-left">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[11px] font-semibold text-[#57534E] uppercase tracking-[0.08em] mb-1.5"
        >
          {label} {required && <span className="text-[#991B1B]">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`appearance-none block w-full rounded-sm border text-sm py-2.5 pl-3.5 pr-10 bg-white text-[#1C1917] transition-colors duration-150 focus:outline-none ${
            error
              ? 'border-[#DC2626] text-[#7F1D1D] focus:border-[#991B1B] focus:ring-1 focus:ring-[#991B1B]'
              : 'border-[#D6D3D1] hover:border-[#A8A29E] focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917]'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#78716C]">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && (
        <p id={errorId} className="mt-1 text-xs text-[#DC2626] font-medium">
          {error}
        </p>
      )}
    </div>
  );
});

export default Select;
