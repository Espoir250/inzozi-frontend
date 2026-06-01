"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp, Role } from "@/context/AppContext";
import { 
  Sparkles, 
  Briefcase, 
  Heart, 
  Shield, 
  ArrowRight, 
  Flame, 
  Compass, 
  Lock, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Award, 
  Star 
} from "lucide-react";

export const Hero: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, setActiveRole, setActiveTab } = useApp();
  
  // Custom video player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Creator visual tabs state
  const [activeCreatorTab, setActiveCreatorTab] = useState<"monetization" | "sponsorship" | "analytics">("monetization");

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

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.log("Video play interrupted", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      if (duration && isFinite(duration)) {
        const progress = (videoRef.current.currentTime / duration) * 100;
        setVideoProgress(progress || 0);
      }
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      const progressVal = parseFloat(e.target.value);
      if (duration && isFinite(duration)) {
        const newTime = (progressVal / 100) * duration;
        if (isFinite(newTime)) {
          videoRef.current.currentTime = newTime;
        }
      }
      setVideoProgress(progressVal);
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

  const creatorBenefits = {
    monetization: {
      title: "Fan-Supported Monetization",
      subtitle: "Subscriptions & Direct Tipping",
      desc: "Build recurring revenue with subscribers-only post streams and earn immediate gratuity through responsive digital tip jars. Control content access levels dynamically.",
      stats: "$420 Avg. Monthly Tip Value",
      image: "/creator_earnings.png",
      tag: "100% Direct",
      icon: <Heart className="w-5 h-5 text-rose-400" />
    },
    sponsorship: {
      title: "Escrow-Secured Brand Deals",
      subtitle: "Direct Brand Partnerships",
      desc: "Say goodbye to delayed payments. Integrate with verified business sponsors through our smart milestone contract registry. Budgets are auto-locked in secure platform escrow before you ever press record.",
      stats: "$1.5K+ Average Escrow Deal Size",
      image: "/brand_collab.png",
      tag: "Escrow Shielded",
      icon: <Briefcase className="w-5 h-5 text-cyan-400" />
    },
    analytics: {
      title: "Granular Creator Analytics",
      subtitle: "Interactive Performance Dashboards",
      desc: "Visualize growth metrics, track engagement rates, and capture revenue analytics. Tailor your digital marketing campaigns using authentic post performance data gathered in real-time.",
      stats: "+8.4% Average Engagement Rate",
      image: "/creator_dashboard.png",
      tag: "AI Powered Insights",
      icon: <TrendingUp className="w-5 h-5 text-purple-400" />
    }
  };

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
            className="px-8 py-4 rounded-xl bg-gradient-brand text-white font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 hover:scale-102 hover-scale flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explore Creator Market</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleRoleSelection("business")}
            className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-200 font-semibold hover-scale flex items-center justify-center gap-2 cursor-pointer"
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
      <div className="w-full mb-28">
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
              className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs border border-rose-500/20 transition-all cursor-pointer"
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
              className="w-full py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-semibold text-xs border border-purple-500/20 transition-all cursor-pointer"
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
              className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-semibold text-xs border border-cyan-500/20 transition-all cursor-pointer"
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
              className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold text-xs border border-amber-500/20 transition-all cursor-pointer"
            >
              Enter as Admin
            </button>
          </div>
        </div>
      </div>

      {/* NEW: WHY CREATORS LOVE INZOZIMARKET SECTION */}
      <div className="w-full max-w-6xl mx-auto mb-28 border-t border-b border-white/5 py-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Built For Content Creators</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Ignite Your Digital Ecosystem
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            InzoziMarket equips creators with premium direct-to-audience monetization utilities, legally binding escrow protect partnerships, and live statistics to transform digital hobbyism into high-growth enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Interactive Custom Video Player (Left Column: 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="glass-panel p-2 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
              
              {/* HTML5 Custom Video Player */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/60">
                <video
                  ref={videoRef}
                  src="https://assets.mixkit.co/videos/preview/mixkit-woman-recording-a-video-for-a-blog-41710-large.mp4"
                  className="w-full h-full object-cover"
                  loop
                  muted={isMuted}
                  onTimeUpdate={handleTimeUpdate}
                  onClick={togglePlay}
                />
                
                {/* Floating overlay stats details to showcase monetization features in action */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-semibold text-white">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                    <span>Escrow Secured: $250.00 locked</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-semibold text-purple-300">
                    <Star className="w-3 h-3 text-purple-400 fill-purple-400 animate-spin" />
                    <span>New Subscription! +$10.00</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-bold text-[9px] uppercase tracking-wide">
                    Live Demo Video
                  </span>
                </div>

                {/* Big Center Play Button Overlay if paused */}
                {!isPlaying && (
                  <button 
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-purple-600/90 border border-purple-500/20 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
                  >
                    <Play className="w-7 h-7 fill-current ml-1 text-white" />
                  </button>
                )}

                {/* Custom Glassmorphism Controls Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-3 opacity-90 group-hover:opacity-100 transition-opacity z-20">
                  
                  {/* Progress Bar slider */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-300 font-medium">
                      {videoRef.current ? Math.floor(videoRef.current.currentTime).toString().padStart(2, "0") : "00"}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={videoProgress}
                      onChange={handleProgressChange}
                      className="flex-grow h-1 rounded-lg appearance-none cursor-pointer bg-white/20 accent-purple-500"
                      style={{
                        background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${videoProgress}%, rgba(255,255,255,0.2) ${videoProgress}%, rgba(255,255,255,0.2) 100%)`
                      }}
                    />
                    <span className="text-[10px] text-zinc-300 font-medium">
                      {videoRef.current && !isNaN(videoRef.current.duration) ? Math.floor(videoRef.current.duration).toString().padStart(2, "0") : "08"}
                    </span>
                  </div>

                  {/* Play & Mute Toggles */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={togglePlay} 
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4.5 h-4.5 text-white" /> : <Play className="w-4.5 h-4.5 fill-current text-white" />}
                      </button>
                      
                      <button 
                        onClick={toggleMute} 
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
                      >
                        {isMuted ? <VolumeX className="w-4.5 h-4.5 text-white" /> : <Volume2 className="w-4.5 h-4.5 text-white" />}
                      </button>
                    </div>

                    <div className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                      Demo: Inzozi Streaming Hub
                    </div>
                  </div>

                </div>

              </div>

            </div>
            
            <div className="text-center mt-3 text-xs text-zinc-500">
              💡 <span className="font-semibold text-zinc-400">Interactive:</span> Use the video player controls or click the side cards to browse live platform mockup visuals.
            </div>
          </div>

          {/* Interactive Pillars Card Tabs (Right Column: 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Direct Monetization Tab */}
            <div 
              onClick={() => setActiveCreatorTab("monetization")}
              className={`p-5 rounded-2xl border text-left cursor-pointer transition-all hover-scale ${
                activeCreatorTab === "monetization" 
                  ? "bg-purple-950/10 border-purple-500/40 shadow-lg shadow-purple-500/5" 
                  : "bg-white/2 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                  activeCreatorTab === "monetization" ? "bg-purple-500/20 border-purple-500/30" : "bg-white/5 border-white/10"
                }`}>
                  <Heart className={`w-4.5 h-4.5 ${activeCreatorTab === "monetization" ? "text-purple-400" : "text-zinc-400"}`} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{creatorBenefits.monetization.title}</h3>
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                    {creatorBenefits.monetization.subtitle}
                  </span>
                </div>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Unlock subscriber-only posts and receive instant tips straight to your wallet, subject to negligible transaction costs.
              </p>
            </div>

            {/* Brand Collabs / Escrow Tab */}
            <div 
              onClick={() => setActiveCreatorTab("sponsorship")}
              className={`p-5 rounded-2xl border text-left cursor-pointer transition-all hover-scale ${
                activeCreatorTab === "sponsorship" 
                  ? "bg-cyan-950/10 border-cyan-500/40 shadow-lg shadow-cyan-500/5" 
                  : "bg-white/2 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                  activeCreatorTab === "sponsorship" ? "bg-cyan-500/20 border-cyan-500/30" : "bg-white/5 border-white/10"
                }`}>
                  <Briefcase className={`w-4.5 h-4.5 ${activeCreatorTab === "sponsorship" ? "text-cyan-400" : "text-zinc-400"}`} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{creatorBenefits.sponsorship.title}</h3>
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                    {creatorBenefits.sponsorship.subtitle}
                  </span>
                </div>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Connect with brands on contract terms. Sponsorship budgets are locked securely in digital escrow vaults.
              </p>
            </div>

            {/* Analytics Tab */}
            <div 
              onClick={() => setActiveCreatorTab("analytics")}
              className={`p-5 rounded-2xl border text-left cursor-pointer transition-all hover-scale ${
                activeCreatorTab === "analytics" 
                  ? "bg-emerald-950/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5" 
                  : "bg-white/2 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                  activeCreatorTab === "analytics" ? "bg-emerald-500/20 border-emerald-500/30" : "bg-white/5 border-white/10"
                }`}>
                  <TrendingUp className={`w-4.5 h-4.5 ${activeCreatorTab === "analytics" ? "text-emerald-400" : "text-zinc-400"}`} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{creatorBenefits.analytics.title}</h3>
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                    {creatorBenefits.analytics.subtitle}
                  </span>
                </div>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Track revenue patterns, verify subscriber numbers, and measure absolute post engagement rates dynamically.
              </p>
            </div>

          </div>
        </div>

        {/* Dynamic Display of AI-Generated UI Mockup Graphics based on the selected tab */}
        <div className="w-full glass-panel p-4 rounded-3xl border border-white/5 overflow-hidden shadow-xl mb-16 relative">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[9px] font-bold text-purple-300 uppercase tracking-widest backdrop-blur-md">
              {creatorBenefits[activeCreatorTab].tag}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[9px] font-bold text-white uppercase tracking-widest backdrop-blur-md">
              {creatorBenefits[activeCreatorTab].stats}
            </span>
          </div>

          <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-black/80 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={creatorBenefits[activeCreatorTab].image} 
              alt={creatorBenefits[activeCreatorTab].title}
              className="w-full h-full object-cover opacity-90 transition-all hover:opacity-100 hover:scale-[1.01] duration-500"
            />
          </div>
        </div>

        {/* TESTIMONIALS / CREATOR SUCCESS STORIES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="glass-panel p-8 rounded-3xl border border-white/5 relative flex flex-col justify-between">
            <div className="absolute top-6 right-8 text-6xl text-purple-500/10 font-serif select-none pointer-events-none">“</div>
            <div className="space-y-4 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-zinc-300 text-xs md:text-sm leading-relaxed italic">
                "Moving my content sponsorships to InzoziMarket's escrow vault eliminated payment delays. I received instant payouts when my milestones were approved! The brand integration is completely transparent."
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-xl">🎨</div>
              <div>
                <h4 className="font-bold text-xs text-white">Kirenga Tech</h4>
                <span className="text-[10px] text-zinc-500">Tech & AI Creator • Kigali, Rwanda</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/5 relative flex flex-col justify-between">
            <div className="absolute top-6 right-8 text-6xl text-purple-500/10 font-serif select-none pointer-events-none">“</div>
            <div className="space-y-4 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-zinc-300 text-xs md:text-sm leading-relaxed italic">
                "My subscriber count grew by 40% in two months. Fans love the simple tipping interface and premium locked sketchbooks. The analytic boards gave me absolute clarity on what fabric designs my audience wants."
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-xl">👗</div>
              <div>
                <h4 className="font-bold text-xs text-white">Ganza Designs</h4>
                <span className="text-[10px] text-zinc-500">Fashion & Art Creator • Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* HIGH-IMPACT CREATOR CTA CARD */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/20 via-black/40 to-cyan-950/20 text-center relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>

          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Launch Your Digital Value Today</h3>
          <p className="text-zinc-400 text-xs md:text-sm max-w-lg mx-auto mb-8 leading-relaxed">
            Create subscriptions, enable gratuities, and establish secure escrow brand sponsorships in minutes. Join thousands of creators building independent businesses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleRoleSelection("creator")}
              className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/10 transition-all hover:scale-105"
            >
              <span>Setup Creator Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleRoleSelection("creator")}
              className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-200 font-bold text-xs cursor-pointer transition-all hover:scale-105"
            >
              Configure Subscription Tiers
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

