"use client";

import { useState } from "react";
import { usePollar } from "@pollar/react";

export default function WalletDrawer() {
  const {
    isAuthenticated,
    wallet,
    login,
    logout,
    openSendModal,
    openReceiveModal,
    openWalletBalanceModal,
    openTxHistoryModal,
    openEarnModal,
  } = usePollar();

  const [open, setOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => login({ provider: "email" })}
        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold transition-colors"
      >
        Sign in
      </button>
    );
  }

  const short = wallet?.address
    ? `${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)}`
    : "";

  const actions = [
    { label: "Send", icon: "↗", action: openSendModal },
    { label: "Receive", icon: "↙", action: openReceiveModal },
    { label: "Wallet balance", icon: "◈", action: openWalletBalanceModal },
    { label: "Transaction history", icon: "≡", action: openTxHistoryModal },
    { label: "Earn", icon: "📈", action: openEarnModal },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-mono text-zinc-200 transition-colors"
      >
        {short}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-full max-w-sm h-full bg-[#0F1014] border-l border-white/10 p-6 flex flex-col animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold text-zinc-100">Wallet</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-zinc-400"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 mb-6">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
                Address
              </p>
              <p className="text-sm font-mono text-emerald-400 break-all">
                {wallet?.address}
              </p>
            </div>

            <div className="space-y-1.5">
              {actions.map((a) => (
                <button
                  key={a.label}
                  onClick={() => {
                    a.action();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-left transition-colors"
                >
                  <span className="text-lg">{a.icon}</span>
                  <span className="text-sm font-medium text-zinc-200">
                    {a.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5">
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="w-full px-4 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}