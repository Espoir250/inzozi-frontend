"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { 
  ShieldAlert, 
  CheckSquare, 
  Check, 
  X, 
  Trash2, 
  Users, 
  FileText,
  DollarSign
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const { 
    adminBalance, 
    creators, 
    posts, 
    pendingVerifications, 
    approveVerification, 
    rejectVerification, 
    removePost, 
    dismissFlag 
  } = useApp();

  const flaggedPosts = posts.filter(p => p.flagged);

  return (
    <div className="flex-1 space-y-8 p-6 md:p-10 max-w-5xl mx-auto w-full">
      {/* Welcome Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Platform Control Console</h1>
          <p className="text-zinc-400 text-sm mt-1">Review registrations, manage flagged content, and oversee transactions.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 badge-glow"></span>
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Security clearance active</span>
        </div>
      </div>

      {/* Global Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Treasury Revenue</span>
            <span className="block text-xl font-extrabold text-emerald-400 mt-1">${adminBalance.toFixed(2)}</span>
            <span className="text-[9px] text-zinc-500 mt-0.5 block">5% Platform commission</span>
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/25 rounded-lg flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Listed Creators</span>
            <span className="block text-xl font-extrabold text-white mt-1">{creators.length}</span>
            <span className="text-[9px] text-zinc-500 mt-0.5 block">Avg. engagement: 8.3%</span>
          </div>
          <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/25 rounded-lg flex items-center justify-center text-purple-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Active Posts</span>
            <span className="block text-xl font-extrabold text-white mt-1">{posts.length}</span>
            <span className="text-[9px] text-zinc-500 mt-0.5 block">{posts.filter(p => p.visibility === "premium").length} Paid PPVs</span>
          </div>
          <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/25 rounded-lg flex items-center justify-center text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verification Queue Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-purple-400" />
            <span>Profile Verifications ({pendingVerifications.length})</span>
          </h2>
          <p className="text-zinc-500 text-xs mb-5">
            Approve profile reviews. Validated profiles receive checked badges and are indexable in the business directory.
          </p>

          <div className="flex-1 overflow-y-auto space-y-4 max-h-[360px] pr-1">
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
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-xs text-white">{application.name}</h3>
                      <span className="text-[8px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 block mt-1 w-max">
                        {application.type}
                      </span>
                    </div>
                    <div className="flex gap-2">
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

        {/* Flagged Content moderation Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Flagged Posts Desk ({flaggedPosts.length})</span>
          </h2>
          <p className="text-zinc-500 text-xs mb-5">
            Audit reported media assets. Remove posts that violate platform guidelines or clear reporting false-positives.
          </p>

          <div className="flex-1 overflow-y-auto space-y-4 max-h-[360px] pr-1">
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
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-xs text-white truncate max-w-[150px]">{post.title}</h3>
                      <span className="text-[8px] text-zinc-500 font-semibold block mt-0.5">
                        Author: <strong className="text-zinc-300">{post.creatorName}</strong>
                      </span>
                    </div>

                    <div className="flex gap-2 shrink-0">
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
      </div>
    </div>
  );
};
