import './globals.css';
import type { Metadata } from 'next';
import CustomCursor from '@/components/CustomCursor';

export const metadata: Metadata = {
  metadataBase: new URL('https://bidsmart.ai'),
  title: 'BidSmart — AI Auction Intelligence for Serious Collectors',
  description:
    'Stop bidding blind. BidSmart predicts auction prices with 94% accuracy and tells you exactly when to bid, how much to offer, and when to walk away.',
  openGraph: {
    title: 'BidSmart — AI Auction Intelligence for Serious Collectors',
    description:
      'Stop bidding blind. BidSmart predicts auction prices with 94% accuracy and tells you exactly when to bid, how much to offer, and when to walk away.',
    url: 'https://bidsmart.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BidSmart — AI Auction Intelligence for Serious Collectors',
    description:
      'Stop bidding blind. BidSmart predicts auction prices with 94% accuracy and tells you exactly when to bid, how much to offer, and when to walk away.',
  },
  icons: {
    icon: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='4' fill='%230A0A0B'/><text x='16' y='23' text-anchor='middle' fill='%232ECC8F' font-family='Georgia' font-size='20' font-weight='bold'>B</text></svg>`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      style={{
        '--font-display': "'Cormorant Garamond', Georgia, serif",
        '--font-body': "'Instrument Sans', system-ui, sans-serif",
        '--font-mono': "'JetBrains Mono', monospace",
      } as React.CSSProperties}
    >
      <body className="font-body">
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
          }}
        />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
