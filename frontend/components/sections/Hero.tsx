'use client';

import dynamic from 'next/dynamic';
import { Suspense, Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
});

class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-obsidian">
      <div className="absolute inset-0 z-0">
        <SceneErrorBoundary>
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </SceneErrorBoundary>
      </div>

      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(10,10,11,0.1) 0%, rgba(10,10,11,0.65) 50%, rgba(10,10,11,0.96) 100%)',
        }}
      />

      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-[1280px] mx-auto w-full"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.13, delayChildren: 0.5 } },
        }}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
          }}
          className="font-mono text-[11px] text-emerald-bright tracking-[0.3em] uppercase mb-8"
        >
        
        </motion.p>

        <h1 className="font-display leading-[0.92] mb-10 w-full">
          {[
            { text: 'The Unfair', cls: 'text-ivory font-light italic' },
            { text: 'Advantage', cls: 'text-ivory font-bold' },
            { text: 'at Auction.', cls: 'text-champagne-dim font-light' },
          ].map(({ text, cls }) => (
            <div key={text} className="overflow-hidden">
              <motion.span
                className={`block text-[clamp(64px,9vw,128px)] ${cls}`}
                variants={{
                  hidden: { clipPath: 'inset(0 0 100% 0)' },
                  visible: {
                    clipPath: 'inset(0 0 0% 0)',
                    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                {text}
              </motion.span>
            </div>
          ))}
        </h1>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
          }}
          className="font-body text-base md:text-lg text-champagne-dim max-w-[500px] leading-relaxed mb-10"
        >
          BidSmart analyzes millions of completed sales to predict what any item will actually sell
          for &mdash; then builds your exact winning strategy.
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          className="flex flex-wrap gap-4 justify-center mb-10"
        >
          <Button variant="primary" size="lg" dataHover>
            Request Early Access
          </Button>
          <Button variant="ghost" size="lg" dataHover>
            See it in action
          </Button>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.6 } },
          }}
          className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-champagne-dim/50"
        >
          <span>94% accuracy</span>
          <span className="w-1 h-1 rounded-full bg-champagne-dim/30 inline-block" />
          <span>2.4M auctions analyzed</span>
          <span className="w-1 h-1 rounded-full bg-champagne-dim/30 inline-block" />
          <span>$680 avg. saved</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <div className="w-px h-12 bg-gradient-to-b from-champagne/20 to-transparent animate-pulse" />
        <span className="font-mono text-[9px] text-champagne-dim/30 tracking-[0.3em] uppercase">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
