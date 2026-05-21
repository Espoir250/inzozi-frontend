"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Check, MapPin, Phone, Save, Tag, UserRound } from "lucide-react";

export const CreatorProfile: React.FC = () => {
  const { creators, currentUser, updateCreatorProfile } = useApp();
  const myProfile = creators.find(c => c.id === "c1") || creators[0];
  const nicheOptions = ["Technology & AI", "Fashion & Art", "Food & Lifestyle", "Music & Podcasts", "Beauty", "Education", "Sports & Fitness", "Travel"];

  const [profileName, setProfileName] = useState(myProfile.name || currentUser?.fullName || "");
  const [profileNiche, setProfileNiche] = useState(myProfile.niche || "");
  const [profileLocation, setProfileLocation] = useState(myProfile.location || "");
  const [profileContact, setProfileContact] = useState(myProfile.contact || currentUser?.phone || currentUser?.email || "");
  const [profileBio, setProfileBio] = useState(myProfile.bio || "");
  const [showProfileSaved, setShowProfileSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCreatorProfile(myProfile.id, {
      name: profileName,
      niche: profileNiche,
      location: profileLocation,
      contact: profileContact,
      bio: profileBio
    });
    setShowProfileSaved(true);
    setTimeout(() => setShowProfileSaved(false), 2200);
  };

  return (
    <div className="flex-1 space-y-8 p-6 md:p-10 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center border-b border-white/5 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Creator Profile</h1>
          <p className="text-zinc-400 text-sm mt-1">Edit the public profile brands and fans use to discover you.</p>
        </div>
        {showProfileSaved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold">
            <Check className="w-3.5 h-3.5" />
            Profile saved
          </span>
        )}
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase flex items-center gap-1.5">
                <UserRound className="w-3.5 h-3.5" />
                Display Name
              </span>
              <input
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                placeholder="Your creator or studio name"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Niche
              </span>
              <input
                required
                list="creator-niche-options"
                value={profileNiche}
                onChange={(e) => setProfileNiche(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                placeholder="e.g. Beauty, Tech, Fashion"
              />
              <datalist id="creator-niche-options">
                {nicheOptions.map(option => (
                  <option key={option} value={option} />
                ))}
              </datalist>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Location
              </span>
              <input
                required
                value={profileLocation}
                onChange={(e) => setProfileLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                placeholder="City, Country"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                Contact
              </span>
              <input
                required
                value={profileContact}
                onChange={(e) => setProfileContact(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                placeholder="Email, phone, WhatsApp, or booking link"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Bio</span>
            <textarea
              required
              rows={4}
              value={profileBio}
              onChange={(e) => setProfileBio(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              placeholder="Tell brands and fans what you create, who your audience is, and what collaborations fit you."
            />
          </label>

          <button
            type="submit"
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-gradient-brand text-white font-bold text-sm shadow-md hover:shadow-purple-500/15 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Creator Profile</span>
          </button>
        </form>
      </div>
    </div>
  );
};
