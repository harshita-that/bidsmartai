interface Props {
  name: string;
  size?: number;
  className?: string;
}

const iconStyle = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function IconSVG({ name, size = 24 }: { name: string; size: number }) {
  switch (name) {
    case 'Watches':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" {...iconStyle}>
          <circle cx="12" cy="12" r="7" />
          <polyline points="12 9 12 12 13.5 13.5" />
          <path d="M9 2h6v3H9zM9 19h6v3H9z" />
        </svg>
      );
    case 'Comics':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" {...iconStyle}>
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          <line x1="8" y1="7" x2="16" y2="7" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      );
    case 'Sneakers':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" {...iconStyle}>
          <path d="M2 16l2-7a3 3 0 013-3h0a3 3 0 013 3v1" />
          <path d="M10 10h7a4 4 0 014 4v2H2v-2a4 4 0 014-4" />
          <path d="M2 16h20v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case 'Coins':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" {...iconStyle}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6v12M9.5 9.5a4 4 0 015 0M9.5 14.5a4 4 0 005 0" />
        </svg>
      );
    case 'Fine Art':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" {...iconStyle}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case 'Trading Cards':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" {...iconStyle}>
          <rect x="2" y="3" width="12" height="16" rx="1" />
          <rect x="6" y="5" width="12" height="16" rx="1" />
          <line x1="8" y1="9" x2="14" y2="9" />
          <line x1="8" y1="12" x2="12" y2="12" />
        </svg>
      );
    case 'Jewelry':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" {...iconStyle}>
          <path d="M6 3h12l4 6-10 13L2 9l4-6z" />
          <line x1="2" y1="9" x2="22" y2="9" />
        </svg>
      );
    case 'Instruments':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" {...iconStyle}>
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );
    case 'Antiques':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" {...iconStyle}>
          <path d="M8 2c-2 2-3 5-3 8s1 4 3 5c1 .5 1 1.5 0 2-2 1-3 3-3 5h12c0-2-1-4-3-5-1-.5-1-1.5 0-2 2-1 3-2 3-5s-1-6-3-8" />
          <line x1="6" y1="22" x2="18" y2="22" />
        </svg>
      );
    case 'Gaming':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" {...iconStyle}>
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <line x1="6" y1="10" x2="6" y2="14" />
          <line x1="4" y1="12" x2="8" y2="12" />
          <circle cx="16" cy="10" r="1" />
          <circle cx="18" cy="12" r="1" />
        </svg>
      );
    case 'Sports Mem.':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" {...iconStyle}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 010 18" />
          <path d="M12 3a9 9 0 000 18" />
          <line x1="12" y1="3" x2="12" y2="21" />
        </svg>
      );
    case 'Wine':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" {...iconStyle}>
          <path d="M8 22h8M12 11v11" />
          <path d="M7 2h10l-1.68 7.39A2 2 0 0113.36 11H10.64a2 2 0 01-1.96-1.61L7 2z" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" {...iconStyle}>
          <path d="M6 3h12l4 6-10 13L2 9l4-6z" />
        </svg>
      );
  }
}

export default function CategoryIcon({ name, size = 24, className }: Props) {
  return (
    <div className={className}>
      <IconSVG name={name} size={size} />
    </div>
  );
}
