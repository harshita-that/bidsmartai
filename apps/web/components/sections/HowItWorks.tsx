'use client';

import { motion } from 'framer-motion';
import SectionWrapper from '@/components/layout/SectionWrapper';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';

export default function HowItWorks() {
  return (
    <SectionWrapper id="how-it-works" bg="bg-emerald-deep">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="font-mono text-[11px] text-emerald-bright uppercase tracking-[0.3em] mb-4">
          The Method
        </p>
        <h2 className="font-display text-[clamp(48px,6vw,80px)] text-ivory leading-[0.95] italic font-light">
          How It Works
        </h2>
      </motion.div>

      <div className="mt-14 flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-3"
          >
            <GlassCard variant="neutral" className="p-8 md:p-10 relative h-full min-h-[280px]">
              <span
                aria-hidden
                className="absolute -top-2 right-3 font-display text-[110px] leading-none text-white/[0.04] select-none pointer-events-none"
              >
                01
              </span>
              <div className="relative z-10">
                <div className="text-emerald-bright mb-5 w-7 h-7">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <h3 className="font-display text-[28px] md:text-3xl text-ivory font-bold">
                  Submit Anything
                </h3>
                <p className="font-body text-champagne-dim mt-3 leading-relaxed text-[15px] max-w-[420px]">
                  Paste an eBay or Heritage Auctions URL, upload a photo, or describe the item in
                  plain text. BidSmart identifies it instantly.
                </p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {['eBay', 'Heritage', 'LiveAuctioneers', 'Photo upload', 'Description'].map(
                    (t) => (
                      <Badge key={t}>{t}</Badge>
                    )
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:col-span-2 md:mt-14"
          >
            <GlassCard variant="emerald" className="p-8 md:p-10 relative h-full min-h-[280px]">
              <span
                aria-hidden
                className="absolute -top-2 right-3 font-display text-[110px] leading-none text-white/[0.04] select-none pointer-events-none"
              >
                02
              </span>
              <div className="relative z-10">
                <div className="text-emerald-bright mb-5">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <rect x="9" y="9" width="6" height="6" />
                    <line x1="9" y1="1" x2="9" y2="4" />
                    <line x1="15" y1="1" x2="15" y2="4" />
                    <line x1="9" y1="20" x2="9" y2="23" />
                    <line x1="15" y1="20" x2="15" y2="23" />
                    <line x1="20" y1="9" x2="23" y2="9" />
                    <line x1="20" y1="14" x2="23" y2="14" />
                    <line x1="1" y1="9" x2="4" y2="9" />
                    <line x1="1" y1="14" x2="4" y2="14" />
                  </svg>
                </div>
                <h3 className="font-display text-[28px] md:text-3xl text-ivory font-bold">
                  Intelligence at Scale
                </h3>
                <p className="font-body text-champagne-dim mt-3 leading-relaxed text-[15px]">
                  Cross-references 2.4M completed sales across six platforms. Adjusts for condition,
                  platform fees, recency, and market trend direction.
                </p>
                <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-wrap gap-2">
                  {['Condition', 'Platform fees', 'Trend bias', 'Recency'].map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] text-champagne-dim/50 bg-white/[0.04] px-2.5 py-1 rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <GlassCard variant="neutral" className="p-8 md:p-12 relative">
            <span
              aria-hidden
              className="absolute -top-2 right-6 font-display text-[110px] leading-none text-white/[0.04] select-none pointer-events-none"
            >
              03
            </span>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
              <div>
                <div className="text-emerald-bright mb-5">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                    <line x1="22" y1="12" x2="18" y2="12" />
                    <line x1="6" y1="12" x2="2" y2="12" />
                    <line x1="12" y1="6" x2="12" y2="2" />
                    <line x1="12" y1="22" x2="12" y2="18" />
                  </svg>
                </div>
                <h3 className="font-display text-[28px] md:text-4xl text-ivory font-bold">
                  Your Exact Strategy
                </h3>
                <p className="font-body text-champagne-dim mt-3 leading-relaxed text-[15px]">
                  Price prediction with confidence interval. Your first bid amount. Exact snipe
                  timing. Your hard ceiling. Walk-away signal. Never guess again.
                </p>
              </div>
              <div className="bg-obsidian/60 rounded-xl p-5 md:p-6 border border-white/[0.07]">
                <p className="font-mono text-[10px] text-emerald-bright/60 uppercase tracking-widest">
                  Predicted sale price
                </p>
                <p className="font-display text-5xl text-emerald-bright font-bold mt-1 leading-none">
                  $8,400
                </p>
                <p className="font-mono text-xs text-champagne-dim/50 mt-1">
                  $7,900 &ndash; $9,100 &middot; 92% confidence
                </p>
                <div className="h-1 bg-white/[0.06] rounded-full mt-4 mb-4 overflow-hidden">
                  <div className="h-full w-[92%] bg-emerald-bright rounded-full" />
                </div>
                {[
                  '01 \u00B7 Watch \u2014 34% spike in final 4 min',
                  '02 \u00B7 Signal at $7,200 to anchor',
                  '03 \u00B7 Snipe at $8,750 in final 30s',
                ].map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-3 py-2 border-b border-white/[0.05] last:border-0"
                  >
                    <span className="font-mono text-[10px] text-emerald-bright/60 flex-shrink-0">
                      {s.slice(0, 2)}
                    </span>
                    <span className="font-body text-xs text-champagne-dim">{s.slice(5)}</span>
                  </div>
                ))}
                <div className="mt-4 bg-burgundy-deep/60 border border-burgundy-bright/[0.2] rounded-lg px-4 py-2.5 flex items-center gap-2">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C0392B"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <p className="font-mono text-[10px] text-burgundy-bright">
                    Walk away above $8,750
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
