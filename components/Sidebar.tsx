"use client";

import React, { useState } from "react";
import { useApp, Tab } from "@/context/AppContext";
import { 
  LayoutDashboard, 
  Rss, 
  MessageSquare, 
  Wallet, 
  Award, 
  Briefcase, 
  Users, 
  Search, 
  CheckSquare,
  Heart,
  Settings,
  ShieldAlert,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

export const Sidebar: React.FC = () => {
  const { activeRole, activeTab, setActiveTab, isMobileMenuOpen, setMobileMenuOpen } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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
          { id: "wallet", label: "Earnings Wallet", icon: <Wallet className="w-5 h-5" /> },
          { id: "profile", label: "Personal Settings", icon: <Settings className="w-5 h-5" /> }
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
          { id: "wallet", label: "Fan Wallet", icon: <Wallet className="w-5 h-5" /> },
          { id: "profile", label: "Personal Settings", icon: <Settings className="w-5 h-5" /> }
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
          <div className={`mt-auto p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center ${isCollapsed ? "hidden md:hidden" : ""}`}>
            <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h4 className="font-semibold text-xs text-white">Inzozi Premium</h4>
            <p className="text-[10px] text-purple-300 mt-1">Unlock live streaming tools in version 2.0</p>
          </div>
        );
      case "business":
        return (
          <div className={`mt-auto p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center ${isCollapsed ? "hidden md:hidden" : ""}`}>
            <Briefcase className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h4 className="font-semibold text-xs text-white">Verified Brand</h4>
            <p className="text-[10px] text-cyan-300 mt-1">Increase direct outreach limit up to 50 creators/day</p>
          </div>
        );
      case "fan":
        return (
          <div className={`mt-auto p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center ${isCollapsed ? "hidden md:hidden" : ""}`}>
            <Heart className="w-8 h-8 text-rose-400 mx-auto mb-2" />
            <h4 className="font-semibold text-xs text-white">Dream Supporter</h4>
            <p className="text-[10px] text-rose-300 mt-1">Get custom badges on supporting creators</p>
          </div>
        );
      case "admin":
        return (
          <div className={`mt-auto p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center ${isCollapsed ? "hidden md:hidden" : ""}`}>
            <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <h4 className="font-semibold text-xs text-white">Security Duty</h4>
            <p className="text-[10px] text-amber-300 mt-1">Resolve flagged user reports within 24 hours</p>
          </div>
        );
      default:
        return null;
    }
  };

  const handleTabClick = (id: Tab) => {
    setActiveTab(id);
    setMobileMenuOpen(false); // Close drawer on mobile after clicking
    if (pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <aside className={`
        fixed inset-y-0 left-0 z-50 glass-panel border-r border-white/5 flex flex-col py-6 px-4
        transform transition-all duration-300 ease-in-out h-screen md:h-[calc(100vh-73px)] md:sticky md:top-[73px]
        ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"}
        ${isCollapsed ? "md:w-20" : "md:w-64"}
      `}>
        {/* Mobile Close Button */}
        <div className="flex justify-end mb-4 md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      <div className="flex flex-col gap-1.5">
        {navItems.map(item => {
          // Edge case check for Admin tabs
          const finalActive = (item.id === "dashboard" && activeTab === "dashboard") || 
                              (item.id === "admin" && activeTab === "admin") || 
                              (item.id !== "dashboard" && item.id !== "admin" && activeTab === item.id);

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                finalActive 
                  ? "bg-gradient-brand text-white shadow-lg shadow-purple-500/10" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <div className="shrink-0">{item.icon}</div>
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>

      <div className={`hidden md:flex mb-2 ${isCollapsed ? "mt-auto justify-center" : "mt-4 px-4"}`}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all ${isCollapsed ? "justify-center" : "gap-3 w-full"}`}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>

      {!isCollapsed && renderSidebarCard()}
    </aside>
    </>
  );
};
