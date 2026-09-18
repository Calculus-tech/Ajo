"use client";

import Link from "next/link";
import Image from "next/image";
import { usePollar } from "@pollar/react";
import WalletDrawer from "@/components/walletdrawer";

export default function Navbar() {
  const { isAuthenticated } = usePollar();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-lg bg-[#0A0B0F]/80 border-b border-white/[0.06]">
      <div className="flex items-center justify-between px-6 sm:px-10 py-4 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 group">
<Image
  src="/logo.png"
  alt="Ajo logo"
  width={32}
  height={32}
  className="rounded-lg"
/>
          <span className="text-lg font-semibold tracking-tight">Ajo</span>
        </Link>
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Testnet
            </span>
          )}
          <WalletDrawer />
        </div>
      </div>
    </header>
  );
}