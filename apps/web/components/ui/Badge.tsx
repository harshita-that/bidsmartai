export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center bg-white/[0.05] border border-white/[0.1] rounded-full px-3 py-1 font-mono text-[10px] text-champagne-dim uppercase tracking-wider">
      {children}
    </span>
  );
}
