'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const links = ['How It Works', 'Categories', 'Pricing', 'Reviews'];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-obsidian/90 backdrop-blur-2xl border-b border-white/[0.06]'
            : ''
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 h-16 flex items-center justify-between">
          <a href="/" className="flex items-baseline gap-1" data-hover>
            <span className="font-display font-bold text-2xl text-ivory tracking-tight">
              BidSmart
            </span>
            <sup className="font-mono text-[9px] text-emerald-bright">AI</sup>
          </a>

          <div className="hidden md:flex gap-10">
            {links.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                className="relative font-body text-[13px] text-champagne-dim hover:text-ivory transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-px after:bg-emerald-bright after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-200"
                data-hover
              >
                {link}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-5">
            <Link 
              href="/login" 
              className="font-body text-sm font-medium text-champagne-dim hover:text-ivory transition-colors duration-200"
            >
              Sign In
            </Link>
            <div className="w-px h-4 bg-white/10" />
            <Link href="/register">
              <Button variant="ghost" size="sm" dataHover>
                Get Started
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden text-ivory"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-obsidian z-[60] flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <button
              className="absolute top-5 right-6 text-ivory"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {links.map((link, i) => (
              <motion.a
                key={link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setMobileOpen(false)}
                className="font-display text-5xl text-ivory hover:text-emerald-bright transition-colors"
                data-hover
              >
                {link}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: links.length * 0.07 }}
              className="mt-8 flex flex-col items-center gap-4"
            >
              <Link href="/login" onClick={() => setMobileOpen(false)} className="font-body text-xl text-ivory">
                Sign In
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" size="md">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
