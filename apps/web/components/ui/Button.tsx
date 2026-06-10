'use client';

import { motion } from 'framer-motion';

type Variant = 'primary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  dataHover?: boolean;
  isLoading?: boolean;
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const variantClasses: Record<Variant, string> = {
  primary: 'group bg-emerald-mid text-ivory hover:bg-emerald-bright',
  ghost: 'border border-champagne/25 text-champagne hover:border-champagne/60 hover:text-ivory bg-transparent',
  danger: 'bg-burgundy-mid text-ivory hover:bg-burgundy-bright',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  onClick,
  type = 'button',
  disabled,
  dataHover = true,
  isLoading = false,
}: ButtonProps) {
  return (
    <motion.button
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : undefined}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      data-hover={dataHover && !isLoading ? '' : undefined}
      className={`relative flex items-center justify-center overflow-hidden font-body font-medium tracking-wide rounded-sm transition-all duration-200 ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${(disabled || isLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {variant === 'primary' && !isLoading && (
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"
        />
      )}
      <span className={`relative z-10 flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center z-20">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
    </motion.button>
  );
}
