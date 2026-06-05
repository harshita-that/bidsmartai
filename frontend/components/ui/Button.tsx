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
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-hover={dataHover ? '' : undefined}
      className={`relative overflow-hidden font-body font-medium tracking-wide rounded-sm transition-all duration-200 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {variant === 'primary' && (
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
