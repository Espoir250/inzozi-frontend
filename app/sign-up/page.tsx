"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const preEmail = "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneCode, setPhoneCode] = useState("+250");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [countryOfBirth, setCountryOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // read search param on client to prefill email
    try {
      const params = new URLSearchParams(window.location.search);
      const pe = params.get("email");
      if (pe) setEmail(pe);
    } catch (e) {
      // ignore
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = { firstName, lastName, username, phone: `${phoneCode} ${phone}`, dob, countryOfBirth, address, email, password };
    try {
      const raw = localStorage.getItem("inzozi_users");
      const users = raw ? JSON.parse(raw) : [];
      users.push(user);
      localStorage.setItem("inzozi_users", JSON.stringify(users));
      // go to dashboard after signup
      router.push("/dashboard");
    } catch (err) {
      alert("Could not create account locally.");
    }
  }

  return (
    <main className="min-h-screen bg-[var(--brand-white)] px-6 py-12 text-[var(--brand-black)] sm:px-10 lg:px-14">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 items-start">
          {/* Left: marketing */}
          <div className="rounded-[1rem] p-8 lg:p-12">
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-yellow)]">Create</p>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl">Bring your ideas to paying supporters</h1>
            <p className="mt-4 max-w-xl text-base text-[var(--brand-black)]/80">Create a page to publish exclusive content, build recurring revenue with membership tiers, and interact directly with your fans.</p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-yellow)] text-[var(--brand-black)] font-semibold">1</span>
                <div>
                  <p className="font-semibold">Set up membership tiers</p>
                  <p className="text-sm text-[var(--brand-black)]/75">Offer exclusive posts, early access, and rewards.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-yellow)] text-[var(--brand-black)] font-semibold">2</span>
                <div>
                  <p className="font-semibold">Get paid monthly</p>
                  <p className="text-sm text-[var(--brand-black)]/75">Supporters subscribe and payments are recurring.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-yellow)] text-[var(--brand-black)] font-semibold">3</span>
                <div>
                  <p className="font-semibold">Grow a community</p>
                  <p className="text-sm text-[var(--brand-black)]/75">Share behind-the-scenes updates and build loyalty.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right: signup form */}
          <div className="rounded-[1rem] border border-[var(--brand-black)] bg-[var(--brand-white)] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.04)]">
            <h2 className="text-2xl font-semibold">Create your account</h2>
            <p className="mt-2 text-sm text-[var(--brand-black)]/75">Start with an email — you can set up your creator page after.</p>

            <div className="mt-6 space-y-3">
              <button type="button" className="w-full inline-flex items-center justify-center gap-3 rounded-full border border-[var(--brand-black)] bg-[var(--brand-white)] px-4 py-3 text-sm font-medium text-[var(--brand-black)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="opacity-80"><path d="M21.6 12.227c0-.68-.06-1.333-.175-1.96H12v3.7h5.3c-.23 1.25-.94 2.317-1.99 3.036v2.51h3.22c1.89-1.742 2.99-4.3 2.99-7.286z" fill="#4285F4"/><path d="M12 22c2.7 0 4.98-.9 6.64-2.44l-3.22-2.51c-.9.6-2.04.96-3.42.96-2.62 0-4.84-1.77-5.63-4.15H3.01v2.61C4.7 19.96 8.06 22 12 22z" fill="#34A853"/><path d="M6.37 13.86A7.27 7.27 0 016 12c0-.67.11-1.32.37-1.86V7.52H3.01A10.99 10.99 0 002 12c0 1.77.41 3.45 1.12 4.98l3.24-3.12z" fill="#FBBC05"/><path d="M12 6.5c1.48 0 2.84.51 3.9 1.52l2.92-2.92C16.98 3.47 14.7 2 12 2 8.06 2 4.7 4.04 3.01 7.52l3.36 2.62C7.16 8.27 9.38 6.5 12 6.5z" fill="#EA4335"/></svg>
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--brand-white)] px-3 text-sm text-[var(--brand-black)]/60">or</div>
                <div className="h-px bg-[var(--brand-black)]/10" />
              </div>
            
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block text-sm font-medium">
                Email address
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required className="mt-2 w-full rounded-2xl border border-[var(--brand-black)] bg-[var(--brand-white)] px-4 py-3 text-sm text-[var(--brand-black)] outline-none focus:border-[var(--brand-yellow)]" />
              </label>

              <label className="block text-sm font-medium">
                Password
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Create a password" required className="mt-2 w-full rounded-2xl border border-[var(--brand-black)] bg-[var(--brand-white)] px-4 py-3 text-sm text-[var(--brand-black)] outline-none focus:border-[var(--brand-yellow)]" />
              </label>

              <button className="w-full rounded-full bg-[var(--brand-yellow)] px-6 py-3 text-sm font-semibold text-[var(--brand-black)]">Create account</button>
            </form>

            <p className="mt-4 text-center text-sm text-[var(--brand-black)]/70">Already have an account? <Link href="/sign-in" className="font-semibold underline">Sign in</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
