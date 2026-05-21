"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useApp, Role } from "@/context/AppContext";
import { Sparkles, Briefcase, Heart, Shield, ArrowRight, Flame, Compass, Lock } from "lucide-react";

export const Hero: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, setActiveRole, setActiveTab } = useApp();

  const handleRoleSelection = (role: Role) => {
    if (!isAuthenticated) {
      router.push(`/register?role=${role}`);
      return;
    }

    setActiveRole(role);
    if (role === "fan") {
      setActiveTab("feed");
    } else {
      setActiveTab("dashboard");
    }
  };

  const features = [
    {
      title: "Content Monetization",
      desc: "Set subscription tiers, host tipping jars, and release paid premium posts with instant payouts.",
      icon: <Flame className="w-5 h-5 text-purple-400" />
    },
    {
      title: "Direct Collaborations",
      desc: "Brands find creators using filters, communicate in-app, and create legally binding escrow contracts.",
      icon: <Compass className="w-5 h-5 text-cyan-400" />
    },
    {
      title: "Escrow Protection",
      desc: "Budget is locked in a secure digital vault until milestones are approved. Transparent, safe deals.",
      icon: <Lock className="w-5 h-5 text-emerald-400" />
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center py-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Top Banner Tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 mb-8 animate-pulse">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Where Dreams Become Digital Value</span>
      </div>

      {/* Main Pitch */}
      <div className="text-center max-w-3xl mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Transform Your Creative <span className="text-gradient-brand">Inzozi</span> Into Real Income
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-8">
          InzoziMarket is a next-generation marketplace bridging creators, audiences, and brands within an integrated digital ecosystem. Monetize media directly and coordinate sponsorships under escrow contract security.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => handleRoleSelection("fan")}
            className="px-8 py-4 rounded-xl bg-gradient-brand text-white font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 hover:scale-102 hover-scale flex items-center justify-center gap-2"
          >
            <span>Explore Creator Market</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleRoleSelection("business")}
            className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-200 font-semibold hover-scale flex items-center justify-center gap-2"
          >
            <span>Brand Partnership Hub</span>
          </button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mb-20 max-w-5xl">
        {[
          { number: "10K+", label: "Active Creators" },
          { number: "500+", label: "Verified Brands" },
          { number: "$120K+", label: "Payouts Distributed" },
          { number: "0%", label: "Monetization Fraud" }
        ].map((stat, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl text-center border border-white/5">
            <span className="block text-3xl font-extrabold text-white mb-1.5">{stat.number}</span>
            <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Select Role Portal */}
      <div className="w-full mb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-3">Choose Your Portal</h2>
        <p className="text-center text-zinc-500 text-sm mb-12 max-w-md mx-auto">
          Explore the InzoziMarket ecosystem by logging in as any of the four target user personas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Fan Persona Card */}
          <div className="glass-panel p-6 rounded-2xl hover-scale flex flex-col border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all"></div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center mb-6">
              <Heart className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Fan & Supporter</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6 flex-grow">
              Discover posts, support creators with tips, subscribe for exclusive blogs, and unlock premium videos.
            </p>
            <button
              onClick={() => handleRoleSelection("fan")}
              className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs border border-rose-500/20 transition-all"
            >
              Enter as Fan
            </button>
          </div>

          {/* Creator Persona Card */}
          <div className="glass-panel p-6 rounded-2xl hover-scale flex flex-col border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all"></div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Content Creator</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6 flex-grow">
              Build your dashboard, upload subscriber content, track visual analytics, and negotiate sponsorships.
            </p>
            <button
              onClick={() => handleRoleSelection("creator")}
              className="w-full py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-semibold text-xs border border-purple-500/20 transition-all"
            >
              Enter as Creator
            </button>
          </div>

          {/* Brand/Business Persona Card */}
          <div className="glass-panel p-6 rounded-2xl hover-scale flex flex-col border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all"></div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center mb-6">
              <Briefcase className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Brand / Business</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6 flex-grow">
              Browse creator databases by engagement metrics, manage campaigns, chat directly, and lock escrow budgets.
            </p>
            <button
              onClick={() => handleRoleSelection("business")}
              className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-semibold text-xs border border-cyan-500/20 transition-all"
            >
              Enter as Business
            </button>
          </div>

          {/* Administrator Persona Card */}
          <div className="glass-panel p-6 rounded-2xl hover-scale flex flex-col border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Platform Admin</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6 flex-grow">
              Review verification requests, moderate flagged posts, inspect transaction logs, and oversee global stats.
            </p>
            <button
              onClick={() => handleRoleSelection("admin")}
              className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold text-xs border border-amber-500/20 transition-all"
            >
              Enter as Admin
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Features highlights */}
      <div className="w-full border-t border-white/5 pt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feat, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center shrink-0 border border-white/10 mt-1">
              {feat.icon}
            </div>
            <div>
              <h4 className="font-bold text-white text-base mb-1.5">{feat.title}</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
