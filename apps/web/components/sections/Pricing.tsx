'use client';

import { motion } from 'framer-motion';
import SectionWrapper from '@/components/layout/SectionWrapper';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#2ECC8F"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="flex-shrink-0 mt-0.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CrossIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className="flex-shrink-0 mt-0.5 text-white/20"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Pricing() {
  return (
    <SectionWrapper id="pricing" bg="bg-obsidian">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="font-mono text-[11px] text-emerald-bright uppercase tracking-[0.3em] mb-4">
          Simple Pricing
        </p>
        <h2 className="font-display text-[clamp(48px,6vw,80px)] text-ivory leading-[0.95] italic font-light">
          No surprises.
        </h2>
      </motion.div>

      <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard variant="neutral" className="p-8 md:p-10">
          <p className="font-mono text-xs text-champagne-dim uppercase tracking-widest">Free</p>
          <div className="flex items-end gap-2 mt-5">
            <span className="font-display text-[64px] md:text-[72px] leading-none text-ivory font-bold">
              $0
            </span>
            <span className="font-body text-champagne-dim/60 mb-3">/month</span>
          </div>
          <div className="border-t border-white/[0.07] my-8" />
          <div className="space-y-3.5">
            {(
              [
                [true, '3 analyses per month'],
                [true, 'Basic price prediction'],
                [true, 'eBay listings only'],
                [true, '30-day comparable sales'],
                [false, 'Confidence intervals'],
                [false, 'Bid timing strategy'],
                [false, 'Walk-away alerts'],
                [false, 'Market trends'],
                [false, 'All 6 platforms'],
              ] as const
            ).map(([avail, feat], i) => (
              <div key={i} className="flex items-start gap-3">
                {avail ? <CheckIcon /> : <CrossIcon />}
                <span
                  className={`font-body text-sm ${
                    avail ? 'text-champagne' : 'text-champagne-dim/30 line-through'
                  }`}
                >
                  {feat}
                </span>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-10" dataHover>
            Get started free
          </Button>
        </GlassCard>

        <GlassCard variant="emerald" className="p-8 md:p-10 relative">
          <div className="absolute -top-0.1 left-1/2 -translate-x-1/2 bg-emerald-bright text-obsidian font-mono text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full font-bold whitespace-nowrap">
            Most Popular
          </div>
          <p className="font-mono text-xs text-emerald-bright uppercase tracking-widest">Pro</p>
          <div className="flex items-end gap-2 mt-5">
            <span className="font-display text-[64px] md:text-[72px] leading-none text-ivory font-bold">
              $29
            </span>
            <span className="font-body text-champagne-dim/60 mb-3">/month</span>
          </div>
          
          <div className="border-t border-white/[0.07] my-8" />
          <div className="space-y-3.5">
            {[
              'Unlimited analyses',
              'Full confidence intervals',
              'Exact bid timing strategy',
              'Walk-away alerts',
              'Market trend direction',
              'All 6 platforms',
              'Photo + URL + description input',
              'Priority support',
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckIcon />
                <span className="font-body text-sm text-champagne">{f}</span>
              </div>
            ))}
          </div>
          <Button variant="primary" className="w-full mt-10" dataHover>
            Join waitlist &mdash; 3 months free
          </Button>
        </GlassCard>
      </div>

      <p className="font-display italic text-lg md:text-xl text-champagne-dim/50 text-center mt-12 max-w-xl mx-auto">
        Pricing launches with the full product. Waitlist members receive 3 months of Pro free.
      </p>
    </SectionWrapper>
  );
}
