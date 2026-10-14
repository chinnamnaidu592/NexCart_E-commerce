import React, { forwardRef, useId } from 'react';

/**
 * Accessible Input component with bespoke editorial styling,
 * hairline borders, and refined typographic labeling.
 */
const Input = forwardRef(function Input(
  {
    id,
    label,
    error,
    helperText,
    type = 'text',
    className = '',
    leftIcon,
    rightIcon,
    required = false,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || props.name || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="w-full text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-semibold text-[#57534E] uppercase tracking-[0.08em] mb-1.5"
        >
          {label} {required && <span className="text-[#991B1B]">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A8A29E]">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`block w-full rounded-xs border text-xs sm:text-sm transition-colors duration-150 ${
            leftIcon ? 'pl-9' : 'pl-3'
          } ${rightIcon ? 'pr-9' : 'pr-3'} py-2 bg-white text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none ${
            error
              ? 'border-[#DC2626] text-[#7F1D1D] focus:border-[#991B1B] focus:ring-1 focus:ring-[#991B1B]'
              : 'border-[#D6D3D1] hover:border-[#A8A29E] focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917]'
          } ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} className="mt-1 text-xs text-[#DC2626] font-medium tracking-wide">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="mt-1 text-xs text-[#78716C]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
