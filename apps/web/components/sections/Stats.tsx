'use client';

import { useCountUp } from '@/hooks/useCountUp';

const stats = [
  { target: 94, suffix: '%', label: 'Prediction accuracy', sub: 'across all categories' },
  { target: 2.4, suffix: 'M', decimals: 1, label: 'Auctions analyzed', sub: 'updated weekly' },
  { target: 680, prefix: '$', label: 'Average saved per win', sub: 'vs final sale price' },
  { target: 12, suffix: 's', label: 'Time to predict', sub: 'instant strategy report' },
];

function StatCell({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const [ref, count] = useCountUp(stat.target, 1800, stat.decimals ?? 0);

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center justify-center text-center py-16 px-8 ${
        index % 2 === 0 ? 'bg-obsidian' : 'bg-emerald-deep/10'
      } ${index < 3 ? 'md:border-r border-white/[0.06]' : ''} border-b md:border-b-0 border-white/[0.06]`}
    >
      <span className="font-display text-[clamp(48px,6vw,72px)] leading-none text-ivory font-bold">
        {stat.prefix ?? ''}
        {stat.decimals ? count.toFixed(stat.decimals) : Math.round(count)}
        {stat.suffix ?? ''}
      </span>
      <p className="font-body text-sm text-champagne-dim mt-3">{stat.label}</p>
      <p className="font-mono text-[10px] text-emerald-bright uppercase tracking-widest mt-1">
        {stat.sub}
      </p>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="border-b border-white/[0.06]">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <StatCell key={i} stat={s} index={i} />
        ))}
      </div>
    </section>
  );
}
