"use client";

import Link from "next/link";
import { usePollar } from "@pollar/react";
import WalletDrawer from "@/components/walletdrawer";

export default function Navbar() {
  const { isAuthenticated } = usePollar();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-lg bg-[#0A0B0F]/80 border-b border-white/[0.06]">
      <div className="flex items-center justify-between px-6 sm:px-10 py-4 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-black text-sm shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
            A
          </div>
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