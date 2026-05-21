"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
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
  FolderHeart
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
  const [mediaUrl, setMediaUrl] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // Settings states
  const [subFee, setSubFee] = useState("10.00");
  const [showSettingsSaved, setShowSettingsSaved] = useState(false);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsPublishing(true);
    setTimeout(() => {
      createPost(
        title,
        content,
        type,
        visibility,
        visibility === "premium" ? parseFloat(price) : undefined,
        mediaUrl || undefined
      );
      
      // Reset form
      setTitle("");
      setContent("");
      setType("text");
      setVisibility("public");
      setMediaUrl("");
      setIsPublishing(false);
    }, 800);
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
                    onChange={(e) => setType(e.target.value as "text" | "image" | "video")}
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
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Media URL (Mock)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
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

                <div className="flex items-center gap-4 text-[11px] text-zinc-500 border-t border-white/5 pt-2.5 mt-auto">
                  <span>👍 {post.likes} Likes</span>
                  <span>💬 {post.comments.length} Comments</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
