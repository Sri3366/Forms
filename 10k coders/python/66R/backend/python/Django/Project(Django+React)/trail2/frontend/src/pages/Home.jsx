import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowUpRight, ScanLine, ShieldCheck, Trophy, Gift } from "lucide-react";
import { api } from "../lib/api";

const HERO_IMG =
  "https://images.pexels.com/photos/5872362/pexels-photo-5872362.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1500";

const steps = [
  {
    icon: ScanLine,
    title: "Pay ₹150 via UPI",
    body: "Scan the QR or send to our UPI ID. Capture your payment screenshot.",
  },
  {
    icon: Gift,
    title: "Pick a ₹150 product",
    body: "Choose any item worth your ticket value — yours regardless of outcome.",
  },
  {
    icon: ShieldCheck,
    title: "Wait for verification",
    body: "Our team verifies the payment and assigns your batch + ticket number.",
  },
  {
    icon: Trophy,
    title: "Live Draw at 3",
    body: "When the batch fills, one ticket is drawn. Winner takes the prize.",
  },
];

export default function Home() {
  const [batch, setBatch] = useState(null);

  useEffect(() => {
    api
      .get("/batch/current")
      .then((r) => setBatch(r.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b10]/70 via-[#0a0b10]/85 to-[#0a0b10]" />
        <div className="grain absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32 md:px-12 lg:px-24 lg:pt-36 lg:pb-44">
          <div className="fade-up max-w-3xl">
            <div
              className="glass mb-8 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-[#f2e3c6]/80"
              data-testid="hero-badge"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d4af37]" />
              Live Batch {batch?.batch_number ?? "—"} · {batch?.approved_count ?? 0}/
              {batch?.max_per_batch ?? 3} filled
            </div>

            <h1
              className="font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
              data-testid="hero-title"
            >
              The art of
              <br />
              <span className="shimmer-text italic">winning luxuriously.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/65">
              A boutique lottery experience. Pay ₹150, claim a curated product, and stand a
              chance to win the entire batch pool. No losers — only winners and gift recipients.
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                to="/participate"
                data-testid="hero-cta-play"
                className="btn-gold inline-flex items-center gap-2 rounded-full px-8 py-4 text-base"
              >
                Enter the Draw <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                to="/status"
                data-testid="hero-cta-status"
                className="btn-outline-gold inline-flex items-center gap-2 rounded-full px-8 py-4 text-base"
              >
                Track My Ticket
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-white/5 bg-[#0c0d14]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4 md:px-12">
          {[
            { v: "₹150", l: "Ticket Price" },
            { v: "3", l: "Players / Batch" },
            { v: "1", l: "Lucky Winner" },
            { v: "0", l: "Empty-handed" },
          ].map((s, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="font-serif text-4xl text-[#d4af37] md:text-5xl">{s.v}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.25em] text-white/45">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-12 lg:px-24">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-[#d4af37]">
              The Ritual
            </div>
            <h2 className="font-serif text-4xl tracking-tight lg:text-5xl">How it unfolds</h2>
          </div>

          <p className="max-w-md text-white/50">
            Four refined steps separate you from the velvet draw room. Each ticket guarantees a
            gift — winners take the cinematic spoils.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={i}
              className="glass group relative rounded-2xl p-8 transition-all duration-500 hover:border-[#d4af37]/40"
              data-testid={`step-${i}`}
            >
              <div className="absolute top-6 right-6 font-serif text-5xl text-white/5 transition-colors group-hover:text-[#d4af37]/20">
                0{i + 1}
              </div>

              <s.icon className="mb-6 h-7 w-7 text-[#d4af37]" />
              <h3 className="mb-3 font-serif text-2xl">{s.title}</h3>
              <p className="text-sm leading-relaxed text-white/55">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="mx-auto max-w-7xl px-6 pb-12 md:px-12 lg:px-24">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-12 md:p-16">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#d4af37]/15 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="font-serif text-3xl md:text-4xl">
                Batch {batch?.batch_number ?? 1} is open.
              </h3>
              <p className="mt-2 text-white/55">
                {(batch?.max_per_batch ?? 3) - (batch?.approved_count ?? 0)} seats remain at
                the table.
              </p>
            </div>

            <Link
              to="/participate"
              data-testid="cta-bottom-play"
              className="btn-gold inline-flex items-center gap-2 rounded-full px-8 py-4"
            >
              Reserve my ticket <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}