import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export function Avatar({ src, alt, initials, size = 'md', className = '' }: AvatarProps) {
  const containerClass = `relative inline-flex items-center justify-center overflow-hidden rounded-full bg-onyx-light border border-white/10 ${sizeClasses[size]} ${className}`;

  if (src) {
    return (
      <div className={containerClass}>
        <img src={src} alt={alt || 'Avatar'} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <span className="font-medium text-ivory/80">
        {initials || '?'}
      </span>
    </div>
  );
}
