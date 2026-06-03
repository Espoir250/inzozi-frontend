"use client";

import React, { useState } from "react";
import { useApp, Post, Creator } from "@/context/AppContext";
import { 
  Heart, 
  MessageSquare, 
  MessageCircle,
  Lock, 
  CheckCircle, 
  DollarSign, 
  Send, 
  AlertOctagon, 
  ChevronRight,
  ChevronDown,
  Sparkles,
  Unlock,
  Search,
  MapPin,
  X
} from "lucide-react";
import Link from "next/link";

const isImageAvatar = (avatar?: string) => {
  if (!avatar) return false;
  return avatar.startsWith("http://") ||
    avatar.startsWith("https://") ||
    avatar.startsWith("data:image/") ||
    avatar.startsWith("/");
};

const ProfileAvatar = ({
  avatar,
  name,
  className = "w-10 h-10 rounded-xl text-xl",
}: {
  avatar?: string;
  name: string;
  className?: string;
}) => (
  <div className={`${className} bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0`}>
    {isImageAvatar(avatar) ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={avatar} alt={`${name} profile picture`} className="h-full w-full object-cover" />
    ) : (
      <span>{avatar || name.charAt(0).toUpperCase()}</span>
    )}
  </div>
);

export const ViewerFeed: React.FC = () => {
  const { 
    posts, 
    creators, 
    fanBalance, 
    likePost, 
    commentOnPost, 
    subscribeToCreator, 
    unlockPremiumPost, 
    tipCreator,
    flagPost,
    startDirectMessage,
    currentUser,
    activeRole
  } = useApp();

  // State for selected creator to view profile in a modal (fan view)
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  // State for toggling creator list dropdown
  const [isCreatorListOpen, setIsCreatorListOpen] = useState(false);

  // Local state for tracking subscribed creators in this browser session
  const [subscribedIds, setSubscribedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("inzozi_fan_subscriptions");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  // Tipping Modal State
  const [tippingCreator, setTippingCreator] = useState<Creator | null>(null);
  const [tipAmount, setTipAmount] = useState("5.00");
  const [tipMessage, setTipMessage] = useState("");

  // Flag Modal State
  const [flaggingPost, setFlaggingPost] = useState<Post | null>(null);
  const [flagReason, setFlagReason] = useState("Inappropriate content");

  // Comment input state
  const [commentText, setCommentText] = useState<{ [postId: string]: string }>({});
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);
  const [creatorSearch, setCreatorSearch] = useState("");
  const [creatorNicheFilter, setCreatorNicheFilter] = useState("all");
  const creatorNicheOptions = Array.from(new Set(creators.map(creator => creator.niche).filter(Boolean))).sort();
  const filteredCreators = creators.filter(creator => {
    const query = creatorSearch.trim().toLowerCase();
    const matchesSearch = !query ||
      creator.name.toLowerCase().includes(query) ||
      creator.niche.toLowerCase().includes(query) ||
      creator.location.toLowerCase().includes(query) ||
      creator.bio.toLowerCase().includes(query) ||
      (creator.contact || "").toLowerCase().includes(query);
    const matchesNiche = creatorNicheFilter === "all" || creator.niche === creatorNicheFilter;

    return matchesSearch && matchesNiche;
  });


  const handleSubscribe = (creatorId: string) => {
    const success = subscribeToCreator(creatorId);
    if (success) {
      const updated = [...subscribedIds, creatorId];
      setSubscribedIds(updated);
      localStorage.setItem("inzozi_fan_subscriptions", JSON.stringify(updated));
    }
  };

  const handleUnlockPost = (postId: string) => {
    unlockPremiumPost(postId);
  };

  const handleLikePost = (postId: string) => {
    if (likedPostIds.includes(postId)) return;

    likePost(postId);
    setLikedPostIds([...likedPostIds, postId]);
  };

  const handleSendTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tippingCreator) return;

    const amount = parseFloat(tipAmount);
    if (isNaN(amount) || amount <= 0) return;

    const success = tipCreator(tippingCreator.id, amount);
    if (success) {
      setTippingCreator(null);
      setTipAmount("5.00");
      setTipMessage("");
    }
  };

  const handleFlagPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flaggingPost) return;

    flagPost(flaggingPost.id, flagReason);
    setFlaggingPost(null);
  };

  const handleSendComment = (postId: string) => {
    const text = commentText[postId];
    if (!text || !text.trim()) return;

    commentOnPost(postId, text.trim());
    setCommentText({ ...commentText, [postId]: "" });
  };

  // Check if a post is locked for the current Fan
  const isPostLocked = (post: Post) => {
    if (post.visibility === "public") return false;
    
    if (post.visibility === "subscriber") {
      // Locked if creator is not in subscribed list
      return !subscribedIds.includes(post.creatorId);
    }
    
    if (post.visibility === "premium") {
      // Premium is locked if the fan hasn't unlocked it yet (verified via list)
      // For demo, we consider it unlocked if "fan_user_id" is in unlockedBy
      return !post.unlockedBy?.includes("fan_user_id");
    }

    return false;
  };

  return (
    <div className="flex-1 space-y-8 p-6 md:p-10 max-w-5xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Social Feed Column */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span>Discover Feed</span>
          </h1>

          {posts.filter(p => !p.flagged).length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm glass-panel rounded-2xl border border-white/5">
              No content published yet. Switch to Creator role to publish something!
            </div>
          ) : (
            posts
              .filter(p => !p.flagged) // Hide flagged content from feed
              .map(post => {
                const locked = isPostLocked(post);
                const creatorObj = creators.find(c => c.id === post.creatorId);
                const isVerified = creatorObj ? creatorObj.verified : false;
                const isLiked = likedPostIds.includes(post.id);

                return (
                  <div key={post.id} className="glass-panel rounded-2xl border border-white/5 overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-4 flex items-center justify-between border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <ProfileAvatar avatar={creatorObj?.avatar ?? post.creatorAvatar} name={post.creatorName} />
                        <div>
                          <div className="flex items-center gap-1">
                                                <Link href={`/creator/${creatorObj?.id}`} className="font-bold text-sm text-zinc-200 hover:underline">{post.creatorName}</Link>
                            {isVerified && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                          </div>
                          <span className="text-[10px] text-zinc-500 uppercase font-semibold">{post.visibility} content</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setFlaggingPost(post)}
                        className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-all"
                        title="Report inappropriate post"
                      >
                        <AlertOctagon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className="p-5 flex-1 flex flex-col gap-4 relative">
                      {locked ? (
                        /* Locked Blur Panel Overlay */
                        <div className="p-6 py-12 rounded-xl bg-purple-950/15 border border-purple-500/25 flex flex-col items-center text-center gap-4 relative overflow-hidden">
                          <div className="absolute inset-0 backdrop-blur-md z-0 bg-black/40"></div>
                          
                          <div className="z-10 w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                            <Lock className="w-6 h-6 animate-bounce" />
                          </div>
                          
                          <div className="z-10 space-y-1">
                            <h4 className="font-bold text-white text-sm">
                              {post.visibility === "subscriber" ? "Subscribers-Only Content" : "Premium Unlockable Content"}
                            </h4>
                            <p className="text-zinc-400 text-[11px] max-w-xs">
                              {post.visibility === "subscriber" 
                                ? "Support the creator with a monthly subscription to view this post." 
                                : `Unlock this premium post for a one-time fee of $${post.price?.toFixed(2)}.`}
                            </p>
                          </div>

                          <div className="z-10 w-full max-w-[200px]">
                            {post.visibility === "subscriber" ? (
                                <button
                                  onClick={() => handleSubscribe(post.creatorId)}
                                  className="w-full py-2 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-md transition-all hover:scale-102"
                                >
                                  Subscribe (${creatorObj?.subscriptionFee?.toFixed(2) || "10.00"}/mo)
                                </button>
                            ) : (
                              <button
                                onClick={() => handleUnlockPost(post.id)}
                                className="w-full py-2 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-md transition-all hover:scale-102 flex items-center justify-center gap-1"
                              >
                                <Unlock className="w-3.5 h-3.5" />
                                <span>Unlock for ${post.price?.toFixed(2)}</span>
                              </button>
                            )}
                            <span className="block text-[9px] text-zinc-500 mt-1.5">Your balance: ${fanBalance.toFixed(2)}</span>
                          </div>
                        </div>
                      ) : (
                        /* Unlocked Normal View */
                        <>
                          <div>
                            <h3 className="font-bold text-white text-base mb-2">{post.title}</h3>
                            <p className="text-zinc-300 text-xs leading-relaxed whitespace-pre-line">{post.content}</p>
                          </div>

                          {post.mediaUrl && (
                            <div className="rounded-xl overflow-hidden border border-white/5 max-h-[300px] bg-black/40 flex items-center justify-center">
                              {post.type === "video" ? (
                                <video 
                                  src={post.mediaUrl} 
                                  controls 
                                  className="w-full h-full object-cover max-h-[300px]"
                                />
                              ) : (
                                <>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img 
                                    src={post.mediaUrl} 
                                    alt={post.title}
                                    className="w-full h-full object-cover max-h-[300px]"
                                  />
                                </>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Engagement Actions */}
                    {!locked && (
                      <div className="p-4 border-t border-white/5 bg-white/2 flex flex-col gap-4">
                        <div className="flex gap-6 text-xs font-semibold text-zinc-400">
                          <button 
                            onClick={() => handleLikePost(post.id)}
                            className={`flex items-center gap-1.5 transition-all ${isLiked ? "text-rose-500" : "hover:text-rose-400"}`}
                            aria-pressed={isLiked}
                          >
                            <Heart className="w-4.5 h-4.5" fill={isLiked ? "currentColor" : "none"} />
                            <span>{post.likes} Likes</span>
                          </button>
                          <div className="flex items-center gap-1.5">
                            <MessageSquare className="w-4.5 h-4.5" />
                            <span>{post.comments.length} Comments</span>
                          </div>
                        </div>

                        {/* Comments list */}
                        {post.comments.length > 0 && (
                          <div className="flex flex-col gap-2 bg-white/2 rounded-xl p-3 border border-white/5 max-h-40 overflow-y-auto">
                            {post.comments.map(c => (
                              <div key={c.id} className="text-xs leading-relaxed">
                                <span className="font-bold text-zinc-300 mr-1.5">{c.user}:</span>
                                <span className="text-zinc-400">{c.text}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Comment Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentText[post.id] || ""}
                            onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                            onKeyDown={(e) => { if (e.key === "Enter") handleSendComment(post.id); }}
                            className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
                          />
                          <button
                            onClick={() => handleSendComment(post.id)}
                            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
          )}
        </div>

        {/* Creator support Sidebar */}
        <div className="space-y-6 relative">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 relative z-40">
            <button 
              onClick={() => setIsCreatorListOpen(!isCreatorListOpen)}
              className="flex items-center justify-between w-full text-left"
            >
              <h2 className="text-sm font-bold text-white">Support Local Talent</h2>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isCreatorListOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isCreatorListOpen && (
              <div className="mt-4 absolute left-0 right-0 top-full glass-panel p-4 rounded-2xl shadow-2xl border border-white/10 z-50 bg-[#121212] md:relative md:top-auto md:p-0 md:bg-transparent md:border-none md:shadow-none">
                <div className="space-y-3 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      value={creatorSearch}
                      onChange={(e) => setCreatorSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl glass-input text-xs"
                      placeholder="Search creators..."
                    />
                  </div>
                  <select
                    value={creatorNicheFilter}
                    onChange={(e) => setCreatorNicheFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  >
                    <option value="all">All Niches</option>
                    {creatorNicheOptions.map(niche => (
                      <option key={niche} value={niche}>{niche}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {filteredCreators.length === 0 ? (
                    <div className="text-center py-6 text-zinc-500 text-xs">
                      No creators match your search.
                    </div>
                  ) : filteredCreators.map(creator => (
                    <div key={creator.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ProfileAvatar avatar={creator.avatar} name={creator.name} className="w-9 h-9 rounded-xl text-xl" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <button className="flex items-center gap-1 font-bold text-xs text-white truncate hover:underline" onClick={() => setSelectedCreator(creator)}>
                              <h4 className="text-xs text-white truncate">{creator.name}</h4>
                              {creator.verified && <CheckCircle className="w-3 h-3 text-cyan-400 shrink-0" />}
                            </button>
                          </div>
                          <span className="text-[10px] text-zinc-500 block truncate">{creator.niche}</span>
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {creator.location}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setTippingCreator(creator)}
                        className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 font-bold text-[10px] transition-all flex items-center gap-1 shrink-0"
                      >
                        <span>Tip</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tipping Dialog Modal Overlay */}
      {tippingCreator && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1.5 flex items-center gap-1.5">
              <DollarSign className="w-5 h-5 text-purple-400" />
              <span>Send Tip to {tippingCreator.name}</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-5">
              Support {tippingCreator.name} directly. 95% of your support goes straight to their wallet.
            </p>

            <form onSubmit={handleSendTip} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {["5.00", "10.00", "25.00"].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTipAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      tipAmount === amt 
                        ? "bg-purple-600 border-purple-500 text-white" 
                        : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                    }`}
                  >
                    ${parseFloat(amt).toFixed(0)}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase">Custom Support Amount</label>
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                  <span className="text-xs text-zinc-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1.00"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    className="w-full bg-transparent text-xs border-none focus:outline-none text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase">Support message (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Keep up the amazing work!"
                  value={tipMessage}
                  onChange={(e) => setTipMessage(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setTippingCreator(null)}
                  className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gradient-brand text-white text-xs font-bold shadow-lg shadow-purple-500/10 flex items-center justify-center gap-1.5"
                >
                  <span>Send Tip</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Flag / Moderation Reason Modal Overlay */}
      {flaggingPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-400" />
              <span>Flag Post for Moderation</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Report this content. Administrators will review it on the moderation desk.
            </p>

            <form onSubmit={handleFlagPost} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase">Reason for Report</label>
                <select
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                >
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Spam / Advertisements">Spam / Advertisements</option>
                  <option value="Intellectual Property / Copyright">Intellectual Property / Copyright</option>
                  <option value="Harassment / Hate speech">Harassment / Hate speech</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFlaggingPost(null)}
                  className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Creator Detail Modal for Fan */}
      {selectedCreator && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl relative">
            <button className="absolute top-2 right-2 text-zinc-400 hover:text-white" onClick={() => setSelectedCreator(null)}>
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 mb-4">
              <ProfileAvatar avatar={selectedCreator.avatar} name={selectedCreator.name} className="w-12 h-12 rounded-xl text-2xl" />
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-1">
                  {selectedCreator.name}
                  {selectedCreator.verified && <CheckCircle className="w-4 h-4 text-cyan-400" />}
                </h3>
                <p className="text-xs text-zinc-400">{selectedCreator.niche}</p>
              </div>
            </div>
            <p className="text-sm text-zinc-300 mb-2"><strong>Location:</strong> {selectedCreator.location}</p>
            <p className="text-sm text-zinc-300 mb-2"><strong>Contact:</strong> {selectedCreator.contact}</p>
            <p className="text-sm text-zinc-300 mb-6"><strong>Bio:</strong> {selectedCreator.bio}</p>
            
            {activeRole === "fan" && (
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    startDirectMessage(selectedCreator.id);
                    setSelectedCreator(null);
                    alert("Direct Message chat created. Switch to Messages tab to view.");
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message Creator</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
