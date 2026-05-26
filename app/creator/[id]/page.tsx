"use client";
import React, { use, useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Lock, Grid, PlaySquare, UserSquare, UserPlus, ChevronDown, MoreHorizontal, X, Send, BadgeCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import type { Post } from "@/context/AppContext";

export default function CreatorPage({ params }: { params: { id: string } }) {
  const { id } = use(params);
  const { creators, posts, activeRole, isAuthenticated, setActiveTab, commentOnPost, likePost, startChat } = useApp();
  const router = useRouter();
  
  const creator = creators.find(c => c.id === id);
  
  const [localTab, setLocalTab] = useState("Posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  
  // Post modal state
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (creator) {
      setFollowersCount(creator.followers);
    }
  }, [creator]);

  if (!creator) return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 text-black">Creator not found.</main>
      </div>
    </div>
  );

  const creatorPosts = posts.filter(p => p.creatorId === creator.id && !p.flagged);
  const username = creator.name.toLowerCase().replace(/\s+/g, '');

  const handleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount(prev => prev - 1);
    } else {
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
    }
  };

  const handleMessageClick = () => {
    if (creator) {
      startChat(creator.id, creator.name);
    }
    setActiveTab("messages");
    router.push("/");
  };

  const openPost = (post: Post) => {
    setSelectedPost(post);
  };

  const closePost = () => {
    setSelectedPost(null);
    setCommentText("");
  };

  const handleComment = () => {
    if (!commentText.trim() || !selectedPost) return;
    commentOnPost(selectedPost.id, commentText);
    
    // Update local modal state immediately for snappy UI
    setSelectedPost({
      ...selectedPost, 
      comments: [...selectedPost.comments, { id: Date.now().toString(), user: "You", text: commentText }]
    });
    setCommentText("");
  };

  // Mock logic to check if current user has access to this post
  const hasAccess = (post: Post) => {
    if (post.visibility === "public") return true;
    if (post.isLocked === false) return true;
    return false; 
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />
      <div className="flex-1 flex">
        {/* Only show Sidebar if authenticated and not in landing role */}
        {isAuthenticated && activeRole !== "landing" && <Sidebar />}
        
        <main className="flex-1 overflow-y-auto bg-white relative">
          <div className="max-w-[935px] mx-auto p-4 md:pt-10 md:pb-8">
            
            {/* Instagram Style Header */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-20 items-start mb-12">
              {/* Avatar */}
              <div className="shrink-0 md:ml-12 md:pl-6 mx-auto md:mx-0">
                <div className="w-36 h-36 md:w-[150px] md:h-[150px] rounded-full bg-zinc-100 border border-gray-200 flex items-center justify-center text-6xl overflow-hidden shadow-sm p-1">
                  <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                     {creator.avatar}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col gap-4 w-full">
                
                {/* Username & More Icon */}
                <div className="flex items-center gap-4">
                  <h1 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                    {username}
                    {creator.verified && <BadgeCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />}
                  </h1>
                  <button className="text-gray-800 hover:text-black">
                    <MoreHorizontal className="w-6 h-6" />
                  </button>
                </div>

                {/* Real Name */}
                <div className="text-[15px]">
                  <span className="font-semibold">{creator.name}</span>
                </div>

                {/* Stats */}
                <div className="flex gap-6 md:gap-10 text-[15px]">
                  <div><span className="font-semibold">{creatorPosts.length}</span> posts</div>
                  <div><span className="font-semibold">{followersCount.toLocaleString()}</span> followers</div>
                  <div><span className="font-semibold">515</span> following</div>
                </div>

                {/* Bio & Contact */}
                <div className="text-[15px] whitespace-pre-wrap max-w-lg text-gray-900 leading-tight">
                  <p className="mb-2">{creator.bio || `${creator.niche}\nWelcome to my page! Subscribe for exclusive content.`}</p>
                  {creator.contact && (
                    <a href={`mailto:${creator.contact}`} className="text-blue-700 hover:underline font-medium">
                      {creator.contact}
                    </a>
                  )}
                </div>

                {/* Followed by (Mock) */}
                <div className="text-xs text-gray-500">
                  Followed by <span className="font-semibold text-black">alice_smith</span>, <span className="font-semibold text-black">john.doe</span>, and <span className="font-semibold text-black">others</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-1">
                  <button 
                    onClick={handleFollow}
                    className={`flex-1 md:flex-none md:px-8 font-semibold py-1.5 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm ${isFollowing ? 'bg-[#efefef] text-black hover:bg-[#dbdbdb]' : 'bg-[#0095f6] hover:bg-[#1877f2] text-white'}`}
                  >
                    {isFollowing ? <>Following <ChevronDown className="w-4 h-4" /></> : "Follow"}
                  </button>
                  <button 
                    onClick={handleMessageClick}
                    className="flex-1 md:flex-none md:px-8 bg-[#efefef] hover:bg-[#dbdbdb] text-black font-semibold py-1.5 rounded-lg flex items-center justify-center transition-colors text-sm"
                  >
                    Message
                  </button>
                  <button className="bg-[#efefef] hover:bg-[#dbdbdb] text-black font-semibold py-1.5 px-3 rounded-lg flex items-center justify-center transition-colors">
                    <UserPlus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-200 flex justify-center gap-12">
              <button 
                onClick={() => setLocalTab("Posts")}
                className={`flex items-center gap-2 py-4 text-xs font-semibold tracking-widest uppercase border-t-[1px] -mt-[1px] transition-colors ${localTab === "Posts" ? "border-black text-black" : "border-transparent text-gray-500"}`}
              >
                <Grid className="w-4 h-4" /> Posts
              </button>
              <button 
                onClick={() => setLocalTab("Reels")}
                className={`flex items-center gap-2 py-4 text-xs font-semibold tracking-widest uppercase border-t-[1px] -mt-[1px] transition-colors ${localTab === "Reels" ? "border-black text-black" : "border-transparent text-gray-500"}`}
              >
                <PlaySquare className="w-4 h-4" /> Reels
              </button>
              <button 
                onClick={() => setLocalTab("Tagged")}
                className={`flex items-center gap-2 py-4 text-xs font-semibold tracking-widest uppercase border-t-[1px] -mt-[1px] transition-colors ${localTab === "Tagged" ? "border-black text-black" : "border-transparent text-gray-500"}`}
              >
                <UserSquare className="w-4 h-4" /> Tagged
              </button>
            </div>

            {/* Grid Content */}
            {localTab === "Posts" && (
              <div className="grid grid-cols-3 gap-1 md:gap-4 mt-2">
                {creatorPosts.map((post) => (
                  <div key={post.id} onClick={() => openPost(post)} className="aspect-square bg-gray-100 relative group cursor-pointer overflow-hidden rounded-sm md:rounded-md border border-gray-200">
                    {post.mediaUrl ? (
                      <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-zinc-50">
                        <p className="font-bold text-gray-700 text-[10px] md:text-sm line-clamp-3">{post.title}</p>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-sm md:text-base">
                       <span>❤️ {post.likes}</span>
                       <span>💬 {post.comments.length}</span>
                    </div>

                    {/* Lock Icon for Subscribers/Premium */}
                    {(post.visibility === "subscriber" || post.visibility === "premium") && post.isLocked !== false && (
                      <div className="absolute top-2 right-2 bg-white/90 p-1.5 md:p-2 rounded-full text-black shadow-sm z-10 backdrop-blur-md">
                        <Lock className="w-3 h-3 md:w-4 md:h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Other Tabs (Empty state) */}
            {localTab !== "Posts" && (
              <div className="py-20 text-center text-gray-500">
                No {localTab.toLowerCase()} yet.
              </div>
            )}
            
          </div>
          
          {/* Post Modal */}
          {selectedPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative">
                <button onClick={closePost} className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black text-white rounded-full transition-colors md:hidden">
                  <X className="w-5 h-5" />
                </button>
                
                {/* Media Side */}
                <div className="w-full md:w-[55%] bg-black flex items-center justify-center relative min-h-[300px]">
                  {selectedPost.mediaUrl ? (
                    <img src={selectedPost.mediaUrl} alt={selectedPost.title} className="max-w-full max-h-[90vh] object-contain" />
                  ) : (
                    <div className="p-8 text-center text-white">
                       <h3 className="text-2xl font-bold mb-4">{selectedPost.title}</h3>
                       <p className="text-gray-300 whitespace-pre-wrap">{selectedPost.content}</p>
                    </div>
                  )}
                  
                  {/* If Locked overlay */}
                  {!hasAccess(selectedPost) && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-8 text-center">
                      <Lock className="w-16 h-16 mb-4 text-gray-400" />
                      <h3 className="text-xl font-bold mb-2">Exclusive Content</h3>
                      <p className="text-gray-300 mb-6">Subscribe to {creator.name} to unlock this post and comment.</p>
                      <button className="bg-[#0095f6] hover:bg-[#1877f2] text-white px-8 py-3 rounded-lg font-bold transition-colors">
                        Subscribe for Access
                      </button>
                    </div>
                  )}
                </div>

                {/* Details/Comments Side */}
                <div className="w-full md:w-[45%] flex flex-col bg-white h-[50vh] md:h-[90vh]">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-xs text-white border border-gray-200">
                        {creator.avatar}
                      </div>
                      <span className="font-bold text-sm flex items-center gap-1">
                        {username}
                        {creator.verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                      </span>
                    </div>
                    <button onClick={closePost} className="hidden md:block p-1 hover:bg-gray-100 rounded-full transition-colors">
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  {/* Comments Area */}
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {/* Post Caption */}
                    <div className="flex gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-xs shrink-0 text-white mt-1 border border-gray-200">
                        {creator.avatar}
                      </div>
                      <div className="text-sm">
                        <span className="font-bold mr-2">{username}</span>
                        {selectedPost.content}
                      </div>
                    </div>
                    
                    {/* Comments List */}
                    {hasAccess(selectedPost) ? (
                       <div className="space-y-4">
                         {selectedPost.comments.length === 0 ? (
                           <p className="text-gray-400 text-sm text-center py-4">No comments yet. Be the first!</p>
                         ) : (
                           selectedPost.comments.map(c => (
                             <div key={c.id} className="flex gap-3 text-sm">
                               <div className="font-bold shrink-0">{c.user}</div>
                               <div className="text-gray-700">{c.text}</div>
                             </div>
                           ))
                         )}
                       </div>
                    ) : (
                       <div className="py-8 text-center text-sm text-gray-500">
                         Comments are hidden for locked posts.
                       </div>
                    )}
                  </div>

                  {/* Actions & Add Comment */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-4 mb-4">
                       <button 
                         onClick={() => {
                           likePost(selectedPost.id);
                           setSelectedPost({ ...selectedPost, likes: selectedPost.likes + 1 });
                         }}
                         className="hover:text-red-500 transition-colors flex items-center gap-1.5 font-semibold text-lg"
                       >
                         ❤️ {selectedPost.likes}
                       </button>
                       <button className="hover:text-gray-500 transition-colors flex items-center gap-1.5 font-semibold text-lg">
                         💬 {selectedPost.comments.length}
                       </button>
                    </div>
                    
                    {hasAccess(selectedPost) ? (
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Add a comment..."
                          className="w-full bg-gray-100 rounded-full py-2.5 pl-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-black border border-gray-200"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                        />
                        <button 
                          onClick={handleComment}
                          disabled={!commentText.trim()}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 disabled:text-gray-400 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="bg-gray-100 text-gray-500 text-sm p-3 rounded-lg text-center font-medium">
                        Unlock post to comment
                      </div>
                    )}
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
