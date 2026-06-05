"use client";

import React, { useMemo, useState } from "react";
import { useApp, Creator, Post } from "@/context/AppContext";
import Link from 'next/link';
import { Rss, Filter, Heart, MessageSquare, Share2, Users, Briefcase, Wallet as WalletIcon, FileText, ImageIcon, Video, Play, ArrowLeft, Send } from "lucide-react";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export const BusinessDashboard: React.FC = () => {
  const {
    currentUser,
    businessBalance,
    creators,
    businesses,
    proposals,
    transactions,
    notifications,
    launchCampaignProposal,
    addNotification,
    activeTab,
    posts,
    likePost,
    commentOnPost,
  } = useApp();

  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [campaignTitle, setCampaignTitle] = useState("");
  const [proposalText, setProposalText] = useState("");
  const [budget, setBudget] = useState("");
  const [sending, setSending] = useState(false);

  // Content Feed State
  const [feedFilter, setFeedFilter] = useState<"all" | "public" | "subscriber" | "premium">("all");
  const [feedNiche, setFeedNiche] = useState<string>("all");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [commentText, setCommentText] = useState<{ [postId: string]: string }>({});
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const myBusiness = useMemo(() => {
    return businesses.find((b) => b.id === currentUser?.id) ?? null;
  }, [businesses, currentUser?.id]);

  const myProposals = useMemo(() => {
    return proposals.filter((p) => p.businessId === currentUser?.id);
  }, [proposals, currentUser?.id]);

  // Get all niches for filter
  const allNiches = creators.map(c => c.niche).filter((niche, index, self) => self.indexOf(niche) === index);

  // Filter posts for feed
  const feedPosts = posts
    .filter(p => feedFilter === "all" || p.visibility === feedFilter)
    .filter(p => feedNiche === "all" || creators.find(c => c.id === p.creatorId)?.niche === feedNiche);
  const paginatedPosts = feedPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleLike = (postId: string) => {
    // Persist like via backend
    likePost(postId);
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  const handleSendComment = (postId: string) => {
    if (!commentText[postId]?.trim()) return;
    commentOnPost(postId, commentText[postId]);
    setCommentText({ ...commentText, [postId]: "" });
  };

  const toggleVideo = (postId: string) => {
    setPlayingVideo(playingVideo === postId ? null : postId);
  };

  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCreator) {
      addNotification("Please select a creator first.");
      return;
    }

    if (!campaignTitle.trim()) {
      addNotification("Please enter a campaign title.");
      return;
    }

    if (!proposalText.trim()) {
      addNotification("Please write your proposal message.");
      return;
    }

    try {
      setSending(true);
      await launchCampaignProposal(selectedCreator.id, campaignTitle.trim(), proposalText.trim());
      addNotification(`Proposal sent to ${selectedCreator.name}.`);
      setSelectedCreator(null);
      setCampaignTitle("");
      setProposalText("");
      setBudget("");
    } finally {
      setSending(false);
    }
  };

  // Render based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
      case "feed":
        return renderFeed();
      
      case "campaigns":
        return renderCampaigns();
      
      case "messages":
        return renderMessages();
      
      case "wallet":
        return renderWallet();
      
      case "profile":
        return renderProfile();
      
      default:
        return renderFeed();
    }
  };

  const renderFeed = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-5">
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gradient-brand">
              {myBusiness?.name || currentUser?.fullName || "Business Hub"}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Discover content from creators across the platform.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-emerald-400 font-semibold">Wallet: {formatCurrency(businessBalance ?? 0)}</span>
          </div>
        </div>
      </div>

      {/* Feed Filters */}
      <div className="glass-panel rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rss className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Creator Content Feed</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-500" />
            <select
              value={feedFilter}
              onChange={(e) => setFeedFilter(e.target.value as "all" | "public" | "subscriber" | "premium")}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Content</option>
              <option value="public">Public Only</option>
              <option value="subscriber">Subscribers Only</option>
              <option value="premium">Premium Only</option>
            </select>
            
            <select
              value={feedNiche}
              onChange={(e) => setFeedNiche(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Niches</option>
              {allNiches.map(niche => (
                <option key={niche} value={niche}>{niche}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Feed Posts - Vertical Scroll Layout */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {feedPosts.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <Rss className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No content available in the feed.</p>
          </div>
        ) : (
          paginatedPosts.map(post => {
            const creator = creators.find(c => c.id === post.creatorId);
            const isPlaying = playingVideo === post.id;
            
            return (
              <div key={post.id} className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-cyan-500/30 transition-all">
                {/* Creator Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
                  {/* Avatar / Initial */}
                  <Link href={`/creator/${creator?.id ?? post.creatorId}`} className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                      {creator?.name?.charAt(0) || post.creatorName?.charAt(0) || "C"}
                    </div>
                  </Link>
                  {/* Name and niche */}
                  <div className="flex-1">
                    <Link href={`/creator/${creator?.id ?? post.creatorId}`} className="font-bold text-white text-sm hover:underline">
                      {creator?.name ?? post.creatorName ?? "Unknown Creator"}
                    </Link>
                    <p className="text-xs text-zinc-500">{creator?.niche ?? "Various"}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    post.visibility === "public" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    post.visibility === "subscriber" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    {post.visibility === "premium" ? `Premium $${post.price}` : post.visibility}
                  </span>
                </div>

                {/* Media Content */}
                {post.type === "video" ? (
                  <div className="relative rounded-xl bg-black/50 overflow-hidden mb-4">
                    {isPlaying && post.mediaUrl ? (
                      <video
                        src={post.mediaUrl}
                        className="w-full h-full object-cover rounded-xl"
                        controls
                        autoPlay
                      />
                    ) : (
                      <div 
                        className="w-full aspect-video rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center cursor-pointer hover:from-purple-500/30 hover:to-cyan-500/30 transition-all"
                        onClick={() => toggleVideo(post.id)}
                      >
                        <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:scale-110 transition-all">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : post.type === "image" && post.mediaUrl ? (
                  <div className="mb-4">
                    <img 
                      src={post.mediaUrl} 
                      alt={post.title}
                      className="w-full rounded-xl object-cover max-h-96"
                    />
                  </div>
                ) : null}

                {/* Post Content */}
                <div className="mb-4">
                  <h3 className="font-bold text-white text-base mb-2">{post.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{post.content}</p>
                </div>

                {/* Engagement */}
                <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 text-xs transition-all ${likedPosts.has(post.id) ? "text-rose-400" : "text-zinc-500 hover:text-rose-400"}`}
                  >
                    <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                    <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)} Likes</span>
                  </button>
                  <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments?.length || 0}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </span>
                </div>
                {/* Comments List */}
                {post.comments && post.comments.length > 0 && (
                  <div className="flex flex-col gap-2 bg-white/2 rounded-xl p-3 border border-white/5 max-h-40 overflow-y-auto mt-2">
                    {post.comments.map(c => (
                      <div key={c.id} className="text-xs leading-relaxed">
                        <span className="font-bold text-zinc-300 mr-1.5">{c.user}:</span>
                        <span className="text-zinc-400">{c.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                {/* Add Comment Input */}
                <div className="flex gap-2 mt-2">
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
            );
          })
        )}
        {/* Pagination Controls */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-white/5 text-xs disabled:opacity-50 hover:bg-white/10"
          >Prev</button>
          <span className="text-sm text-zinc-400">Page {currentPage} of {Math.ceil(feedPosts.length / pageSize) || 1}</span>
          <button
            onClick={() => setCurrentPage(p => (p * pageSize < feedPosts.length ? p + 1 : p))}
            disabled={currentPage * pageSize >= feedPosts.length}
            className="px-3 py-1 rounded bg-white/5 text-xs disabled:opacity-50 hover:bg-white/10"
          >Next</button>
        </div>
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
        </div>
        <p className="text-zinc-400 text-sm">Manage your creator campaigns and proposals.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Discover Creators */}
          <div className="glass-panel rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Discover Creators</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {creators.map((creator) => (
                <div key={creator.id} className="glass-panel-light rounded-xl p-4 border border-white/5 hover:border-cyan-500/30 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl">
                      {creator.avatar || "🎨"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{creator.name}</h3>
                      <p className="text-xs text-zinc-500">{creator.niche}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-3">{creator.bio || "No bio available."}</p>
                  <button
                    onClick={() => setSelectedCreator(creator)}
                    className="w-full py-2 rounded-xl bg-gradient-brand text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/15 transition-all"
                  >
                    Send Proposal
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* My Proposals */}
          <div className="glass-panel rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">My Proposals</h2>
            </div>

            {myProposals.length === 0 ? (
              <p className="text-sm text-zinc-400">You have not sent any proposals yet.</p>
            ) : (
              <div className="space-y-3">
                {myProposals.map((proposal) => (
                  <div key={proposal.id} className="glass-panel-light rounded-xl p-4 border border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{proposal.title}</h3>
                        <p className="text-xs text-zinc-500">To: {proposal.creatorName}</p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        proposal.status === "accepted" 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : proposal.status === "declined"
                          ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                      }`}>
                        {proposal.status}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 mt-2">{proposal.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Send Proposal Form */}
        <div>
          <div className="glass-panel rounded-2xl p-5 sticky top-[80px]">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Send Proposal</h2>
            </div>

            {selectedCreator ? (
              <form onSubmit={handleSendProposal} className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Creator</label>
                  <div className="rounded-xl px-3 py-2 text-sm text-white border border-cyan-500/20 bg-cyan-500/5">
                    {selectedCreator.name}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Campaign Title</label>
                  <input
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    placeholder="Example: Summer Promo"
                    className="glass-input w-full rounded-xl px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Budget</label>
                  <input
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Example: 250"
                    inputMode="numeric"
                    className="glass-input w-full rounded-xl px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Proposal Message</label>
                  <textarea
                    value={proposalText}
                    onChange={(e) => setProposalText(e.target.value)}
                    rows={4}
                    placeholder="Write your collaboration idea..."
                    className="glass-input w-full rounded-xl px-3 py-2 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold disabled:opacity-60 hover:shadow-lg hover:shadow-purple-500/15 transition-all"
                >
                  {sending ? "Sending..." : "Send Proposal"}
                </button>
              </form>
            ) : (
              <p className="text-sm text-zinc-400">Select a creator to send a proposal.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderWallet = () => (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-5">
        <h1 className="text-2xl font-bold text-white">Brand Wallet</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage your funds and view transactions.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <WalletIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase">Current Balance</p>
              <p className="text-3xl font-bold text-emerald-400">{formatCurrency(businessBalance ?? 0)}</p>
            </div>
          </div>
          <button className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/15 transition-all">
            Add Funds
          </button>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Total Spent</span>
              <span className="text-white font-semibold">{formatCurrency(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Active Campaigns</span>
              <span className="text-white font-semibold">{myProposals.filter(p => p.status !== "declined").length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Pending Payments</span>
              <span className="text-yellow-400 font-semibold">0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.slice(0, 10).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div>
                <p className="text-sm text-zinc-300">{tx.description}</p>
                <p className="text-xs text-zinc-500">{tx.date}</p>
              </div>
              <span className={`font-semibold ${tx.amount > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {tx.amount > 0 ? "+" : ""}{formatCurrency(typeof tx.amount === 'number' ? tx.amount : 0)}
              </span>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-sm text-zinc-500 text-center py-6">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-5">
        <h1 className="text-2xl font-bold text-white">Creator Chats</h1>
        <p className="text-zinc-400 text-sm mt-1">Message creators about campaigns.</p>
      </div>
      <div className="glass-panel rounded-2xl p-12 text-center">
        <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
        <p className="text-zinc-500 text-sm">No messages yet. Start a campaign to chat with creators!</p>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-5">
        <h1 className="text-2xl font-bold text-white">Business Profile</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage your business settings.</p>
      </div>
      <div className="glass-panel rounded-2xl p-12 text-center">
        <p className="text-zinc-500 text-sm">Profile settings coming soon...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        {renderContent()}
      </div>
    </div>
  );
};