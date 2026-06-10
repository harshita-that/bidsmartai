'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '@/components/layout/SectionWrapper';
import CategoryIcon from '@/components/ui/CategoryIcon';

const categories = [
  { name: 'Watches', count: '340K+ sales' },
  { name: 'Comics', count: '180K+ sales' },
  { name: 'Sneakers', count: '520K+ sales' },
  { name: 'Coins', count: '410K+ sales' },
  { name: 'Fine Art', count: '95K+ sales' },
  { name: 'Trading Cards', count: '680K+ sales' },
  { name: 'Jewelry', count: '220K+ sales' },
  { name: 'Instruments', count: '75K+ sales' },
  { name: 'Antiques', count: '160K+ sales' },
  { name: 'Gaming', count: '290K+ sales' },
  { name: 'Sports Mem.', count: '380K+ sales' },
  { name: 'Wine', count: '48K+ sales' },
];

export default function Categories() {
  return (
    <SectionWrapper id="categories" bg="bg-burgundy-deep">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="font-display text-[clamp(48px,6vw,80px)] text-ivory leading-[0.9]">
          Every Category.
          <br />
          <span className="italic font-light text-champagne-dim">Every Platform.</span>
        </h2>
      </motion.div>

      <motion.div
        variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-12"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.name}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group bg-white/[0.03] border border-white/[0.07] hover:border-emerald-bright/30 rounded-xl p-4 md:p-5 flex flex-col items-center text-center transition-colors duration-200 cursor-default"
            data-hover
          >
            <div className="mb-3 text-champagne-dim/40 group-hover:text-emerald-bright transition-colors duration-200">
              <CategoryIcon name={cat.name} size={28} />
            </div>
            <span className="font-display text-sm md:text-base text-ivory leading-tight">
              {cat.name}
            </span>
            <span className="font-mono text-[9px] md:text-[10px] text-champagne-dim/40 mt-1">
              {cat.count}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-12 pt-10 border-t border-white/[0.06]">
        <p className="font-mono text-[10px] text-champagne-dim/30 uppercase tracking-widest mb-6 text-center">
          Works across
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 md:gap-x-10 gap-y-4">
          {["eBay", "Heritage Auctions", "LiveAuctioneers", "Sotheby's", "Christie's", "Catawiki"].map(
            (p, i, arr) => (
              <React.Fragment key={p}>
                <span className="font-display text-base md:text-lg italic text-champagne-dim/45 hover:text-champagne-dim/70 transition-colors cursor-default">
                  {p}
                </span>
                {i < arr.length - 1 && (
                  <span className="text-white/[0.1] hidden sm:inline text-lg">&middot;</span>
                )}
              </React.Fragment>
            )
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
