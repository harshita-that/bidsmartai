'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';

export default function WaitlistCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert({ email, source: 'landing', created_at: new Date().toISOString() });
    setLoading(false);
    if (insertError && insertError.code !== '23505') {
      setError('Something went wrong. Please try again.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 w-1/2 h-full bg-emerald-deep" />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-burgundy-deep" />
        <div
          className="absolute top-0 bottom-0 left-[calc(50%-4px)] w-8 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent"
          style={{ transform: 'skewX(-2deg)' }}
        />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display text-[clamp(44px,7vw,96px)] text-ivory leading-[0.9]"
        >
          Your next auction
          <br />
          <span className="italic font-light text-champagne-dim">should be your best.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-body text-base md:text-lg text-champagne-dim/70 max-w-md mx-auto mt-6"
        >
          Join thousands of collectors and resellers who never overbid again.
        </motion.p>

        <div className="max-w-md mx-auto mt-10">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <form
                  onSubmit={handleSubmit}
                  autoComplete="off"
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="off"
                    className="flex-1 min-w-0 bg-obsidian/70 border border-white/[0.12] backdrop-blur-sm px-5 py-4 rounded-sm font-body text-sm text-ivory placeholder:text-champagne-dim/40 focus:outline-none focus:border-emerald-bright/50 transition-colors"
                  />
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={loading}
                    dataHover
                  >
                    {loading ? 'Joining...' : 'Join Waitlist \u2192'}
                  </Button>
                </form>
                {error && (
                  <p className="font-mono text-[11px] text-burgundy-bright mt-3">{error}</p>
                )}
                <p className="font-mono text-[11px] text-champagne-dim/30 mt-4">
                  4,800+ collectors already waiting.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8"
              >
                <svg width="56" height="56" viewBox="0 0 56 56" className="mx-auto" fill="none">
                  <circle
                    cx="28"
                    cy="28"
                    r="26"
                    stroke="#2ECC8F"
                    strokeWidth="1.5"
                    opacity="0.3"
                  />
                  <motion.path
                    d="M16 28l8 8 16-16"
                    stroke="#2ECC8F"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                  />
                </svg>
                <p className="font-display italic text-4xl text-ivory mt-5">
                  You&apos;re on the list.
                </p>
                <p className="font-body text-champagne-dim mt-2">
                  We&apos;ll be in touch before launch.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
