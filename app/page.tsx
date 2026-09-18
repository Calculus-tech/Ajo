"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePollar, WalletButton } from "@pollar/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const { isAuthenticated, wallet } = usePollar();
  const router = useRouter();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("Weekly");
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    if (!wallet?.address || !name || !amount) return;
    setCreating(true);
    const res = await fetch("/api/circles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        contributionAmount: amount,
        frequency,
        adminAddress: wallet.address,
      }),
    });
    const circle = await res.json();
    router.push(`/circles/${circle.id}`);
  }

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 sm:px-10 pb-24 pt-14 w-full">
        {/* Hero */}
        <div className="mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Built on Pollar · Stellar
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
            Group savings,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-100">
              earning while it waits.
            </span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
            Ajo digitizes the rotating savings circle. Create one, share the
            link, and everyone contributes each round. One member is paid
            per cycle — and the pool earns yield the whole time it waits.
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mb-14">
          {[
            { label: "Settlement", value: "Instant", icon: "⚡" },
            { label: "Custody", value: "Non-custodial", icon: "🔒" },
            { label: "Idle funds", value: "Earning yield", icon: "📈" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-4 hover:bg-white/[0.04] hover:border-white/[0.14] transition-colors"
            >
              <div className="text-lg mb-1.5">{s.icon}</div>
              <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">
                {s.label}
              </p>
              <p className="text-sm font-semibold text-zinc-100">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Create circle card */}
        {!isAuthenticated ? (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur p-10 text-center mb-20">
            <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 flex items-center justify-center text-2xl mx-auto mb-4">
              🤝
            </div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">
              Ready to start saving together?
            </h3>
            <p className="text-zinc-500 mb-6 text-sm">
              Sign in to create your first circle — no wallet setup required.
            </p>
            <div className="inline-block">
              <WalletButton />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur p-7 sm:p-8 space-y-5 max-w-lg mb-20">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <h2 className="text-lg font-semibold text-zinc-100">
                Start a new circle
              </h2>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">
                Circle name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Shop Savings Circle"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-shadow"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">
                  Amount (XLM)
                </label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="20"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-shadow"
                >
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={creating || !name || !amount}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold transition-all"
            >
              {creating ? "Creating..." : "Create Circle"}
            </button>
          </div>
        )}

        {/* How it works */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 mb-8">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Create a circle",
                desc: "Set your contribution amount and frequency. Get a shareable link instantly.",
              },
              {
                step: "02",
                title: "Everyone joins & contributes",
                desc: "Members sign in with email, no crypto knowledge needed, and pay in each round.",
              },
              {
                step: "03",
                title: "Payout & repeat",
                desc: "One member is paid the full pot each cycle — plus yield earned while it waited.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors"
              >
                <span className="text-3xl font-bold text-emerald-500/30 mb-3 block">
                  {s.step}
                </span>
                <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">
                  {s.title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}