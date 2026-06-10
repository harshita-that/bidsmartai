'use client';

import { motion } from 'framer-motion';

type Variant = 'neutral' | 'emerald' | 'burgundy';

interface GlassCardProps {
  variant?: Variant;
  hover?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  neutral: 'bg-white/[0.03] border border-white/[0.07]',
  emerald: 'bg-emerald-deep/50 border border-emerald-bright/[0.15]',
  burgundy: 'bg-burgundy-deep/50 border border-burgundy-bright/[0.15]',
};

export default function GlassCard({
  variant = 'neutral',
  hover = false,
  className = '',
  children,
}: GlassCardProps) {
  const base = `backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-300 ${variantClasses[variant]} ${className}`;

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -6, boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={base}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={base}>{children}</div>;
}
