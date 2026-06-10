import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-ivory/80 ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-onyx-light/50 border border-white/10 rounded-sm
              px-4 py-2.5 text-ivory placeholder:text-ivory/30
              focus:outline-none focus:ring-1 focus:border-emerald-mid focus:ring-emerald-mid
              transition-all duration-200
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-burgundy-mid focus:border-burgundy-mid focus:ring-burgundy-mid' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-burgundy-bright ml-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
