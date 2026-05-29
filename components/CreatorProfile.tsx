"use client";

import React, { useState, useEffect } from "react";
import { useApp, Creator } from "@/context/AppContext";
import { 
  Check, 
  MapPin, 
  Phone, 
  Save, 
  Tag, 
  UserRound, 
  Trash2, 
  Globe, 
  ExternalLink, 
  Lock, 
  Unlock, 
  Users, 
  Settings, 
  DollarSign, 
  CheckCircle,
  AlertTriangle,
  X,
  ShieldCheck
} from "lucide-react";

// Branded custom SVGs for social media integrations (designed for premium look)
const InstagramIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

interface SocialConnection {
  connected: boolean;
  handle: string;
  followers: string;
}

interface PersonalSettings {
  shippingAddress: string;
  currency: string;
  instagram: SocialConnection;
  tiktok: SocialConnection;
  youtube: SocialConnection;
  twitter: SocialConnection;
}

const defaultSettings: PersonalSettings = {
  shippingAddress: "124 KN 3 Rd, Kigali, Rwanda",
  currency: "USD",
  instagram: { connected: true, handle: "@kirenga_tech", followers: "12.5K" },
  tiktok: { connected: false, handle: "", followers: "" },
  youtube: { connected: true, handle: "Kirenga Tech AI", followers: "8.4K" },
  twitter: { connected: false, handle: "", followers: "" }
};

