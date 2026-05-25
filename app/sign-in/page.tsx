"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const raw = localStorage.getItem("inzozi_users");
      const users = raw ? JSON.parse(raw) : [];
      const found = users.find((u: any) => u.email === email && u.password === password);
      if (found) {
        // successful sign in -> go to dashboard
        router.push("/dashboard");
      } else {
        // not found -> redirect to sign-up with email prefilled
        router.push(`/sign-up?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      // fallback: go to sign-up
      router.push(`/sign-up?email=${encodeURIComponent(email)}`);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--brand-white)] px-6 py-16 text-[var(--brand-black)] sm:px-10 lg:px-14">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--brand-black)] bg-white p-10 shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-6 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-yellow)]">Welcome back</p>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Sign in to your creator dashboard</h1>
          <p className="mx-auto max-w-xl text-base text-[var(--brand-black)]/70">Access your page tools, review supporters, and launch new tiers with one simple sign-in experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 space-y-6">
          <label className="grid gap-3 text-sm font-medium">
            Email address
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="rounded-3xl border border-[var(--brand-black)] bg-[var(--brand-white)] px-4 py-3 text-sm text-[var(--brand-black)] outline-none focus:border-[var(--brand-yellow)]" />
          </label>
          <label className="grid gap-3 text-sm font-medium">
            Password
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="rounded-3xl border border-[var(--brand-black)] bg-[var(--brand-white)] px-4 py-3 text-sm text-[var(--brand-black)] outline-none focus:border-[var(--brand-yellow)]" />
          </label>

          <button type="submit" className="w-full rounded-full bg-[var(--brand-yellow)] px-6 py-4 text-sm font-semibold text-[var(--brand-black)] transition hover:brightness-95">
            Continue
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-3 text-center text-sm text-[var(--brand-black)]/80 sm:flex-row sm:justify-between sm:text-left">
          <p>New to Inzozi? <Link href="/start-page" className="font-semibold text-[var(--brand-black)] underline">Start a page</Link></p>
          <Link href="/learn" className="font-semibold text-[var(--brand-yellow)] underline">Learn how Inzozi works</Link>
        </div>
      </section>
    </main>
  );
}
