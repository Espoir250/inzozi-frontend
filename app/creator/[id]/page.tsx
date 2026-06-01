"use client";

import React, { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Bell,
  Check,
  Eye,
  Heart,
  Lock,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { useApp } from "@/context/AppContext";
import type { Post } from "@/context/AppContext";

const isImageAvatar = (avatar?: string) => {
  if (!avatar) return false;
  return avatar.startsWith("http://") || avatar.startsWith("https://") || avatar.startsWith("data:image/") || avatar.startsWith("/");
};

const formatCount = (value: number) =>
  Intl.NumberFormat("en").format(value);

const visibilityCopy: Record<Post["visibility"], string> = {
  public: "Public",
  subscriber: "Subscribers",
  premium: "Premium",
};

export default function CreatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const {
    creators,
    posts,
    activeRole,
    isAuthenticated,
    setActiveTab,
    commentOnPost,
    likePost,
    startChat,
    subscribeToCreator,
  } = useApp();

  const creator = creators.find(c => c.id === id);
  const creatorPosts = useMemo(
    () => posts.filter(post => post.creatorId === id && !post.flagged),
    [id, posts],
  );

  const initialFollowing = () => {
    if (typeof window === "undefined") return false;
    return JSON.parse(localStorage.getItem("inzozi_followed_creators") ?? "[]").includes(id);
  };

  const initialSubscribed = () => {
    if (typeof window === "undefined") return false;
    return JSON.parse(localStorage.getItem("inzozi_fan_subscriptions") ?? "[]").includes(id);
  };

  const [initialFollowingState] = useState(initialFollowing);
  const [initialSubscribedState] = useState(initialSubscribed);
  const [isFollowing, setIsFollowing] = useState(initialFollowingState);
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribedState);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState("");

  if (!creator) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f7f3ea] text-zinc-950">
        <Navbar />
        <div className="flex flex-1">
          {isAuthenticated && activeRole !== "landing" && <Sidebar />}
          <main className="flex-1 p-8">
            <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-950">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">Creator not found.</div>
          </main>
        </div>
      </div>
    );
  }

  const visiblePosts = creatorPosts.filter(post => isSubscribed || post.visibility === "public");
  const lockedPosts = creatorPosts.filter(post => !isSubscribed && post.visibility !== "public");
  
  const followerCount = creator.followers 
    + (isFollowing && !initialFollowingState ? 1 : 0) 
    - (!isFollowing && initialFollowingState ? 1 : 0);
    
  const subscriberCount = creator.subscribersCount 
    + (isSubscribed && !initialSubscribedState ? 1 : 0) 
    - (!isSubscribed && initialSubscribedState ? 1 : 0);

  const username = creator.name.toLowerCase().replace(/[^a-z0-9]+/g, ".");

  const persistIdList = (key: string, nextIsActive: boolean) => {
    const saved = JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
    const updated = nextIsActive ? Array.from(new Set([...saved, creator.id])) : saved.filter(savedId => savedId !== creator.id);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const handleFollow = () => {
    const next = !isFollowing;
    setIsFollowing(next);
    persistIdList("inzozi_followed_creators", next);
  };

  const handleSubscribe = () => {
    if (isSubscribed) {
      setIsSubscribed(false);
      persistIdList("inzozi_fan_subscriptions", false);
      return;
    }

    const success = subscribeToCreator(creator.id);
    if (!success) return;

    setIsSubscribed(true);
    persistIdList("inzozi_fan_subscriptions", true);
  };

  const handleMessageClick = () => {
    startChat(creator.id, creator.name);
    setActiveTab("messages");
    router.push("/");
  };

  const handleComment = () => {
    if (!commentText.trim() || !selectedPost) return;
    commentOnPost(selectedPost.id, commentText.trim());
    setSelectedPost({
      ...selectedPost,
      comments: [...selectedPost.comments, { id: Date.now().toString(), user: "You", text: commentText.trim() }],
    });
    setCommentText("");
  };

  const handleLike = (post: Post) => {
    likePost(post.id);
    if (selectedPost?.id === post.id) {
      setSelectedPost({ ...selectedPost, likes: selectedPost.likes + 1 });
    }
  };

  const canOpenPost = (post: Post) => isSubscribed || post.visibility === "public";

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f3ea] text-zinc-950">
      <Navbar />
      <div className="flex flex-1">
        {isAuthenticated && activeRole !== "landing" && <Sidebar />}

        <main className="flex-1 overflow-y-auto">
          <section className="border-b border-zinc-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
              <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-950">
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)_280px] lg:items-end">
                <div className="flex justify-center lg:justify-start">
                  <div className="relative h-44 w-44 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 shadow-xl">
                    {isImageAvatar(creator.avatar) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={creator.avatar} alt={`${creator.name} profile picture`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-6xl text-white">{creator.avatar || creator.name.charAt(0)}</div>
                    )}
                    <div className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      {creator.verified ? "Verified" : "Creator"}
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800">{creator.niche}</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-600">
                      <MapPin className="h-3.5 w-3.5" />
                      {creator.location}
                    </span>
                  </div>

                  <h1 className="flex flex-wrap items-center gap-2 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
                    {creator.name}
                    {creator.verified && <BadgeCheck className="h-7 w-7 text-cyan-600" />}
                  </h1>
                  <p className="mt-2 text-sm font-semibold text-zinc-500">@{username}</p>
                  <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-700">{creator.bio}</p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-[#fbfaf6] p-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <strong className="block text-xl font-black">{creatorPosts.length}</strong>
                      <span className="text-[10px] font-bold uppercase text-zinc-500">Posts</span>
                    </div>
                    <div>
                      <strong className="block text-xl font-black">{formatCount(followerCount)}</strong>
                      <span className="text-[10px] font-bold uppercase text-zinc-500">Followers</span>
                    </div>
                    <div>
                      <strong className="block text-xl font-black">{formatCount(subscriberCount)}</strong>
                      <span className="text-[10px] font-bold uppercase text-zinc-500">Subscribers</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <button
                  onClick={handleFollow}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black transition-all border ${
                    isFollowing 
                      ? "bg-black text-white border-black hover:bg-zinc-900" 
                      : "bg-white text-black border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  {isFollowing ? <Check className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <button
                  onClick={handleSubscribe}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black transition-all border ${
                    isSubscribed 
                      ? "bg-black text-white border-black hover:bg-zinc-900" 
                      : "bg-white text-black border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  <Star className="h-4 w-4" />
                  {isSubscribed ? "Subscribed" : "Subscribe for all content"}
                </button>
                <button
                  onClick={handleMessageClick}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-3 text-sm font-black text-zinc-950 hover:bg-zinc-50"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message
                </button>
              </div>
            </div>
          </section>

          <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-10">
            <aside className="space-y-4">
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-black uppercase tracking-wide text-zinc-950">About</h2>
                <dl className="mt-4 space-y-4 text-sm">
                  <div>
                    <dt className="text-xs font-bold uppercase text-zinc-500">Niche</dt>
                    <dd className="mt-1 font-semibold text-zinc-900">{creator.niche}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase text-zinc-500">Audience</dt>
                    <dd className="mt-1 font-semibold text-zinc-900">{formatCount(followerCount)} followers</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase text-zinc-500">Members</dt>
                    <dd className="mt-1 font-semibold text-zinc-900">{formatCount(subscriberCount)} subscribers</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase text-zinc-500">Engagement</dt>
                    <dd className="mt-1 font-semibold text-zinc-900">{creator.engagement}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-950 p-5 text-white shadow-sm">
                <Sparkles className="h-5 w-5 text-cyan-300" />
                <h3 className="mt-3 text-sm font-black">Access levels</h3>
                <p className="mt-2 text-xs leading-5 text-zinc-300">Followers see public posts and get creator updates. Subscribers unlock every post on this profile.</p>
              </div>
            </aside>

            <div className="space-y-6">
              <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-zinc-950">{isSubscribed ? "All creator content" : "Public content preview"}</h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    {isSubscribed
                      ? "Your subscription gives you access to public, subscriber, and premium posts."
                      : `${lockedPosts.length} subscriber-only post${lockedPosts.length === 1 ? "" : "s"} will unlock after subscribing.`}
                  </p>
                </div>
                <span className="inline-flex w-max items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">
                  <Eye className="h-3.5 w-3.5" />
                  Showing {visiblePosts.length} of {creatorPosts.length}
                </span>
              </div>

              {creatorPosts.length === 0 ? (
                <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500">No posts published yet.</div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {creatorPosts.map(post => {
                    const locked = !canOpenPost(post);

                    return (
                      <article key={post.id} className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                        <button onClick={() => !locked && setSelectedPost(post)} className="block w-full text-left disabled:cursor-not-allowed" disabled={locked}>
                          <div className="relative aspect-[4/3] bg-zinc-100">
                            {post.mediaUrl ? (
                              post.type === "video" ? (
                                <video src={post.mediaUrl} className={`h-full w-full object-cover transition-transform group-hover:scale-105 ${locked ? "blur-sm grayscale" : ""}`} muted playsInline />
                              ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={post.mediaUrl} alt={post.title} className={`h-full w-full object-cover transition-transform group-hover:scale-105 ${locked ? "blur-sm grayscale" : ""}`} />
                              )
                            ) : (
                              <div className={`flex h-full w-full items-center justify-center p-6 text-center ${locked ? "blur-sm" : ""}`}>
                                <h3 className="text-lg font-black text-zinc-800">{post.title}</h3>
                              </div>
                            )}
                            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase text-zinc-700 shadow-sm backdrop-blur">
                              {visibilityCopy[post.visibility]}
                            </span>
                            {locked && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/65 p-6 text-center text-white">
                                <Lock className="h-8 w-8" />
                                <strong className="mt-3 text-sm">Subscriber access</strong>
                                <span className="mt-1 text-xs text-zinc-200">Subscribe to view this post.</span>
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <h3 className="line-clamp-2 text-base font-black text-zinc-950">{post.title}</h3>
                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">{post.content}</p>
                            <div className="mt-4 flex items-center gap-4 text-xs font-bold text-zinc-500">
                              <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {post.likes}</span>
                              <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {post.comments.length}</span>
                            </div>
                          </div>
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {selectedPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
              <div className="grid max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
                <div className="flex min-h-[320px] items-center justify-center bg-zinc-950">
                  {selectedPost.mediaUrl ? (
                    selectedPost.type === "video" ? (
                      <video src={selectedPost.mediaUrl} className="max-h-[90vh] w-full object-contain" controls autoPlay />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={selectedPost.mediaUrl} alt={selectedPost.title} className="max-h-[90vh] w-full object-contain" />
                    )
                  ) : (
                    <div className="p-8 text-center text-white">
                      <h3 className="text-2xl font-black">{selectedPost.title}</h3>
                      <p className="mt-4 text-zinc-300">{selectedPost.content}</p>
                    </div>
                  )}
                </div>

                <div className="flex max-h-[90vh] flex-col">
                  <div className="flex items-center justify-between border-b border-zinc-200 p-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-black text-zinc-950">{selectedPost.title}</h3>
                      <p className="text-xs font-semibold text-zinc-500">{visibilityCopy[selectedPost.visibility]} content</p>
                    </div>
                    <button onClick={() => setSelectedPost(null)} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5">
                    <p className="text-sm leading-7 text-zinc-700">{selectedPost.content}</p>
                    <div className="mt-6 space-y-3">
                      {selectedPost.comments.length === 0 ? (
                        <p className="rounded-lg bg-zinc-50 p-4 text-center text-sm text-zinc-500">No comments yet.</p>
                      ) : (
                        selectedPost.comments.map(comment => (
                          <div key={comment.id} className="rounded-lg bg-zinc-50 p-3 text-sm">
                            <strong className="mr-2 text-zinc-950">{comment.user}</strong>
                            <span className="text-zinc-700">{comment.text}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="border-t border-zinc-200 p-4">
                    <div className="mb-3 flex gap-4 text-sm font-bold text-zinc-600">
                      <button onClick={() => handleLike(selectedPost)} className="inline-flex items-center gap-1.5 hover:text-rose-600">
                        <Heart className="h-4 w-4" />
                        {selectedPost.likes}
                      </button>
                      <span className="inline-flex items-center gap-1.5">
                        <MessageCircle className="h-4 w-4" />
                        {selectedPost.comments.length}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && handleComment()}
                        placeholder="Add a comment..."
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-3 pl-4 pr-12 text-sm outline-none focus:border-zinc-950"
                      />
                      <button onClick={handleComment} disabled={!commentText.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-cyan-700 hover:bg-cyan-50 disabled:text-zinc-400">
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