export const CreatorProfile: React.FC = () => {
  const { activeRole, creators, currentUser, updateCreatorProfile, updateFanProfile } = useApp();
  
  // Find creator profile (fallback if currentUser is creator but not in preloaded list)
  const myCreatorProfile = creators.find(c => c.id === "c1") || creators[0];
  const nicheOptions = ["Technology & AI", "Fashion & Art", "Food & Lifestyle", "Music & Podcasts", "Beauty", "Education", "Sports & Fitness", "Travel"];

  // Active sub-page tab state
  const [activeTab, setActiveTab] = useState<"account" | "subscribers" | "memberships">("account");

  // Settings State
  const [settings, setSettings] = useState<PersonalSettings>(defaultSettings);
  const [addressSaved, setAddressSaved] = useState(false);
  const [showProfileSaved, setShowProfileSaved] = useState(false);
  const [activeConnectingSocial, setActiveConnectingSocial] = useState<"instagram" | "tiktok" | "youtube" | "twitter" | null>(null);
  
  // Custom handles for OAuth inputs
  const [oauthHandleInput, setOauthHandleInput] = useState("");
  const [oauthError, setOauthError] = useState("");

  // Local Fan Subscriptions list
  const [fanSubscriptions, setFanSubscriptions] = useState<string[]>([]);
  const [confirmUnsubscribe, setConfirmUnsubscribe] = useState<string | null>(null);

  // Creator profile states
  const [profileName, setProfileName] = useState(myCreatorProfile.name || currentUser?.fullName || "");
  const [profileNiche, setProfileNiche] = useState(myCreatorProfile.niche || "");
  const [profileLocation, setProfileLocation] = useState(myCreatorProfile.location || "");
  const [profileContact, setProfileContact] = useState(myCreatorProfile.contact || currentUser?.phone || currentUser?.email || "");
  const [profileBio, setProfileBio] = useState(myCreatorProfile.bio || "");
  const [profileSaveError, setProfileSaveError] = useState("");
  
  // Avatar state (Base64 preview)
  const [profileAvatar, setProfileAvatar] = useState<string>(myCreatorProfile.avatar || "");
  const [profileAvatarFile, setProfileAvatarFile] = useState<File | null>(null);
  // Handle avatar file selection and preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("inzozi_personal_settings");
      if (saved) {
        try {
          setSettings(JSON.parse(saved));
        } catch {
          localStorage.removeItem("inzozi_personal_settings");
        }
      } else {
        localStorage.setItem("inzozi_personal_settings", JSON.stringify(defaultSettings));
      }

      // Load fan subscriptions
      const savedSubs = localStorage.getItem("inzozi_fan_subscriptions");
      if (savedSubs) {
        setFanSubscriptions(JSON.parse(savedSubs));
      }
    }
  }, []);

  // Save changes helper
  const saveToLocalStorage = (newSettings: PersonalSettings) => {
    setSettings(newSettings);
    localStorage.setItem("inzozi_personal_settings", JSON.stringify(newSettings));
  };

  const handleSaveAddressAndCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    saveToLocalStorage(settings);
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaveError("");

    try {
      const result = activeRole === "creator"
        ? await updateCreatorProfile(myCreatorProfile.id, {
            name: profileName,
            niche: profileNiche,
            location: profileLocation,
            contact: profileContact,
            bio: profileBio,
            avatar: profileAvatar,
            avatarFile: profileAvatarFile ?? undefined,
          })
        : await updateFanProfile({
            fullName: profileName,
            email: profileContact,
            location: profileLocation,
            avatar: profileAvatar,
            avatarFile: profileAvatarFile ?? undefined,
          });

      if (!result.ok) {
        setProfileSaveError(result.message);
        return;
      }

      setProfileAvatarFile(null);
      setShowProfileSaved(true);
      setTimeout(() => setShowProfileSaved(false), 2000);
    } catch (error) {
      setProfileSaveError(error instanceof Error ? error.message : "Could not update profile.");
    }
  };

  // Launch simulated branded OAuth connect modal
  const openOauthModal = (platform: "instagram" | "tiktok" | "youtube" | "twitter") => {
    setActiveConnectingSocial(platform);
    setOauthHandleInput("");
    setOauthError("");
  };

  const handleOauthAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oauthHandleInput.trim()) {
      setOauthError("Please enter a valid account handle.");
      return;
    }

    let handle = oauthHandleInput.trim();
    if (!handle.startsWith("@") && activeConnectingSocial !== "youtube") {
      handle = "@" + handle;
    }

    const platform = activeConnectingSocial;
    if (!platform) return;

    // Generate simulated follower metric based on length to keep it consistent yet dynamic
    const countBase = (handle.length * 3 + Math.floor(Math.random() * 8) + 1);
    const metric = countBase > 50 ? `${(countBase / 10).toFixed(1)}M` : `${countBase}K`;

    const updatedSettings = {
      ...settings,
      [platform]: {
        connected: true,
        handle,
        followers: platform === "youtube" ? `${metric} Subscribers` : `${metric} Followers`
      }
    };

    saveToLocalStorage(updatedSettings);
    setActiveConnectingSocial(null);
  };

  const handleDisconnectSocial = (platform: "instagram" | "tiktok" | "youtube" | "twitter") => {
    const updatedSettings = {
      ...settings,
      [platform]: {
        connected: false,
        handle: "",
        followers: ""
      }
    };
    saveToLocalStorage(updatedSettings);
  };

  // Handle Unsubscribing as a Fan
  const handleUnsubscribe = (creatorId: string) => {
    const updatedSubs = fanSubscriptions.filter(id => id !== creatorId);
    setFanSubscriptions(updatedSubs);
    localStorage.setItem("inzozi_fan_subscriptions", JSON.stringify(updatedSubs));

    // Decrement the subscribersCount in global creators list for persistence
    const savedCreators = localStorage.getItem("inzozi_creators");
    if (savedCreators) {
      try {
        const parsedCreators: Creator[] = JSON.parse(savedCreators);
        const updatedCreators = parsedCreators.map(c => {
          if (c.id === creatorId) {
            return { ...c, subscribersCount: Math.max(0, c.subscribersCount - 1) };
          }
          return c;
        });
        localStorage.setItem("inzozi_creators", JSON.stringify(updatedCreators));
      } catch (e) {
        console.error("Failed to update creator subscribers count", e);
      }
    }

    setConfirmUnsubscribe(null);
  };

  // Mock list of Rwandan/East African subscribers for Creator
  const mockSubscribers = [
    { name: "Sandra Umutoni", handle: "@sandra_u", date: "May 20, 2026", status: "active", tier: "Gold Fan ($10.00)" },
    { name: "Eric Kabera", handle: "@eric_k", date: "May 18, 2026", status: "active", tier: "Gold Fan ($10.00)" },
    { name: "Aline Mukamana", handle: "@aline_m", date: "May 15, 2026", status: "active", tier: "Gold Fan ($10.00)" },
    { name: "Jean-Claude Nshuti", handle: "@jc_nshuti", date: "May 10, 2026", status: "active", tier: "Gold Fan ($10.00)" },
    { name: "Grace Mwari", handle: "@grace_m", date: "May 02, 2026", status: "active", tier: "Gold Fan ($10.00)" }
  ];

  return (
    <div className="flex-1 space-y-8 p-6 md:p-10 max-w-5xl mx-auto w-full">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Settings className="w-8 h-8 text-purple-400" />
            <span>Personal Settings Portal</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Configure your account details, payout currencies, linked socials, and subscriptions.</p>
        </div>
        
        {/* Sub-tab Navigation */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 shrink-0">
          <button
            onClick={() => setActiveTab("account")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "account" 
                ? "bg-gradient-brand text-white shadow-md shadow-purple-500/10" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Account Details
          </button>
          
          {activeRole === "creator" ? (
            <button
              onClick={() => setActiveTab("subscribers")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "subscribers" 
                  ? "bg-gradient-brand text-white shadow-md shadow-purple-500/10" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              My Subscribers
            </button>
          ) : (
            <button
              onClick={() => setActiveTab("memberships")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "memberships" 
                  ? "bg-gradient-brand text-white shadow-md shadow-purple-500/10" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              My Memberships
            </button>
          )}
        </div>
      </div>

      {/* RENDER TAB 1: ACCOUNT SETTINGS */}
      {activeTab === "account" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Address & Currency Section */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Shipping address form */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/5 rounded-full blur-3xl"></div>
                
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span>Shipping Address & Payout currency</span>
                </h3>
                
                <form onSubmit={handleSaveAddressAndCurrency} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block">
                        <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase flex items-center gap-1.5">
                          Shipping Address
                        </span>
                        <input
                          required
                          value={settings.shippingAddress}
                          onChange={(e) => setSettings({ ...settings, shippingAddress: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                          placeholder="e.g. 124 KN 3 Rd, Kigali, Rwanda"
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block">
                        <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase flex items-center gap-1.5">
                          Payout Currency
                        </span>
                        <select
                          value={settings.currency}
                          onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="RWF">RWF (FRw)</option>
                          <option value="KES">KES (KSh)</option>
                          <option value="UGX">UGX (USh)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Address</span>
                    </button>
                    
                    {addressSaved && (
                      <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Address details saved successfully
                      </span>
                    )}
                  </div>
                </form>
              </div>

             {/* Public Profile Form for all roles */}
{(
  <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/5 rounded-full blur-3xl"></div>
    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
      <UserRound className="w-5 h-5 text-cyan-400" />
      <span>{activeRole === "creator" ? "Public Studio Profile Details" : "Public Profile Details"}</span>
    </h3>
    <form onSubmit={handleSaveProfile} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase flex items-center gap-1.5">Display Name</span>
          <input required value={profileName} onChange={e => setProfileName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" placeholder="Your name" />
        </label>
        {activeRole === "creator" && (
          <label className="block">
            <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase flex items-center gap-1.5">Niche</span>
            <input required list="creator-niche-options-settings" value={profileNiche} onChange={e => setProfileNiche(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" placeholder="e.g. Beauty, Tech, Fashion" />
            <datalist id="creator-niche-options-settings">
              {nicheOptions.map(option => (<option key={option} value={option} />))}
            </datalist>
          </label>
        )}
        <label className="block">
          <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase flex items-center gap-1.5">Location</span>
          <input required value={profileLocation} onChange={e => setProfileLocation(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" placeholder="City, Country" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase flex items-center gap-1.5">Email</span>
          <input required value={profileContact} onChange={e => setProfileContact(e.target.value)}
            placeholder="Enter email address"
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Bio</span>
          <textarea required rows={3} value={profileBio} onChange={e => setProfileBio(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none" placeholder="Introduce yourself..." />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase flex items-center gap-1.5">Avatar</span>
          <input type="file" accept="image/*" onChange={handleAvatarChange}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" />
        </label>
        {profileAvatar && (
          <img src={profileAvatar} alt="Avatar preview" className="mt-2 w-20 h-20 rounded-full object-cover" />
        )}
      </div>
      <div className="flex items-center gap-4 pt-2">
        <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2">
          <Save className="w-3.5 h-3.5" />
          <span>{activeRole === "creator" ? "Update Profile" : "Save Profile"}</span>
        </button>
        {showProfileSaved && (
          <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Profile updated successfully
          </span>
        )}
        {profileSaveError && (
          <span className="text-rose-400 text-xs font-semibold">{profileSaveError}</span>
        )}
      </div>
    </form>
  </div>
)}  </div>

            {/* Social Media Integration Column */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 h-max relative overflow-hidden flex flex-col gap-5">
              <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/5 rounded-full blur-3xl"></div>
              
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-pink-400" />
                  <span>Linked Social Channels</span>
                </h3>
                <p className="text-[10px] text-zinc-400 mt-1">Connect your networks to verify engagement analytics for brand sponsors.</p>
              </div>

              <div className="space-y-4">
                {/* 1. INSTAGRAM */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-600/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
                      <InstagramIcon />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Instagram</h4>
                      <p className="text-[9px] text-zinc-500">
                        {settings.instagram.connected ? settings.instagram.followers : "Disconnected"}
                      </p>
                    </div>
                  </div>

                  {settings.instagram.connected ? (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-bold">
                        {settings.instagram.handle}
                      </span>
                      <button 
                        onClick={() => handleDisconnectSocial("instagram")}
                        className="text-zinc-500 hover:text-rose-400 p-1 hover:bg-white/5 rounded-lg transition-all"
                        title="Disconnect"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openOauthModal("instagram")}
                      className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-[10px] transition-all"
                    >
                      Connect
                    </button>
                  )}
                </div>

                {/* 2. TIKTOK */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <TikTokIcon />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">TikTok</h4>
                      <p className="text-[9px] text-zinc-500">
                        {settings.tiktok.connected ? settings.tiktok.followers : "Disconnected"}
                      </p>
                    </div>
                  </div>

                  {settings.tiktok.connected ? (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-bold">
                        {settings.tiktok.handle}
                      </span>
                      <button 
                        onClick={() => handleDisconnectSocial("tiktok")}
                        className="text-zinc-500 hover:text-rose-400 p-1 hover:bg-white/5 rounded-lg transition-all"
                        title="Disconnect"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openOauthModal("tiktok")}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] transition-all"
                    >
                      Connect
                    </button>
                  )}
                </div>

                {/* 3. YOUTUBE */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-600/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                      <YouTubeIcon />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">YouTube</h4>
                      <p className="text-[9px] text-zinc-500">
                        {settings.youtube.connected ? settings.youtube.followers : "Disconnected"}
                      </p>
                    </div>
                  </div>

                  {settings.youtube.connected ? (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-bold">
                        {settings.youtube.handle}
                      </span>
                      <button 
                        onClick={() => handleDisconnectSocial("youtube")}
                        className="text-zinc-500 hover:text-rose-400 p-1 hover:bg-white/5 rounded-lg transition-all"
                        title="Disconnect"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openOauthModal("youtube")}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] transition-all"
                    >
                      Connect
                    </button>
                  )}
                </div>

                {/* 4. TWITTER / X */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-600/10 border border-zinc-500/20 text-zinc-300 flex items-center justify-center">
                      <TwitterIcon />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Twitter / X</h4>
                      <p className="text-[9px] text-zinc-500">
                        {settings.twitter.connected ? settings.twitter.followers : "Disconnected"}
                      </p>
                    </div>
                  </div>

                  {settings.twitter.connected ? (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-bold">
                        {settings.twitter.handle}
                      </span>
                      <button 
                        onClick={() => handleDisconnectSocial("twitter")}
                        className="text-zinc-500 hover:text-rose-400 p-1 hover:bg-white/5 rounded-lg transition-all"
                        title="Disconnect"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openOauthModal("twitter")}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold text-[10px] transition-all"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* RENDER TAB 2: MY SUBSCRIBERS (CREATORS ONLY) */}
      {activeTab === "subscribers" && activeRole === "creator" && (
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/5 rounded-full blur-3xl"></div>
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>My Fan Subscribers Ledger</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">Review the dedicated fans supporting your digital assets on a monthly basis.</p>
            </div>
            
            <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-400 font-bold uppercase tracking-wider">
              {mockSubscribers.length} Subscribers Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-zinc-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-4">Subscriber Name</th>
                  <th className="pb-3">Username</th>
                  <th className="pb-3">Subscription Date</th>
                  <th className="pb-3">Support Tier</th>
                  <th className="pb-3 pr-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockSubscribers.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-white/2 transition-all">
                    <td className="py-4 pl-4 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-600/15 border border-purple-500/20 flex items-center justify-center text-[10px] text-purple-400">
                        {sub.name.split(" ").map(w => w[0]).join("")}
                      </div>
                      <span>{sub.name}</span>
                    </td>
                    <td className="py-4 font-medium text-zinc-400">{sub.handle}</td>
                    <td className="py-4 text-zinc-400">{sub.date}</td>
                    <td className="py-4 font-bold text-purple-400">{sub.tier}</td>
                    <td className="py-4 pr-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RENDER TAB 3: MY MEMBERSHIPS (FANS ONLY) */}
      {activeTab === "memberships" && activeRole === "fan" && (
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/5 rounded-full blur-3xl"></div>
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Unlock className="w-5 h-5 text-purple-400" />
                <span>My Active Memberships</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">Review and manage the content creators you are currently supporting month-to-month.</p>
            </div>
            
            <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-400 font-bold uppercase tracking-wider">
              {fanSubscriptions.length} Subscriptions
            </span>
          </div>

          {fanSubscriptions.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">
              You are not subscribed to any creators yet. Explore the Discover Feed to support local talent!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fanSubscriptions.map(creatorId => {
                const creatorObj = creators.find(c => c.id === creatorId);
                if (!creatorObj) return null;

                return (
                  <div key={creatorId} className="p-4 rounded-xl bg-white/2 border border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                        {creatorObj.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="font-bold text-sm text-white">{creatorObj.name}</h4>
                          {creatorObj.verified && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                        <span className="text-[10px] text-zinc-500 block">{creatorObj.niche}</span>
                        <span className="text-[10px] text-purple-400 font-semibold block mt-0.5">Contribution: $10.00/mo</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setConfirmUnsubscribe(creatorId)}
                      className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 font-bold text-xs transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Unsubscribe</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* simulated OAuth POPUP MODAL */}
      {activeConnectingSocial && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative flex flex-col items-center text-center gap-6">
            
            {/* Branded Network Icon & Header */}
            {activeConnectingSocial === "instagram" && (
              <>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 text-white flex items-center justify-center text-3xl shadow-xl shadow-pink-500/10">
                  <InstagramIcon />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">Instagram Connection</h3>
                  <p className="text-[10px] text-zinc-400">Authorize InzoziMarket to link your social statistics.</p>
                </div>
              </>
            )}

            {activeConnectingSocial === "tiktok" && (
              <>
                <div className="w-16 h-16 rounded-2xl bg-zinc-950 text-white border-2 border-white/10 flex items-center justify-center text-3xl shadow-xl shadow-cyan-400/5 relative">
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl scale-95 -translate-x-1 translate-y-0.5 z-0"></div>
                  <div className="absolute inset-0 bg-red-400/20 rounded-2xl scale-95 translate-x-1 -translate-y-0.5 z-0"></div>
                  <div className="z-10 text-white"><TikTokIcon /></div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">TikTok Integration</h3>
                  <p className="text-[10px] text-zinc-400">Authorize InzoziMarket to link your social statistics.</p>
                </div>
              </>
            )}

            {activeConnectingSocial === "youtube" && (
              <>
                <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-3xl shadow-xl shadow-rose-600/10">
                  <YouTubeIcon />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">YouTube Channel Link</h3>
                  <p className="text-[10px] text-zinc-400">Authorize InzoziMarket to link your social statistics.</p>
                </div>
              </>
            )}

            {activeConnectingSocial === "twitter" && (
              <>
                <div className="w-16 h-16 rounded-2xl bg-black border border-white/20 text-white flex items-center justify-center text-3xl shadow-xl shadow-black/10">
                  <TwitterIcon />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">Twitter / X Integration</h3>
                  <p className="text-[10px] text-zinc-400">Authorize InzoziMarket to link your social statistics.</p>
                </div>
              </>
            )}

            <form onSubmit={handleOauthAuthorize} className="w-full space-y-4">
              <div className="text-left">
                <label className="block text-[9px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">
                  {activeConnectingSocial === "youtube" ? "Channel Name" : "Account Username"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={activeConnectingSocial === "youtube" ? "e.g. Kirenga Tech AI" : "e.g. kirenga_tech"}
                  value={oauthHandleInput}
                  onChange={(e) => setOauthHandleInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold"
                />
              </div>

              {oauthError && (
                <p className="text-rose-400 text-[10px] font-semibold">{oauthError}</p>
              )}

              {/* simulated Permissions check */}
              <div className="rounded-2xl bg-white/2 border border-white/5 p-3 text-left space-y-2">
                <span className="text-[8px] font-bold text-zinc-500 uppercase block tracking-widest">InzoziMarket requests access to:</span>
                <div className="space-y-1 text-[9px] text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Read public account profile name & avatar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Verify follower & subscriber count metrics</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Check total posts, views, and engagement rates</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveConnectingSocial(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-xl text-white text-xs font-black shadow-lg transition-all ${
                    activeConnectingSocial === "instagram" ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90" :
                    activeConnectingSocial === "tiktok" ? "bg-zinc-950 hover:bg-zinc-900 border border-white/10" :
                    activeConnectingSocial === "youtube" ? "bg-rose-600 hover:bg-rose-500" :
                    "bg-zinc-950 border border-white/10 hover:bg-zinc-900"
                  }`}
                >
                  Authorize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* simulated UNSUBSCRIBE CONFIRMATION MODAL */}
      {confirmUnsubscribe && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl relative flex flex-col gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            
            <div>
              <h3 className="text-base font-bold text-white">Delete Membership?</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Are you sure you want to unsubscribe from {creators.find(c => c.id === confirmUnsubscribe)?.name || "this creator"}? 
                You will instantly lose access to their subscriber-only feed content!
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmUnsubscribe(null)}
                className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold hover:bg-white/10"
              >
                No, Keep supporting
              </button>
              <button
                onClick={() => handleUnsubscribe(confirmUnsubscribe)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Yes, Unsubscribe
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
