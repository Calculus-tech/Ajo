export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-24">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
        <span>Ajo — built on Pollar · Stellar</span>
        <div className="flex items-center gap-5">
          <span>Non-custodial</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span>Instant settlement</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span>Testnet demo</span>
        </div>
      </div>
    </footer>
  );
}