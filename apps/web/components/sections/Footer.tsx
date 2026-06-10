export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-obsidian">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-3xl text-ivory">BidSmart</span>
              <sup className="font-mono text-[9px] text-emerald-bright">AI</sup>
            </div>
            <p className="font-display italic text-lg text-champagne-dim/60 mt-3 leading-relaxed max-w-[260px]">
              Intelligence for the serious collector.
            </p>
            <p className="font-mono text-[11px] text-champagne-dim/30 mt-8">&copy; 2025 BidSmart</p>
          </div>

          <div>
            <p className="font-mono text-[10px] text-champagne-dim/30 uppercase tracking-widest mb-5">
              Product
            </p>
            <nav className="flex flex-col gap-3">
              {['How It Works', 'Categories', 'Pricing', 'Reviews'].map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
                  className="font-body text-sm text-champagne-dim hover:text-ivory transition-colors duration-200 w-fit"
                >
                  {l}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="font-mono text-[10px] text-champagne-dim/30 uppercase tracking-widest mb-5">
              Legal
            </p>
            <nav className="flex flex-col gap-3 mb-8">
              {['Privacy Policy', 'Terms of Service', 'Contact'].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="font-body text-sm text-champagne-dim hover:text-ivory transition-colors duration-200 w-fit"
                >
                  {l}
                </a>
              ))}
            </nav>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-champagne-dim/30 hover:text-champagne-dim transition-colors duration-200"
                aria-label="Twitter/X"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M4 4l16 16M4 20L20 4" />
                </svg>
              </a>
              <a
                href="#"
                className="text-champagne-dim/30 hover:text-champagne-dim transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.05] mt-12 pt-8 flex flex-col md:flex-row justify-between gap-4">
          <p className="font-display italic text-base text-champagne-dim/30">
            Built for collectors, by collectors.
          </p>
          <p className="font-mono text-[11px] text-champagne-dim/20">
            All predictions are for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
