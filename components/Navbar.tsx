"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp, Role } from "@/context/AppContext";
import { Bell, Wallet, Sparkles, ChevronDown, LogOut, Shield, Briefcase, Heart, UserRound } from "lucide-react";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const {
    activeRole,
    setActiveRole,
    setActiveTab,
    currentUser,
    logoutUser,
    fanBalance,
    creatorBalance,
    businessBalance,
    adminBalance,
    notifications,
    clearNotifications
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  // Get current role's wallet balance
  const getCurrentBalance = () => {
    switch (activeRole) {
      case "fan": return fanBalance;
      case "creator": return creatorBalance;
      case "business": return businessBalance;
      case "admin": return adminBalance;
      default: return 0;
    }
  };

  const rolesList: { value: Role; label: string; icon: React.ReactNode }[] = [
    { value: "fan", label: "Fan / Supporter", icon: <Heart className="w-4 h-4 text-rose-500" /> },
    { value: "creator", label: "Creator Studio", icon: <Sparkles className="w-4 h-4 text-purple-500" /> },
    { value: "business", label: "Business Hub", icon: <Briefcase className="w-4 h-4 text-cyan-500" /> },
    { value: "admin", label: "Platform Admin", icon: <Shield className="w-4 h-4 text-amber-500" /> }
  ];

  const handleRoleChange = (role: Role) => {
    setActiveRole(role);
    setShowRoleSelector(false);
    setActiveTab("dashboard");
  };

  const handleProfileOpen = () => {
    setShowAccountMenu(false);
    setShowNotifications(false);
    setShowRoleSelector(false);
    setActiveTab("profile");
    router.push("/");
  };

  const handleLogout = () => {
    setShowAccountMenu(false);
    logoutUser();
    router.push("/");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
      {/* Brand Logo */}
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => { setActiveRole("landing"); }}
      >
        <div className="bg-gradient-brand w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
          I
        </div>
        <span className="font-bold text-xl tracking-tight text-gradient-brand">
          InzoziMarket
        </span>
      </div>

      {/* Main Actions */}
      <div className="flex items-center gap-4">
          {activeRole === "admin" && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300">
              {rolesList.find(r => r.value === activeRole)?.icon}
              <span>{rolesList.find(r => r.value === activeRole)?.label}</span>
            </div>
          )}

        {/* Dynamic Wallet Balance */}
        {activeRole !== "landing" && (
          <button 
            onClick={() => setActiveTab("wallet")}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-semibold text-sm hover:bg-emerald-500/15 transition-all"
          >
            <Wallet className="w-4 h-4" />
            <span>${getCurrentBalance().toFixed(2)}</span>
          </button>
        )}

        {/* Notifications Icon & Drawer */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleSelector(false);
              setShowAccountMenu(false);
            }}
            className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-dark-bg animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl glass-panel shadow-2xl border border-white/10 p-4 flex flex-col z-50">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                <span className="font-semibold text-sm text-white">Notifications</span>
                {notifications.length > 0 && (
                  <button 
                    onClick={clearNotifications}
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto flex flex-col gap-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-zinc-500 text-xs">
                    No new notifications
                  </div>
                ) : (
                  notifications.map(notif => (
                    <button 
                      key={notif.id}
                      onClick={() => {
                        if (notif.linkTab) {
                          setActiveTab(notif.linkTab);
                          router.push("/");
                        }
                        setShowNotifications(false);
                      }}
                      className="text-left w-full p-2.5 rounded-lg bg-white/5 border border-white/5 text-xs text-zinc-300 leading-relaxed hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <p>{notif.text}</p>
                      <span className="text-[10px] text-zinc-500 mt-1 block">{notif.date}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Authentication Actions */}
        {activeRole === "landing" && (
          <>
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-sm font-semibold"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gradient-brand text-white font-medium text-sm px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-purple-500/20 hover:scale-102 transition-all"
            >
              Create Account
            </Link>
          </>
        )}
        
        {activeRole !== "landing" && currentUser && (
          <div className="relative">
            <button
              onClick={() => {
                setShowAccountMenu(!showAccountMenu);
                setShowNotifications(false);
                setShowRoleSelector(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-neutral-100 text-zinc-400 transition-all cursor-pointer"
              title={`Account menu for ${currentUser.fullName}`}
            >
              <UserRound className="w-5 h-5" />
              <span className="hidden lg:inline text-xs font-semibold">{currentUser.fullName}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showAccountMenu ? "rotate-180" : ""}`} />
            </button>

            {showAccountMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl glass-panel shadow-2xl border border-white/10 p-1 flex flex-col gap-1 z-50">
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <span className="block text-xs font-bold text-white truncate">{currentUser.fullName}</span>
                  <span className="block text-[10px] text-zinc-500 truncate">{currentUser.email}</span>
                </div>
                <button
                  onClick={handleProfileOpen}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-left font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent transition-all"
                >
                  <UserRound className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-left font-medium text-rose-500 hover:bg-rose-500/10 border border-transparent transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
