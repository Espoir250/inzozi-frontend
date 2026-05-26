"use client";

import React, { useState } from "react";
import { useApp, Creator } from "@/context/AppContext";
import { 
  Search, 
  CheckCircle, 
  MapPin, 
  Activity, 
  Send, 
  Briefcase, 
  AlertTriangle,
  Phone
} from "lucide-react";

export const BusinessDashboard: React.FC = () => {
  const { 
    creators, 
    businessBalance, 
    proposals, 
    launchCampaignProposal 
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [nicheFilter, setNicheFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");

  // Selection state for active collaboration proposal
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  
  // Collaboration form state
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignDetails, setCampaignDetails] = useState("");
  const [campaignBudget, setCampaignBudget] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [campaignDate, setCampaignDate] = useState('');
  const nicheOptions = Array.from(new Set(creators.map(creator => creator.niche).filter(Boolean))).sort();

  const handleOpenCollab = (creator: Creator) => {
    setSelectedCreator(creator);
    setCampaignBudget(creator.collabPrice.toString());
    setCampaignTitle(`${creator.name} Brand Partnership`);
    setErrorMsg("");
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreator || !campaignTitle || !campaignDetails || !campaignBudget) return;

    const budgetNum = parseFloat(campaignBudget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      setErrorMsg("Please enter a valid budget amount.");
      return;
    }

    if (budgetNum > businessBalance) {
      setErrorMsg(`Insufficient funds in wallet! Your balance is $${businessBalance.toFixed(2)}. Deposit more in the Wallet tab.`);
      return;
    }

    launchCampaignProposal(selectedCreator.id, campaignTitle, campaignDetails, budgetNum);
    setSelectedCreator(null);
    setCampaignTitle("");
    setCampaignDetails("");
    setCampaignBudget("");
  };

  // Helper: parse follower count to a number value for sorting/filtering
  const getFollowersValue = (followers: number) => followers;

  // Filter creators list
  const filteredCreators = creators.filter(c => {
    // 1. Search Query
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.niche.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.contact || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Niche Filter
    const matchesNiche = nicheFilter === "all" || 
                         c.niche === nicheFilter;

    // 3. Size Filter
    const sizeVal = getFollowersValue(c.followers);
    let matchesSize = true;
    if (sizeFilter === "small") matchesSize = sizeVal < 15000;
    else if (sizeFilter === "medium") matchesSize = sizeVal >= 15000 && sizeVal < 30000;
    else if (sizeFilter === "large") matchesSize = sizeVal >= 30000;

    // 4. Verified Filter
    const matchesVerified = verifiedFilter === "all" || 
                             (verifiedFilter === "verified" && c.verified) || 
                             (verifiedFilter === "unverified" && !c.verified);

    return matchesSearch && matchesNiche && matchesSize && matchesVerified;
  });

  return (
    <div className="flex-1 space-y-8 p-6 md:p-10 max-w-5xl mx-auto w-full">
      {/* Brand Profile Overview */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white">Amani Wear</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">
              <CheckCircle className="w-3 h-3" />
              Verified Brand
            </span>
          </div>
          <p className="text-zinc-400 text-xs mt-1 max-w-xl">
            Premium streetwear label based in Kigali. Sponsoring local talent to drive digital and eco-friendly cultural design reach.
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-right">
          <span className="text-[10px] text-zinc-500 font-bold uppercase block tracking-wider">Campaign Escrow Budget</span>
          <span className="text-xl font-black text-white">${businessBalance.toFixed(2)}</span>
        </div>
      </div>

      {/* Main Creator Directory */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-white">Discover & Recruit Creators</h2>
          
          {/* Search Input */}
          <div className="relative md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by name, niche, bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        {/* Directory Filters */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wide">Category Niche</label>
            <select
              value={nicheFilter}
              onChange={(e) => setNicheFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            >
              <option value="all">All Niches</option>
              {nicheOptions.map(niche => (
                <option key={niche} value={niche}>{niche}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wide">Audience Size</label>
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            >
              <option value="all">All Sizes</option>
              <option value="small">Nano-Influencers (&lt;15K)</option>
              <option value="medium">Micro-Influencers (15K-30K)</option>
              <option value="large">Macro-Influencers (30K+)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wide">Verification</label>
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>
        </div>

        {/* Creators Grid */}
        {filteredCreators.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-sm glass-panel rounded-2xl border border-white/5">
            No matching creators found. Try relaxing your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCreators.map(creator => (
              <div 
                key={creator.id} 
                className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col hover-scale"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                    {creator.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-white truncate">{creator.name}</h3>
                      {creator.verified && <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-zinc-400 font-semibold">{creator.niche}</span>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{creator.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-1">
                      <Phone className="w-3 h-3" />
                      <span className="truncate">{creator.contact || "Contact not added"}</span>
                    </div>
                  </div>
                </div>

                <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-5 flex-grow">
                  {creator.bio}
                </p>

                <div className="grid grid-cols-3 border-y border-white/5 py-3 mb-5 text-center">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-semibold block uppercase">Followers</span>
                    <span className="text-xs font-extrabold text-white mt-0.5">{creator.followers}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-semibold block uppercase">Engagement</span>
                    <span className="text-xs font-extrabold text-cyan-400 mt-0.5 flex items-center justify-center gap-0.5">
                      <Activity className="w-3 h-3 text-cyan-400" />
                      {creator.engagement}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-semibold block uppercase">Base Price</span>
                    <span className="text-xs font-extrabold text-emerald-400 mt-0.5">${creator.collabPrice}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenCollab(creator)}
                  className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Send Collab Offer</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collaboration Dialog Drawer Overlay */}
      {selectedCreator && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              <span>Sponsor {selectedCreator.name}</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              Define the contract terms. Initiating a proposal locks the campaign budget in Inzozi escrow. Funds are paid out only if the creator accepts.
            </p>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-start gap-2 text-rose-400 text-xs mb-4">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSendProposal} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autumn Streetwear Promotion"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase">Campaign Deliverables / Details</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe details: e.g. One YouTube review integration and 2 Twitter mentions tagging @Brand..."
                  value={campaignDetails}
                  onChange={(e) => setCampaignDetails(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl glass-input text-xs"
                />
                <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase mt-3">Campaign Date</label>
                <input
                  type="date"
                  value={campaignDate}
                  onChange={(e) => setCampaignDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase">Escrow Budget ($ USD)</label>
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                  <span className="text-xs text-zinc-400 font-bold">$</span>
                  <input
                    type="number"
                    required
                    value={campaignBudget}
                    onChange={(e) => setCampaignBudget(e.target.value)}
                    className="w-full bg-transparent text-xs border-none focus:outline-none text-white font-semibold"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedCreator(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-brand text-white text-xs font-bold shadow-lg shadow-purple-500/10 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Lock Escrow & Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Campaign / Proposals Ledger */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <h2 className="text-lg font-bold text-white mb-6">Escrow Campaign Registry</h2>
        {proposals.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-sm">
            No active collaborations drafted. Initiate an offer from the directory above.
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map(prop => (
              <div 
                key={prop.id} 
                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-all flex flex-col md:flex-row justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                    <h3 className="font-bold text-sm text-white">{prop.title}</h3>
                  </div>
                  <p className="text-zinc-400 text-xs max-w-2xl">{prop.details}</p>
                  <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                    <span>Creator: <strong className="text-zinc-300">{prop.creatorName}</strong></span>
                    <span>Budget locked: <strong className="text-emerald-400">${prop.budget}</strong></span>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end shrink-0 gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    prop.status === "accepted" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    prop.status === "declined" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                    "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                  }`}>
                    {prop.status === "pending_creator" ? "Awaiting Creator" : prop.status.replace("_", " ")}
                  </span>
                  
                  {prop.status === "pending_creator" && (
                    <span className="text-[9px] text-zinc-500">Funds locked in Escrow vault</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
