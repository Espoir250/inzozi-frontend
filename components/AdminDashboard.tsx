"use client";

import React, { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  ShieldAlert, 
  CheckSquare, 
  Check, 
  X, 
  Trash2, 
  Users, 
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  Scale,
  ArrowRight,
  TrendingUp
} from "lucide-react";

type AdminDesk = "verification" | "moderation" | "disputes" | "analytics" | "settings";

export const AdminDashboard: React.FC = () => {
  const [activeDesk, setActiveDesk] = useState<AdminDesk>("verification");
  const { 
    adminBalance, 
    creators, 
    businesses,
    posts, 
    pendingVerifications, 
    approveVerification, 
    rejectVerification, 
    removePost, 
    dismissFlag 
  } = useApp();

  const flaggedPosts = posts.filter(p => p.flagged);
  const premiumPosts = posts.filter(p => p.visibility === "premium");
  const publicPosts = posts.filter(p => p.visibility === "public");
  const paidShare = posts.length ? Math.round((premiumPosts.length / posts.length) * 100) : 0;
  const flaggedShare = posts.length ? Math.round((flaggedPosts.length / posts.length) * 100) : 0;
  const growthSignals = useMemo(() => [
    { label: "Creator supply", value: creators.length, detail: `${pendingVerifications.length} waiting for approval` },
    { label: "Business demand", value: businesses.length, detail: "Registered brand profiles" },
    { label: "Published content", value: posts.length, detail: `${paidShare}% premium content mix` },
    { label: "Platform safety", value: `${flaggedShare}%`, detail: "Flagged content rate" },
  ], [businesses.length, creators.length, flaggedShare, paidShare, pendingVerifications.length, posts.length]);

  const capabilityCards = [
    {
      id: "verification" as const,
      title: "User Verification",
      description: "Review creator and business applications before they receive trusted platform status.",
      value: pendingVerifications.length,
      label: "pending",
      icon: <CheckSquare className="w-5 h-5" />,
      tone: "purple"
    },
    {
      id: "moderation" as const,
      title: "Content Moderation",
      description: "Remove inappropriate posts and clear false-positive reports from the public feed.",
      value: flaggedPosts.length,
      label: "flagged",
      icon: <ShieldAlert className="w-5 h-5" />,
      tone: "rose"
    },
    {
      id: "disputes" as const,
      title: "Reports & Disputes",
      description: "Track reported activity, review contested actions, and keep support cases moving.",
      value: flaggedPosts.length,
      label: "open cases",
      icon: <Scale className="w-5 h-5" />,
      tone: "amber"
    },
    {
      id: "analytics" as const,
      title: "Analytics & Growth",
      description: "Monitor creator supply, published content, paid posts, and platform revenue health.",
      value: creators.length + posts.length,
      label: "signals",
      icon: <BarChart3 className="w-5 h-5" />,
      tone: "cyan"
    },
    {
      id: "settings" as const,
      title: "System Settings",
      description: "Keep platform rules, commission behavior, and operational safeguards consistent.",
      value: 5,
      label: "controls",
      icon: <Settings className="w-5 h-5" />,
      tone: "emerald"
    }
  ];

  const toneClasses: Record<string, string> = {
    purple: "bg-purple-500/10 border-purple-500/25 text-purple-300",
    rose: "bg-rose-500/10 border-rose-500/25 text-rose-300",
    amber: "bg-amber-500/10 border-amber-500/25 text-amber-300",
    cyan: "bg-cyan-500/10 border-cyan-500/25 text-cyan-300",
    emerald: "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
  };

  return (
    <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center border-b border-white/5 pb-5">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Platform Control Console</h1>
          <p className="text-zinc-400 text-sm mt-2 max-w-3xl leading-6">
            Manage verification, moderation, disputes, analytics, and platform settings from one operational view.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 badge-glow"></span>
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Security clearance active</span>
        </div>
      </div>

      {/* Admin Capability Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {capabilityCards.map(card => (
          <button
            key={card.title}
            type="button"
            onClick={() => setActiveDesk(card.id)}
            className={`group glass-panel p-4 sm:p-5 rounded-xl border min-h-[174px] flex flex-col justify-between gap-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/7 hover:shadow-xl hover:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-white/20 ${
              activeDesk === card.id ? "border-white/25 bg-white/8" : "border-white/5"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${toneClasses[card.tone]}`}>
                  {card.icon}
                </div>
                <ArrowRight className={`w-4 h-4 transition-all ${activeDesk === card.id ? "text-white translate-x-0" : "text-zinc-600 group-hover:text-white"}`} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-white leading-5">{card.title}</h2>
                <p className="text-xs text-zinc-500 leading-5 mt-2">{card.description}</p>
              </div>
            </div>
            <div className="flex items-end justify-between gap-3">
              <span className="text-2xl font-black text-white">{card.value}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 pb-1">{card.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Global Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Treasury Revenue</span>
            <span className="block text-xl font-extrabold text-emerald-400 mt-1">${adminBalance.toFixed(2)}</span>
            <span className="text-[9px] text-zinc-500 mt-0.5 block">5% Platform commission</span>
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/25 rounded-lg flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Listed Creators</span>
            <span className="block text-xl font-extrabold text-white mt-1">{creators.length}</span>
            <span className="text-[9px] text-zinc-500 mt-0.5 block">Avg. engagement: 8.3%</span>
          </div>
          <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/25 rounded-lg flex items-center justify-center text-purple-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Active Posts</span>
            <span className="block text-xl font-extrabold text-white mt-1">{posts.length}</span>
            <span className="text-[9px] text-zinc-500 mt-0.5 block">{posts.filter(p => p.visibility === "premium").length} Paid PPVs</span>
          </div>
          <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/25 rounded-lg flex items-center justify-center text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Pending Alerts</span>
            <span className="block text-xl font-extrabold text-rose-400 mt-1">
              {flaggedPosts.length + pendingVerifications.length}
            </span>
            <span className="text-[9px] text-zinc-500 mt-0.5 block">Verification & Moderation</span>
          </div>
          <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/25 rounded-lg flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-4 sm:p-6 rounded-xl border border-white/5 min-h-[460px]">
        {activeDesk === "verification" && (
        <div className="flex flex-col min-h-[420px]">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-purple-400" />
              <span>Pending User Verification ({pendingVerifications.length})</span>
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full px-2.5 py-1 w-max">
              User approval
            </span>
          </div>
          <p className="text-zinc-500 text-xs mb-5">
            Approve profile reviews. Validated profiles receive checked badges and are indexable in the business directory.
          </p>

          <div className="flex-1 overflow-y-auto space-y-4 max-h-[420px] pr-1">
            {pendingVerifications.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-xs bg-white/2 rounded-xl border border-white/5">
                Verification queue is empty. All applications processed.
              </div>
            ) : (
              pendingVerifications.map(application => (
                <div 
                  key={application.id} 
                  className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-3 hover:bg-white/5 transition-all"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-xs text-white">{application.name}</h3>
                      <span className="text-[8px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 block mt-1 w-max">
                        {application.type}
                      </span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => approveVerification(application.id)}
                        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
                        title="Approve Profile"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => rejectVerification(application.id)}
                        className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-all"
                        title="Reject Profile"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-400 space-y-1">
                    <p><strong>Niche:</strong> {application.niche}</p>
                    <p className="line-clamp-2 italic">&ldquo;{application.bio}&rdquo;</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        )}

        {(activeDesk === "moderation" || activeDesk === "disputes") && (
        <div className="flex flex-col min-h-[420px]">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              {activeDesk === "disputes" ? <Scale className="w-5 h-5 text-amber-400" /> : <ShieldAlert className="w-5 h-5 text-rose-400" />}
              <span>{activeDesk === "disputes" ? "Reports & Disputes" : "Flagged Posts Desk"} ({flaggedPosts.length})</span>
            </h2>
            <span className={`text-[10px] uppercase font-bold tracking-wider border rounded-full px-2.5 py-1 w-max ${
              activeDesk === "disputes" ? "text-amber-300 bg-amber-500/10 border-amber-500/20" : "text-rose-300 bg-rose-500/10 border-rose-500/20"
            }`}>
              {activeDesk === "disputes" ? "Case resolution" : "Content safety"}
            </span>
          </div>
          <p className="text-zinc-500 text-xs mb-5">
            {activeDesk === "disputes"
              ? "Review user reports and resolve each case by removing harmful content or dismissing false reports."
              : "Audit reported media assets. Remove posts that violate platform guidelines or clear reporting false-positives."}
          </p>

          <div className="flex-1 overflow-y-auto space-y-4 max-h-[420px] pr-1">
            {flaggedPosts.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-xs bg-white/2 rounded-xl border border-white/5">
                Moderation desk is clean. No content reports filed.
              </div>
            ) : (
              flaggedPosts.map(post => (
                <div 
                  key={post.id} 
                  className="p-4 rounded-xl bg-rose-950/5 border border-rose-500/20 space-y-3 hover:bg-rose-950/10 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="min-w-0">
                      <h3 className="font-bold text-xs text-white truncate max-w-full sm:max-w-[220px]">{post.title}</h3>
                      <span className="text-[8px] text-zinc-500 font-semibold block mt-0.5">
                        Author: <strong className="text-zinc-300">{post.creatorName}</strong>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button
                        onClick={() => removePost(post.id)}
                        className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-all flex items-center gap-1 text-[10px] font-bold"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                      <button
                        onClick={() => dismissFlag(post.id)}
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 text-[10px] font-semibold transition-all"
                        title="Dismiss Report"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-rose-500/5 border border-rose-500/10 text-[10px] text-rose-400 flex gap-1.5">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span><strong>Flag Reason:</strong> {post.flagReason}</span>
                  </div>

                  <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed bg-white/2 p-2 rounded-lg italic">
                    &ldquo;{post.content}&rdquo;
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        )}

        {activeDesk === "analytics" && (
        <div className="min-h-[420px]">
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <span>Analytics & Growth</span>
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2.5 py-1 w-max">
              Live signals
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {growthSignals.map(signal => (
              <div key={signal.label} className="rounded-xl border border-white/5 bg-white/3 p-4 hover:bg-white/5 transition-all">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">{signal.label}</span>
                <strong className="mt-2 block text-2xl font-black text-white">{signal.value}</strong>
                <span className="mt-1 block text-xs text-zinc-500">{signal.detail}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4">
            <div className="rounded-xl border border-white/5 bg-white/3 p-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Growth actions
              </h3>
              <div className="mt-4 space-y-3">
                <button type="button" onClick={() => setActiveDesk("verification")} className="w-full rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-left text-xs text-purple-100 hover:bg-purple-500/15 transition-all">
                  Review {pendingVerifications.length} pending profiles to increase trusted creator and business supply.
                </button>
                <button type="button" onClick={() => setActiveDesk("disputes")} className="w-full rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-left text-xs text-amber-100 hover:bg-amber-500/15 transition-all">
                  Resolve {flaggedPosts.length} open report cases to keep the marketplace healthy.
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/3 p-5">
              <h3 className="text-sm font-bold text-white">Content mix</h3>
              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <div className="mb-1 flex justify-between text-zinc-400"><span>Premium</span><span>{premiumPosts.length}</span></div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden"><div className="h-full bg-cyan-400" style={{ width: `${paidShare}%` }} /></div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-zinc-400"><span>Public</span><span>{publicPosts.length}</span></div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden"><div className="h-full bg-emerald-400" style={{ width: `${posts.length ? Math.round((publicPosts.length / posts.length) * 100) : 0}%` }} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {activeDesk === "settings" && (
        <div className="min-h-[420px]">
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-400" />
              <span>System Settings</span>
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1 w-max">
              Controls
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["5% platform commission", "Manual profile verification", "Content report review", "Escrow payout audit", "Admin moderation logs"].map(setting => (
              <div key={setting} className="rounded-xl border border-white/5 bg-white/3 p-4 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-white">{setting}</span>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-300">Active</span>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
