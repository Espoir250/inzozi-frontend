import React, { useState, useEffect } from "react";
import { useApp, Business } from "@/context/AppContext";
import { Settings, Save, Check } from "lucide-react";

export const BrandProfile: React.FC = () => {
  const { activeRole, businesses, currentUser, updateBusinessProfile } = useApp();

  // Find the business profile for the current user if role is business
  const myBusiness = businesses.find(b => b.id === currentUser?.id) || businesses[0];

  const [profileName, setProfileName] = useState(myBusiness.name || "");
  const [profileAvatar, setProfileAvatar] = useState<string>(myBusiness.logo || "");
  const [profileEmail, setProfileEmail] = useState(myBusiness.email || "");
  const [profileContact, setProfileContact] = useState(myBusiness.contact || "");
  const [profileBio, setProfileBio] = useState(myBusiness.bio || "");

  const [showSaved, setShowSaved] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    updateBusinessProfile(currentUser.id, {
      name: profileName,
      avatar: profileAvatar,
      email: profileEmail,
      contact: profileContact,
      bio: profileBio,
    });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/5 rounded-full blur-3xl" />
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          Brand Profile Settings
        </h3>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase flex items-center gap-1.5">
                Brand Name
              </span>
              <input
                required
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                placeholder="Your brand name"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase flex items-center gap-1.5">
                Email
              </span>
              <input
                type="email"
                required
                value={profileEmail}
                onChange={e => setProfileEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                placeholder="brand@example.com"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase flex items-center gap-1.5">
                Contact Phone
              </span>
              <input
                type="tel"
                required
                value={profileContact}
                onChange={e => setProfileContact(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                placeholder="+250 7XX XXX XXX"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase flex items-center gap-1.5">
                Avatar / Logo
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase">
              Bio
            </span>
            <textarea
              required
              rows={3}
              value={profileBio}
              onChange={e => setProfileBio(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none"
              placeholder="Describe your brand..."
            />
          </label>
          {profileAvatar && (
            <img src={profileAvatar} alt="Avatar preview" className="mt-2 w-20 h-20 rounded-full object-cover" />
          )}
          <div className="flex items-center gap-4 pt-2">
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2">
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
            {showSaved && (
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Profile updated
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
