"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ArrowRight, Briefcase, Heart, Lock, Mail, Phone, Shield, Sparkles, User } from "lucide-react";
import { Role, useApp } from "@/context/AppContext";

type AccountRole = Exclude<Role, "landing">;
type AuthMode = "login" | "register";

const accountRoles: { value: AccountRole; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "fan", label: "Fan", description: "Discover and support creators", icon: <Heart className="w-4 h-4" /> },
  { value: "creator", label: "Creator", description: "Publish and monetize content", icon: <Sparkles className="w-4 h-4" /> },
  { value: "business", label: "Business", description: "Find creators and launch campaigns", icon: <Briefcase className="w-4 h-4" /> },
  { value: "admin", label: "Admin", description: "Moderate and manage the platform", icon: <Shield className="w-4 h-4" /> }
];

export const AuthForm: React.FC<{ mode: AuthMode }> = ({ mode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginUser, registerUser, isAuthenticated } = useApp();
  const requestedRole = mode === "register" ? searchParams.get("role") as AccountRole | null : null;
  const defaultRole = requestedRole && accountRoles.some(item => item.value === requestedRole) ? requestedRole : "fan";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<AccountRole>(defaultRole);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'verify'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    if (mode === "register") {
      if (password.length < 6) {
        setMessage("Password must be at least 6 characters.");
        setIsSubmitting(false);
        return;
      }

      if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
        setIsSubmitting(false);
        return;
      }

      const result = registerUser({ fullName, email, phone, role, password });
      setMessage(result.message);
      if (result.ok) router.push("/");
      setIsSubmitting(false);
      return;
    }

    const result = loginUser(email, password);
    setMessage(result.message);
    if (result.ok) router.push("/");
    setIsSubmitting(false);
  };

  const isRegister = mode === "register";

  return (
    <section className="min-h-screen flex flex-col items-center justify-start bg-white text-black px-6 py-12 overflow-y-auto">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] border border-neutral-200 rounded-2xl overflow-hidden shadow-xl shadow-black/5">
        <section className="bg-black text-white force-white p-8 md:p-10 flex flex-col justify-between gap-12">
          <Link href="/" className="flex items-center gap-2 w-max">
            <span className="w-9 h-9 rounded-lg bg-white text-black force-black flex items-center justify-center font-black">I</span>
            <span className="font-bold text-xl">InzoziMarket</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {isRegister ? "Create your marketplace account." : "Welcome back to your marketplace."}
            </h1>
            <p className="text-neutral-300 text-sm leading-6 mt-5 max-w-sm">
              {isRegister
                ? "Register as a creator, business, fan, or admin and enter the correct dashboard immediately."
                : "Sign in with the email and password you used during registration."}
            </p>
          </div>

          <p className="text-xs text-neutral-500">
            Frontend demo authentication is stored in this browser until a backend API is connected.
          </p>
        </section>

        <section className="p-8 md:p-10 bg-white">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black">{isRegister ? "Register" : "Login"}</h2>
              <p className="text-sm text-neutral-600 mt-1">
                {isRegister ? "Choose your role and secure your account." : "Enter your credentials to continue."}
              </p>
            </div>
            <Link
              href={isRegister ? "/login" : "/register"}
              className="px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-sm font-semibold"
            >
              {isRegister ? "Login" : "Register"}
            </Link>
          </div>

          {/* Login form or Forgot password flow */}
          {showForgot ? (
            forgotStep === 'email' ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                // Placeholder: send reset code logic
                setResetMessage('If an account exists, a reset code has been sent to your email.');
                setForgotStep('verify');
              }} className="space-y-5">
                <label className="block">
                  <span className="text-xs font-bold uppercase text-neutral-500">Email address</span>
                  <span className="mt-1.5 flex items-center gap-2 border border-neutral-300 rounded-xl px-4 py-3 focus-within:border-black focus-within:ring-4 focus-within:ring-black/5">
                    <Mail className="w-4 h-4 text-neutral-500" />
                    <input
                      required
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full outline-none text-sm"
                      placeholder="you@example.com"
                    />
                  </span>
                </label>

                <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-neutral-800">
                  Send reset code
                </button>

                {resetMessage && (
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium">
                    {resetMessage}
                  </div>
                )}

                <button type="button" onClick={() => setShowForgot(false)} className="w-full mt-2 text-sm text-blue-600 hover:underline">
                  Back to login
                </button>
              </form>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                // Placeholder: verify code and reset password logic
                if (newPassword.length < 6) {
                  setResetMessage('Password must be at least 6 characters.');
                  return;
                }
                if (newPassword !== confirmNewPassword) {
                  setResetMessage('Passwords do not match.');
                  return;
                }
                // Simulate successful password reset
                setResetMessage('Password successfully reset. Redirecting to login...');
                // Reset flow and return to login after a brief timeout
                setTimeout(() => {
                  setShowForgot(false);
                  setForgotStep('email');
                  setForgotEmail('');
                  setResetCode('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                  setResetMessage('');
                }, 1500);
              }} className="space-y-5">
                <label className="block">
                  <span className="text-xs font-bold uppercase text-neutral-500">Verification code</span>
                  <span className="mt-1.5 flex items-center gap-2 border border-neutral-300 rounded-xl px-4 py-3 focus-within:border-black focus-within:ring-4 focus-within:ring-black/5">
                    <Lock className="w-4 h-4 text-neutral-500" />
                    <input
                      required
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      className="w-full outline-none text-sm"
                      placeholder="Enter code"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase text-neutral-500">New password</span>
                  <span className="mt-1.5 flex items-center gap-2 border border-neutral-300 rounded-xl px-4 py-3 focus-within:border-black focus-within:ring-4 focus-within:ring-black/5">
                    <Lock className="w-4 h-4 text-neutral-500" />
                    <input
                      required
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full outline-none text-sm"
                      placeholder="New password"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase text-neutral-500">Confirm new password</span>
                  <span className="mt-1.5 flex items-center gap-2 border border-neutral-300 rounded-xl px-4 py-3 focus-within:border-black focus-within:ring-4 focus-within:ring-black/5">
                    <Lock className="w-4 h-4 text-neutral-500" />
                    <input
                      required
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full outline-none text-sm"
                      placeholder="Confirm new password"
                    />
                  </span>
                </label>

                <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-neutral-800">
                  Reset password
                </button>

                {resetMessage && (
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium">
                    {resetMessage}
                  </div>
                )}

                <button type="button" onClick={() => setShowForgot(false)} className="w-full mt-2 text-sm text-blue-600 hover:underline">
                  Back to login
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

            {isRegister && (
              <>
                <label className="block">
                  <span className="text-xs font-bold uppercase text-neutral-500">Full name</span>
                  <span className="mt-1.5 flex items-center gap-2 border border-neutral-300 rounded-xl px-4 py-3 focus-within:border-black focus-within:ring-4 focus-within:ring-black/5">
                    <User className="w-4 h-4 text-neutral-500" />
                    <input
                      required
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className="w-full outline-none text-sm"
                      placeholder="e.g. Aline Mukamana"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase text-neutral-500">Phone number</span>
                  <span className="mt-1.5 flex items-center gap-2 border border-neutral-300 rounded-xl px-4 py-3 focus-within:border-black focus-within:ring-4 focus-within:ring-black/5">
                    <Phone className="w-4 h-4 text-neutral-500" />
                    <input
                      required
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="w-full outline-none text-sm"
                      placeholder="e.g. 0788123456"
                    />
                  </span>
                </label>

                <div>
                  <span className="text-xs font-bold uppercase text-neutral-500">Account role</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {accountRoles.map(item => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setRole(item.value)}
                        className={`text-left rounded-xl border p-4 ${role === item.value ? "border-black bg-black text-white" : "border-neutral-200 hover:bg-neutral-100"}`}
                      >
                        <span className="flex items-center gap-2 font-bold text-sm">
                          {item.icon}
                          {item.label}
                        </span>
                        <span className={`block text-xs mt-1 ${role === item.value ? "text-neutral-300" : "text-neutral-600"}`}>
                          {item.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <label className="block">
              <span className="text-xs font-bold uppercase text-neutral-500">Email address</span>
              <span className="mt-1.5 flex items-center gap-2 border border-neutral-300 rounded-xl px-4 py-3 focus-within:border-black focus-within:ring-4 focus-within:ring-black/5">
                <Mail className="w-4 h-4 text-neutral-500" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full outline-none text-sm"
                  placeholder="you@example.com"
                />
              </span>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase text-neutral-500">Password</span>
              <span className="mt-1.5 flex items-center gap-2 border border-neutral-300 rounded-xl px-4 py-3 focus-within:border-black focus-within:ring-4 focus-within:ring-black/5">
                <Lock className="w-4 h-4 text-neutral-500" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full outline-none text-sm"
                  placeholder="Minimum 6 characters"
                />
              </span>
            </label>
            { !isRegister && (
              <div className="text-right mt-2">
                <button type="button" onClick={() => setShowForgot(true)} className="text-sm text-blue-600 hover:underline">Forgot password?</button>
              </div>
            ) }

            {isRegister && (
              <label className="block">
                <span className="text-xs font-bold uppercase text-neutral-500">Confirm password</span>
                <span className="mt-1.5 flex items-center gap-2 border border-neutral-300 rounded-xl px-4 py-3 focus-within:border-black focus-within:ring-4 focus-within:ring-black/5">
                  <Lock className="w-4 h-4 text-neutral-500" />
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full outline-none text-sm"
                    placeholder="Repeat your password"
                  />
                </span>
              </label>
            )}

            {message && (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              onClick={() => setIsClicked(true)}
              className={`w-full ${isClicked ? "bg-black text-white" : "bg-white text-black border border-black"} hover:bg-neutral-800 hover:text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 disabled:opacity-60`}
            >
              <span>{isSubmitting ? "Please wait..." : isRegister ? "Create Account" : "Login"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          )}
        </section>
      </div>
    </section>
  );
};
