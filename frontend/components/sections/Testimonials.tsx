'use client';

import { motion } from 'framer-motion';
import SectionWrapper from '@/components/layout/SectionWrapper';
import GlassCard from '@/components/ui/GlassCard';

const testimonials = [
  {
    initials: 'MR',
    name: 'Marcus R.',
    role: 'Watch collector \u00B7 12 years',
    quote:
      'I would have paid $12,400 for that Rolex. BidSmart said walk at $9,000. It sold for $8,750. I have never trusted a tool this fast.',
    badge: 'Saved $4,200',
    color: 'emerald' as const,
    rotation: '-1.5deg',
    top: '0',
    left: '0',
    width: '42%',
    zIndex: 10,
  },
  {
    initials: 'JL',
    name: 'Jamie L.',
    role: 'Comic reseller \u00B7 eBay PowerSeller',
    quote:
      'Comics are brutal. BidSmart showed me 23 comps I had no idea existed and nailed the price within 3%. That AF #15 is now my best flip.',
    badge: 'Won at $31,200',
    color: 'emerald' as const,
    rotation: '0deg',
    top: '-24px',
    left: '50%',
    translateX: '-50%',
    width: '44%',
    zIndex: 20,
  },
  {
    initials: 'AK',
    name: 'Arjun K.',
    role: 'Sneaker reseller \u00B7 StockX Top Seller',
    quote:
      'First tool that tells me when a market is cooling before I overbid. Saved me from three bad buys last month alone.',
    badge: 'ROI +38%',
    color: 'burgundy' as const,
    rotation: '1deg',
    top: '20px',
    right: '0',
    width: '42%',
    zIndex: 10,
  },
];

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) {
  const badgeCls =
    testimonial.color === 'emerald'
      ? 'bg-emerald-bright/15 text-emerald-bright border border-emerald-bright/20'
      : 'bg-burgundy-bright/15 text-burgundy-bright border border-burgundy-bright/20';

  return (
    <GlassCard variant="emerald" className="p-7 md:p-8 relative h-full">
      <span
        className={`absolute top-5 right-5 font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full ${badgeCls}`}
      >
        {testimonial.badge}
      </span>
      <span
        aria-hidden
        className="absolute top-4 left-6 font-display text-[72px] text-ivory/[0.06] leading-none select-none"
      >
        &ldquo;
      </span>
      <p className="font-display italic text-[17px] text-champagne leading-relaxed pt-4 relative z-10">
        {testimonial.quote}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-mid flex items-center justify-center font-display font-bold text-sm text-ivory">
          {testimonial.initials}
        </div>
        <div>
          <p className="font-body font-medium text-ivory text-sm">{testimonial.name}</p>
          <p className="font-mono text-[11px] text-champagne-dim">{testimonial.role}</p>
        </div>
      </div>
    </GlassCard>
  );
}

export default function Testimonials() {
  return (
    <SectionWrapper id="reviews" bg="bg-emerald-deep">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="font-mono text-[11px] text-emerald-bright uppercase tracking-[0.3em] mb-4">
          From our users
        </p>
        <h2 className="font-display text-[clamp(48px,6vw,80px)] text-ivory leading-[0.95] italic font-light">
          They stopped losing.
        </h2>
      </motion.div>

      <div className="hidden md:block relative mt-16 h-[500px]">
        {testimonials.map((t, index) => (
          <motion.div
            key={t.name}
            className="absolute"
            style={{
              top: t.top,
              left: t.left,
              right: (t as any).right,
              width: t.width,
              zIndex: t.zIndex,
              transform: `translateX(${(t as any).translateX || '0'}) rotate(${t.rotation})`,
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{
              rotate: '0deg',
              y: -10,
              zIndex: 30,
              transition: { type: 'spring', stiffness: 300, damping: 25 },
            }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <TestimonialCard testimonial={t} />
          </motion.div>
        ))}
      </div>

      <div className="md:hidden flex flex-col gap-5 mt-12">
        {testimonials.map((t) => (
          <TestimonialCard key={t.name} testimonial={t} />
        ))}
      </div>
    </SectionWrapper>
  );
}
