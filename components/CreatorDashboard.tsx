"use client";

import React, { useState } from "react";
import { useApp, Post } from "@/context/AppContext";
import { 
  Plus, 
  Settings, 
  Users, 
  DollarSign, 
  Eye, 
  Activity, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Check, 
  FolderHeart,
  X,
  Heart,
  MessageSquare,
  TrendingUp,
  Share2
} from "lucide-react";

export const CreatorDashboard: React.FC = () => {
  const { creatorBalance, posts, createPost, creators } = useApp();

  // Find creator's specific info
  const myProfile = creators.find(c => c.id === "c1") || creators[0];
  const myPosts = posts.filter(p => p.creatorId === "c1");

  // Post Creator Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"text" | "image" | "video">("text");
  const [visibility, setVisibility] = useState<"public" | "subscriber" | "premium">("public");
  const [price, setPrice] = useState("2.99");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

  // Settings states
  const [subFee, setSubFee] = useState("10.00");
  const [showSettingsSaved, setShowSettingsSaved] = useState(false);

  // Post Metrics state
  const [selectedMetricsPost, setSelectedMetricsPost] = useState<Post | null>(null);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    if (type !== "text" && !mediaFile) {
      setPublishError("Please choose an image or video file before publishing.");
      return;
    }

    setIsPublishing(true);
    setPublishError("");

    try {
      const result = await createPost(
        title,
        content,
        type,
        visibility,
        visibility === "premium" ? parseFloat(price) : undefined,
        undefined,
        mediaFile ?? undefined
      );

      if (!result.ok) {
        setPublishError(result.message);
        return;
      }

      // Reset form
      setTitle("");
      setContent("");
      setType("text");
      setVisibility("public");
      setMediaFile(null);
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : "Could not publish content.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveSettings = () => {
    setShowSettingsSaved(true);
    setTimeout(() => setShowSettingsSaved(false), 2000);
  };

  return (
    <div className="flex-1 space-y-8 p-6 md:p-10 max-w-5xl mx-auto w-full">
      {/* Welcome Title */}
      <div className="flex justify-between items-center border-b border-white/5 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Creator Studio</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your digital assets, audience monetization, and analytics.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 badge-glow"></span>
          <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Live Wallet Active</span>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-xs font-semibold uppercase">Total Earnings</span>
            <span className="block text-2xl font-extrabold text-white mt-1">${creatorBalance.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-400 font-medium mt-1 block">Platform fee (5%) deducted</span>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center justify-center text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-xs font-semibold uppercase">My Subscribers</span>
            <span className="block text-2xl font-extrabold text-white mt-1">{myProfile.subscribersCount}</span>
            <span className="text-[10px] text-purple-400 font-medium mt-1 block">Avg. monthly fee: $10.00</span>
          </div>
          <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/25 rounded-xl flex items-center justify-center text-purple-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-xs font-semibold uppercase">Monthly Impressions</span>
            <span className="block text-2xl font-extrabold text-white mt-1">84.2K</span>
            <span className="text-[10px] text-cyan-400 font-medium mt-1 block">+14.2% since last month</span>
          </div>
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/25 rounded-xl flex items-center justify-center text-cyan-400">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-xs font-semibold uppercase">Engagement Rate</span>
            <span className="block text-2xl font-extrabold text-white mt-1">{myProfile.engagement}</span>
            <span className="text-[10px] text-zinc-500 mt-1 block">Niche: {myProfile.niche}</span>
          </div>
          <div className="w-12 h-12 bg-zinc-500/10 border border-zinc-500/25 rounded-xl flex items-center justify-center text-zinc-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Post Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              <span>Publish Premium Content</span>
            </h2>

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Post Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass on Building responsive web layouts"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Body Content / Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write details of your content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Media Type</label>
                  <select
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value as "text" | "image" | "video");
                      setMediaFile(null);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  >
                    <option value="text">Text Article</option>
                    <option value="image">Image / Graphic</option>
                    <option value="video">Video Masterclass</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Visibility & Monetization</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as "public" | "subscriber" | "premium")}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  >
                    <option value="public">Public (Everyone)</option>
                    <option value="subscriber">Subscribers-Only</option>
                    <option value="premium">Premium (Pay Per View)</option>
                  </select>
                </div>
              </div>

              {type !== "text" && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Upload Media</label>
                  <input
                    type="file"
                    required
                    accept={type === "image" ? "image/*" : "video/mp4,video/webm,video/quicktime"}
                    onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                  {mediaFile && (
                    <p className="mt-1.5 text-[10px] text-zinc-400">
                      Selected: {mediaFile.name}
                    </p>
                  )}
                </div>
              )}

              {visibility === "premium" && (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/25 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-purple-300">Set Pay-Per-View Unlock Price</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Fans pay this fee to unlock the post</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1">
                    <span className="text-xs text-zinc-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.99"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-16 bg-transparent text-sm border-none focus:outline-none text-white font-semibold text-right"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isPublishing}
                className="w-full py-3 rounded-xl bg-gradient-brand text-white font-bold text-sm shadow-md hover:shadow-purple-500/15 transition-all flex items-center justify-center gap-2 hover:scale-101"
              >
                {isPublishing ? "Publishing asset..." : "Publish to Inzozi Feed"}
              </button>
              {publishError && (
                <p className="text-xs font-semibold text-rose-400">{publishError}</p>
              )}
            </form>
          </div>
        </div>

        {/* Monetization Controls Sidebar */}
        <div className="space-y-6">
          {/* Subscription Settings */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              <span>Monetization Tiers</span>
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <h4 className="text-xs font-bold text-white">Monthly Subscriptions</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Let fans support you monthly</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" id="sub-toggle" />
                  <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Monthly Subscription Fee</label>
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                  <span className="text-xs text-zinc-400 font-bold">$</span>
                  <input
                    type="number"
                    step="1.00"
                    value={subFee}
                    onChange={(e) => setSubFee(e.target.value)}
                    className="w-full bg-transparent text-sm border-none focus:outline-none text-white font-semibold"
                  />
                  <span className="text-xs text-zinc-500 font-semibold">/month</span>
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                {showSettingsSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Settings Saved</span>
                  </>
                ) : (
                  "Save Settings"
                )}
              </button>
            </div>
          </div>

          {/* Tips info box */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-purple-500/5 to-transparent">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
              <FolderHeart className="w-4 h-4 text-purple-400" />
              <span>Digital Tipping Jar</span>
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Fans can support your work directly through tips. Every tip arrives instantly in your earnings wallet, with a flat platform fee of 5% automatically deducted to fund ecosystem hosting and verification operations.
            </p>
          </div>
        </div>
      </div>

      {/* Content Ledger */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <h2 className="text-lg font-bold text-white mb-6">Published Content Ledger</h2>
        {myPosts.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-sm">
            You haven&apos;t uploaded any content yet. Use the form above to post your first asset.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myPosts.map(post => (
              <div key={post.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-all flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    {post.type === "text" && <FileText className="w-4 h-4 text-purple-400" />}
                    {post.type === "image" && <ImageIcon className="w-4 h-4 text-cyan-400" />}
                    {post.type === "video" && <Video className="w-4 h-4 text-rose-400" />}
                    <span className="text-xs font-bold text-zinc-300 capitalize">{post.type}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    post.visibility === "public" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    post.visibility === "subscriber" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    {post.visibility === "premium" ? `Premium $${post.price}` : post.visibility}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm line-clamp-1">{post.title}</h3>
                  <p className="text-zinc-400 text-xs mt-1 line-clamp-2">{post.content}</p>
                </div>

                {/* Engagement counts */}
                <div className="flex items-center gap-4 text-[11px] text-zinc-500 border-t border-white/5 pt-2.5 mt-auto">
                  <span>👍 {post.likes} Likes</span>
                  <span>💬 {post.comments.length} Comments</span>
                </div>

                {/* Post Comments Ledger */}
                <div className="mt-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase block tracking-wider mb-1">Fan Comments</span>
                  {post.comments.length === 0 ? (
                    <div className="text-[10px] text-zinc-600 italic py-1 bg-white/2 rounded-lg px-2 text-center">No comments yet.</div>
                  ) : (
                    <div className="flex flex-col gap-1.5 bg-white/2 rounded-xl p-2.5 border border-white/5 max-h-24 overflow-y-auto">
                      {post.comments.map(c => (
                        <div key={c.id} className="text-[10px] leading-normal border-b border-white/2 last:border-b-0 pb-1 last:pb-0">
                          <span className="font-bold text-zinc-300 mr-1">{c.user}:</span>
                          <span className="text-zinc-400">{c.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* View Post Metrics Button */}
                <button
                  onClick={() => setSelectedMetricsPost(post)}
                  className="w-full mt-1.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  <span>View Post Metrics</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Performance Metrics Dialog Modal */}
      {selectedMetricsPost && (() => {
        const impressions = (parseInt(selectedMetricsPost.id.replace(/\D/g, '')) || 0) % 1500 + (selectedMetricsPost.likes * 24) + (selectedMetricsPost.comments.length * 48) + 215;
        const reach = Math.floor(impressions * 0.82);
        const engagementRate = impressions > 0 ? (((selectedMetricsPost.likes + selectedMetricsPost.comments.length) / impressions) * 100).toFixed(2) : "0.00";
        const clicks = Math.floor(impressions * 0.08);
        const shares = Math.floor(selectedMetricsPost.likes * 0.15);
        const subsEarned = Math.floor(selectedMetricsPost.likes * 0.05);

        return (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl relative flex flex-col gap-5">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">Post Performance Analysis</h3>
                    <p className="text-[10px] text-zinc-500 truncate max-w-[280px]">For: &quot;{selectedMetricsPost.title}&quot;</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMetricsPost(null)}
                  className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Analytics grid */}
              <div className="grid grid-cols-3 gap-3">
                
                {/* 1. IMPRESSIONS */}
                <div className="p-3 rounded-xl bg-white/2 border border-white/5 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-purple-400">
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Impressions</span>
                  </div>
                  <span className="text-lg font-black text-white mt-1">{impressions.toLocaleString()}</span>
                  <span className="text-[8px] text-zinc-500">Total views generated</span>
                </div>

                {/* 2. REACH */}
                <div className="p-3 rounded-xl bg-white/2 border border-white/5 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Unique Reach</span>
                  </div>
                  <span className="text-lg font-black text-white mt-1">{reach.toLocaleString()}</span>
                  <span className="text-[8px] text-zinc-500">Unique fan accounts</span>
                </div>

                {/* 3. ENGAGEMENT RATE */}
                <div className="p-3 rounded-xl bg-white/2 border border-white/5 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Engagement</span>
                  </div>
                  <span className="text-lg font-black text-white mt-1">{engagementRate}%</span>
                  <span className="text-[8px] text-zinc-500">Likes & comments / views</span>
                </div>

              </div>

              {/* Engagement breakdown & action counts */}
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-white/2 border border-white/5 p-4 text-xs">
                
                <div className="space-y-2">
                  <h4 className="font-bold text-zinc-400 uppercase tracking-widest text-[9px] mb-2">Engagement breakdown</h4>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-rose-500" /> Likes</span>
                    <span className="font-bold text-white">{selectedMetricsPost.likes}</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 text-purple-400" /> Comments</span>
                    <span className="font-bold text-white">{selectedMetricsPost.comments.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span className="flex items-center gap-1"><Share2 className="w-3 h-3 text-cyan-400" /> Shares</span>
                    <span className="font-bold text-white">{shares}</span>
                  </div>
                </div>

                <div className="space-y-2 border-l border-white/5 pl-4">
                  <h4 className="font-bold text-zinc-400 uppercase tracking-widest text-[9px] mb-2">Conversion Outcomes</h4>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Link Clicks</span>
                    <span className="font-bold text-white">{clicks}</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Subs Gained</span>
                    <span className="font-bold text-white">+{subsEarned}</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Estimated Payout</span>
                    <span className="font-bold text-emerald-400">${(selectedMetricsPost.likes * 0.45 + clicks * 0.05).toFixed(2)}</span>
                  </div>
                </div>

              </div>

              {/* Recommendations */}
              <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-[10px] text-zinc-400 leading-normal flex items-start gap-2">
                <span className="font-bold text-purple-400 uppercase tracking-wider shrink-0 mt-0.5">Insight:</span>
                <span>
                  {parseFloat(engagementRate) > 5.0 
                    ? "Exceptional engagement! Your audience is highly responsive to this content format. We recommend publishing more premium pay-per-view videos in this topic niche." 
                    : "Consistent impressions. To increase engagement rates, consider adding interactive call-to-actions in your next post descriptions, prompting fans to leave feedback in comments."
                  }
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedMetricsPost(null)}
                className="w-full py-2.5 rounded-xl bg-gradient-brand text-white text-xs font-bold shadow-md"
              >
                Done
              </button>

            </div>
          </div>
        );
      })()}
    </div>
  );
};
