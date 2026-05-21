"use client";

import React from "react";
import { useApp, Tab } from "@/context/AppContext";
import { 
  LayoutDashboard, 
  Rss, 
  MessageSquare, 
  Wallet, 
  Award, 
  Briefcase, 
  Users, 
  ShieldAlert, 
  CheckSquare,
  Heart
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { activeRole, activeTab, setActiveTab } = useApp();

  interface NavItem {
    id: Tab;
    label: string;
    icon: React.ReactNode;
  }

  // Generate menu items dynamically based on active role
  const getNavItems = (): NavItem[] => {
    switch (activeRole) {
      case "creator":
        return [
          { id: "dashboard", label: "Studio Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: "feed", label: "My Content Feed", icon: <Rss className="w-5 h-5" /> },
          { id: "campaigns", label: "Brand Contracts", icon: <Briefcase className="w-5 h-5" /> },
          { id: "messages", label: "Chat Inbox", icon: <MessageSquare className="w-5 h-5" /> },
          { id: "wallet", label: "Earnings Wallet", icon: <Wallet className="w-5 h-5" /> }
        ];
      case "business":
        return [
          { id: "dashboard", label: "Find Creators", icon: <Users className="w-5 h-5" /> },
          { id: "campaigns", label: "My Campaigns", icon: <Briefcase className="w-5 h-5" /> },
          { id: "messages", label: "Creator Chats", icon: <MessageSquare className="w-5 h-5" /> },
          { id: "wallet", label: "Brand Wallet", icon: <Wallet className="w-5 h-5" /> }
        ];
      case "fan":
        return [
          { id: "feed", label: "Discover Feed", icon: <Rss className="w-5 h-5" /> },
          { id: "messages", label: "My Support Inbox", icon: <MessageSquare className="w-5 h-5" /> },
          { id: "wallet", label: "Fan Wallet", icon: <Wallet className="w-5 h-5" /> }
        ];
      case "admin":
        return [
          { id: "dashboard", label: "Moderation Desk", icon: <ShieldAlert className="w-5 h-5" /> },
          { id: "admin", label: "Verifications Queue", icon: <CheckSquare className="w-5 h-5" /> },
          { id: "wallet", label: "System Treasury", icon: <Wallet className="w-5 h-5" /> }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  // Mini summary card text based on role
  const renderSidebarCard = () => {
    switch (activeRole) {
      case "creator":
        return (
          <div className="mt-auto p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
            <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h4 className="font-semibold text-xs text-white">Inzozi Premium</h4>
            <p className="text-[10px] text-purple-300 mt-1">Unlock live streaming tools in version 2.0</p>
          </div>
        );
      case "business":
        return (
          <div className="mt-auto p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
            <Briefcase className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h4 className="font-semibold text-xs text-white">Verified Brand</h4>
            <p className="text-[10px] text-cyan-300 mt-1">Increase direct outreach limit up to 50 creators/day</p>
          </div>
        );
      case "fan":
        return (
          <div className="mt-auto p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
            <Heart className="w-8 h-8 text-rose-400 mx-auto mb-2" />
            <h4 className="font-semibold text-xs text-white">Dream Supporter</h4>
            <p className="text-[10px] text-rose-300 mt-1">Get custom badges on supporting creators</p>
          </div>
        );
      case "admin":
        return (
          <div className="mt-auto p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <h4 className="font-semibold text-xs text-white">Security Duty</h4>
            <p className="text-[10px] text-amber-300 mt-1">Resolve flagged user reports within 24 hours</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="w-64 glass-panel border-r border-white/5 flex flex-col py-8 px-4 h-[calc(100vh-73px)] sticky top-[73px] shrink-0 hidden md:flex">
      <div className="flex flex-col gap-1.5">
        {navItems.map(item => {
          // Edge case check for Admin tabs
          const finalActive = (item.id === "dashboard" && activeTab === "dashboard") || 
                              (item.id === "admin" && activeTab === "admin") || 
                              (item.id !== "dashboard" && item.id !== "admin" && activeTab === item.id);

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                finalActive 
                  ? "bg-gradient-brand text-white shadow-lg shadow-purple-500/10" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {renderSidebarCard()}
    </aside>
  );
};
