'use client';

const row1 = [
  'Rolex Daytona 116500LN \u00B7 Predicted $38,200 \u00B7 Sold $37,800 \u00B7 Saved $4,100',
  'PSA 9 Charizard \u00B7 Predicted $7,800 \u00B7 Won at $7,600 \u00B7 Saved $1,200',
  'AJ1 Chicago 2015 DS Sz 10 \u00B7 Max bid $1,950 \u00B7 Won at $1,890',
  'Morgan Dollar MS65 \u00B7 Predicted $420 \u00B7 Won at $415',
  'AF #15 CGC 4.0 \u00B7 Predicted $32,000 \u00B7 Won at $31,200',
];

const row2 = [
  'Walk-away triggered \u00B7 PSA 10 Charizard above ceiling \u00B7 Saved $6,200',
  'Overbid risk \u00B7 Vintage GMT-Master II \u00B7 Prices down 12%',
  'Market cooling \u00B7 Jordan 4 Retro Lightning \u00B7 Above resale ceiling',
  'Walk-away triggered \u00B7 Shepard Fairey AP \u00B7 Sold 22% lower',
];

export default function Ticker() {
  return (
    <section className="border-y border-white/[0.05] bg-obsidian overflow-hidden select-none">
      <div className="py-3 border-b border-white/[0.04] overflow-hidden">
        <div
          className="flex whitespace-nowrap w-max"
          style={{ animation: 'marquee-left 50s linear infinite' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.animationPlayState = 'paused';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
          }}
        >
          {[...row1, ...row1, ...row1].map((item, i) => {
            const parts = item.split('\u00B7');
            return (
              <span key={i} className="inline-flex items-center gap-3 px-6 font-mono text-[11px]">
                <span className="text-champagne-dim/40">{parts[0]}</span>
                {parts.slice(1).map((part, j) => (
                  <span
                    key={j}
                    className={`${
                      part.includes('$') ? 'text-emerald-bright' : 'text-champagne-dim/40'
                    }`}
                  >
                    {'\u00B7'} {part.trim()}
                  </span>
                ))}
                <span className="text-emerald-bright ml-2">&#10003;</span>
                <span className="text-white/[0.08] ml-4">&#9670;</span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="py-3 overflow-hidden">
        <div
          className="flex whitespace-nowrap w-max"
          style={{ animation: 'marquee-right 65s linear infinite' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.animationPlayState = 'paused';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
          }}
        >
          {[...row2, ...row2, ...row2].map((item, i) => {
            const parts = item.split('\u00B7');
            return (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-6 font-mono text-[11px] text-champagne-dim/35"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C0392B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span className="text-burgundy-bright/80">{parts[0]?.trim()}</span>
                {parts.slice(1).map((part, j) => (
                  <span key={j}>
                    {'\u00B7'} {part.trim()}
                  </span>
                ))}
                <span className="text-white/[0.08] ml-4">&#9670;</span>
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
