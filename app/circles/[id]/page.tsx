"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { usePollar } from "@pollar/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WalletDrawer from "@/components/walletdrawer";
import type { Circle } from "@/lib/circles";

export default function CirclePage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, wallet, runTx, openEarnModal } = usePollar();

  const [circle, setCircle] = useState<Circle | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [joinName, setJoinName] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchCircle = useCallback(async () => {
    const res = await fetch(`/api/circles/${id}`);
    if (res.ok) setCircle(await res.json());
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchCircle();
  }, [fetchCircle]);

  const isAdmin = wallet?.address === circle?.adminAddress;
  const myMember = circle?.members.find((m) => m.address === wallet?.address);
  const isMember = !!myMember;
  const eligibleForPayout = circle?.members.filter((m) => !m.hasReceivedPayout) ?? [];

  useEffect(() => {
    if (eligibleForPayout.length > 0 && !selectedRecipient) {
      setSelectedRecipient(eligibleForPayout[0].address);
    }
  }, [eligibleForPayout, selectedRecipient]);

  async function handleJoin() {
    if (!circle || !wallet?.address || !joinName) return;
    setBusy(true);
    await fetch(`/api/circles/${circle.id}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: joinName, address: wallet.address }),
    });
    setBusy(false);
    fetchCircle();
  }

  async function handleContribute() {
    if (!circle || !wallet?.address) return;
    setBusy(true);
    setMessage(null);
    try {
      await runTx("payment", {
        destination: circle.adminAddress,
        amount: circle.contributionAmount,
        asset: { type: "native" },
      });
      await fetch(`/api/circles/${circle.id}/contribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: wallet.address }),
      });
      setMessage("Contribution confirmed.");
      fetchCircle();
    } catch {
      setMessage("Contribution failed — check your wallet balance.");
    } finally {
      setBusy(false);
    }
  }

  async function handlePayout() {
    if (!circle || !selectedRecipient) return;
    setBusy(true);
    setMessage(null);
    try {
      const total = (
        parseFloat(circle.contributionAmount) * circle.members.length
      ).toString();
      await runTx("payment", {
        destination: selectedRecipient,
        amount: total,
        asset: { type: "native" },
      });
      await fetch(`/api/circles/${circle.id}/payout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientAddress: selectedRecipient }),
      });
      const name = circle.members.find((m) => m.address === selectedRecipient)?.name;
      setMessage(`Payout released to ${name}.`);
      setSelectedRecipient("");
      fetchCircle();
    } catch {
      setMessage("Payout failed — check the pool balance.");
    } finally {
      setBusy(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center text-zinc-500 text-sm">
        Loading circle...
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center text-zinc-500 text-sm">
        Circle not found.
      </div>
    );
  }

  const paidCount = circle.members.filter((m) => m.paidThisCycle).length;
  const poolTotal = parseFloat(circle.contributionAmount) * circle.members.length;
  const progressPct = circle.members.length
    ? (paidCount / circle.members.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white">
      <nav className="flex items-center justify-between px-6 sm:px-10 py-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-black text-sm">
            A
          </div>
          <span className="text-lg font-semibold tracking-tight">Ajo</span>
        </div>
        <WalletDrawer />
      </nav>

      <main className="max-w-4xl mx-auto px-6 sm:px-10 pb-24">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
              Circle
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
              {circle.name}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
              Cycle
            </p>
            <p className="text-2xl font-bold text-zinc-50 tabular-nums">
              #{circle.cycleNumber}
            </p>
          </div>
        </div>

        <button
          onClick={copyLink}
          className="mb-8 text-xs text-zinc-500 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
        >
          {copied ? "Link copied ✓" : "Copy invite link to share with others"}
        </button>

        {!isAuthenticated ? (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-10 text-center">
            <p className="text-zinc-400 mb-5">
              Sign in to view and take part in this circle.
            </p>
            <div className="inline-block">
              <WalletDrawer />
            </div>
          </div>
        ) : !isAdmin && !isMember ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-white/[0.03] p-8 max-w-md">
            <h2 className="text-lg font-semibold text-zinc-100 mb-1">
              Join &quot;{circle.name}&quot;
            </h2>
            <p className="text-sm text-zinc-500 mb-5">
              {circle.contributionAmount} XLM · {circle.frequency}
            </p>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">
              Your display name
            </label>
            <input
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              placeholder="Emmanuel"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              onClick={handleJoin}
              disabled={busy || !joinName}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-black font-semibold transition-colors"
            >
              Join circle
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pool hero */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-[#0A0B0F] to-[#0A0B0F] p-7">
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl" />
              <div className="relative flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs font-medium text-emerald-400/80 uppercase tracking-wide mb-1.5">
                    Pool balance
                  </p>
                  <p className="text-4xl font-bold tracking-tight text-zinc-50 tabular-nums">
                    {poolTotal.toFixed(2)}{" "}
                    <span className="text-xl text-zinc-500">XLM</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
                    Members
                  </p>
                  <p className="text-lg font-semibold text-zinc-100">
                    {circle.members.length}
                  </p>
                </div>
              </div>
              <div className="relative flex items-center justify-between text-xs text-zinc-500 border-t border-white/5 pt-4">
                <span>
                  {circle.contributionAmount} XLM · {circle.frequency}
                </span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Non-custodial · Stellar
                </span>
              </div>
            </div>

            {/* Members list */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-zinc-100 text-sm">
                  Members
                </h2>
                <span className="text-sm text-zinc-500 tabular-nums">
                  {paidCount}/{circle.members.length} paid
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {circle.members.length === 0 ? (
                <p className="text-sm text-zinc-500 py-6 text-center">
                  No one has joined yet — share the invite link above.
                </p>
              ) : (
                <ul className="divide-y divide-white/5">
                  {circle.members.map((m, i) => (
                    <li
                      key={m.address}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-semibold text-zinc-400">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                            {m.name}
                            {m.hasReceivedPayout && (
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">
                                Received
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] font-mono text-zinc-600">
                            {m.address.slice(0, 6)}...{m.address.slice(-4)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          m.paidThisCycle
                            ? "text-emerald-400 bg-emerald-400/10"
                            : "text-zinc-500 bg-white/5"
                        }`}
                      >
                        {m.paidThisCycle ? "Paid" : "Pending"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Actions */}
            <div className="grid sm:grid-cols-2 gap-4">
              {isMember && (
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                  <h3 className="font-semibold text-zinc-100 text-sm mb-1">
                    Your contribution
                  </h3>
                  <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                    {myMember?.paidThisCycle
                      ? "You're settled for this cycle."
                      : `${circle.contributionAmount} XLM to the pool.`}
                  </p>
                  <button
                    onClick={handleContribute}
                    disabled={busy || myMember?.paidThisCycle}
                    className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm disabled:opacity-25 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors"
                  >
                    {myMember?.paidThisCycle ? "Paid ✓" : "Contribute"}
                  </button>
                </div>
              )}

              {isAdmin && (
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                  <h3 className="font-semibold text-zinc-100 text-sm mb-1">
                    Release payout
                  </h3>
                  {eligibleForPayout.length === 0 ? (
                    <p className="text-xs text-zinc-500">
                      Everyone has received a payout this round.
                    </p>
                  ) : (
                    <>
                      <select
                        value={selectedRecipient}
                        onChange={(e) => setSelectedRecipient(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-zinc-100 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      >
                        {eligibleForPayout.map((m) => (
                          <option key={m.address} value={m.address}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handlePayout}
                        disabled={
                          busy ||
                          circle.members.length === 0 ||
                          paidCount < circle.members.length
                        }
                        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                      >
                        Release payout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Earn */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-400/10 flex items-center justify-center text-lg">
                  📈
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100 text-sm">
                    Idle pot, earning yield
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Routed through DeFindex / Blend while it waits.
                  </p>
                </div>
              </div>
              <button
                onClick={() => openEarnModal()}
                className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-200 text-sm font-medium whitespace-nowrap transition-colors"
              >
                View Earn
              </button>
            </div>

            {message && (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm text-zinc-300">
                {message}
              </div>
            )}
          </div>
        )}
      </main>
      <footer />
    </div>
  );
}