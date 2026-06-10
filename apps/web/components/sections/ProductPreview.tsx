'use client';

import { motion } from 'framer-motion';
import SectionWrapper from '@/components/layout/SectionWrapper';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import FeatureIcon from '@/components/ui/FeatureIcon';
import { useCountUp } from '@/hooks/useCountUp';

const features = [
  {
    type: 'price',
    title: 'Price Prediction',
    desc: 'Confidence intervals, not guesses. Know the realistic range before you bid a single dollar.',
  },
  {
    type: 'comps',
    title: 'Comparable Sales',
    desc: 'Real completed auctions, not active listings. The actual market, not wishful asking prices.',
  },
  {
    type: 'timing',
    title: 'Bid Timing',
    desc: 'Exactly when to place your first bid and when to snipe. Category-specific strategies.',
  },
  {
    type: 'alert',
    title: 'Walk-Away Alerts',
    desc: 'Your hard ceiling calculated from resale data. The most you should ever pay.',
  },
  {
    type: 'trends',
    title: 'Market Trends',
    desc: 'Know if a category is heating up or cooling before you commit your money.',
  },
  {
    type: 'platforms',
    title: '6 Platforms',
    desc: "eBay, Heritage, LiveAuctioneers, Sotheby's, Christie's, and Catawiki.",
  },
];

const comps = [
  { name: 'Rolex Sub 116610LN 2019 B&P, eBay', date: '14 days ago', price: '$8,250' },
  { name: 'Rolex Sub 116610LN 2018, Heritage', date: '21 days ago', price: '$7,900' },
  { name: 'Rolex Sub 116610LN 2020, Chrono24', date: '32 days ago', price: '$9,100' },
  { name: 'Rolex Sub 116610LN 2019, eBay', date: '44 days ago', price: '$8,600' },
];

export default function ProductPreview() {
  const [ref, count] = useCountUp(8400, 1800);

  return (
    <SectionWrapper id="product" bg="bg-obsidian">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <GlassCard variant="emerald" className="p-7 md:p-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="font-body text-sm text-champagne font-medium">
                Rolex Submariner 116610LN 2019
              </span>
              <div className="flex items-center gap-3">
                <Badge>eBay</Badge>
                <span className="relative flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-bright block" />
                  <span className="absolute w-2 h-2 rounded-full bg-emerald-bright animate-ping opacity-60" />
                  <span className="font-mono text-[10px] text-emerald-bright ml-1">LIVE</span>
                </span>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-mono text-[10px] text-emerald-bright/50 uppercase tracking-widest">
                Predicted sale price
              </p>
              <p
                ref={ref}
                className="font-display text-[60px] md:text-[72px] leading-none text-emerald-bright font-bold mt-1"
              >
                ${Math.round(count).toLocaleString()}
              </p>
              <p className="font-mono text-sm text-champagne-dim/60 mt-1">
                $7,900 &ndash; $9,100 range
              </p>
            </div>

            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span className="font-mono text-[10px] text-champagne-dim">Confidence</span>
                <span className="font-mono text-[10px] text-emerald-bright">92%</span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-bright rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: '92%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                />
              </div>
            </div>

            <div className="border-t border-white/[0.07] my-6" />

            {[
              ['01', 'Watch first \u2014 34% price spike in final 4 minutes'],
              ['02', 'Signal at $7,200 to anchor expectations'],
              ['03', 'Snipe at $8,750 in final 30 seconds'],
            ].map(([n, t]) => (
              <div
                key={n}
                className="flex items-start gap-3 py-3 border-b border-white/[0.05] last:border-0"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-mid flex items-center justify-center font-mono text-[10px] text-ivory flex-shrink-0 mt-0.5">
                  {n}
                </span>
                <span className="font-body text-sm text-champagne leading-relaxed">{t}</span>
              </div>
            ))}

            <GlassCard variant="burgundy" className="p-4 mt-4">
              <div className="flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-burgundy-bright flex-shrink-0"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <p className="font-body text-sm text-burgundy-bright">
                  <strong>Walk away above $8,750</strong> &mdash; negative ROI on resale
                </p>
              </div>
            </GlassCard>

            <div className="mt-5 rounded-xl overflow-hidden border border-white/[0.06]">
              {comps.map((c, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] last:border-0 ${
                    i % 2 === 0 ? 'bg-white/[0.02]' : ''
                  }`}
                >
                  <span className="font-body text-xs text-champagne-dim flex-1 min-w-0 truncate">
                    {c.name}
                  </span>
                  <span className="font-mono text-[10px] text-champagne-dim/40 flex-shrink-0">
                    {c.date}
                  </span>
                  <span className="font-mono text-sm font-medium text-champagne flex-shrink-0">
                    {c.price}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <p className="font-mono text-[11px] text-emerald-bright uppercase tracking-[0.3em] mb-4">
            Intelligence built in
          </p>
          <h2 className="font-display text-[clamp(40px,5vw,64px)] text-ivory leading-[0.95]">
            Everything
            <br />
            <em className="not-italic text-emerald-bright">you need</em>
          </h2>
          <div className="mt-10 space-y-0">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex gap-4 items-start py-6 border-b border-white/[0.06] last:border-0"
              >
                <div className="flex-shrink-0 text-emerald-bright mt-0.5">
                  <FeatureIcon type={f.type} />
                </div>
                <div>
                  <h4 className="font-display text-xl text-ivory font-bold">{f.title}</h4>
                  <p className="font-body text-sm text-champagne-dim mt-1 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
