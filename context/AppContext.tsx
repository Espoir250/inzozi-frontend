"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { loginWithApi, logoutWithApi, registerWithApi, verifyRegistrationWithApi } from "@/lib/authApi";
import { createCampaignApi, createApplicationApi, fetchUserCampaignsApi } from "@/lib/campaignApi";
import { BackendContent, createContentWithApi, fetchContentList } from "@/lib/contentApi";
import { uploadProfileImageWithApi, fetchUsersApi, BackendUser } from "@/lib/userApi";
import {
  sendMessageApi,
  listConversationsApi,
  getConversationThreadApi,
  BackendConversation,
  BackendMessage,
} from "@/lib/messageApi";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Role = "landing" | "creator" | "business" | "fan" | "admin";
export type Tab =
  | "dashboard"
  | "feed"
  | "campaigns"
  | "messages"
  | "wallet"
  | "admin"
  | "profile"
  | "search";

export interface AuthUser {
  id: string;
  fullName: string;
  email?: string;
  location?: string;
  avatar?: string;
  role: Exclude<Role, "landing">;
  password?: string;
  phone?: string;
}

type RegisterUserPayload = {
  fullName: string;
  email: string;
  phone: string;
  role: Exclude<Role, "landing">;
  password: string;
};

type CreatorProfileUpdate = Partial<
  Pick<Creator, "name" | "avatar" | "location" | "contact" | "bio">
> & {
  niche?: string;
  avatarFile?: File;
  subscriptionFee?: number;
};

/**
 * Creator — id is always the real backend UUID after login.
 * displayName is the nickname/stage name from creator_profile.specialization.
 * name is the full name from users table (used as fallback).
 */
export interface Creator {
  id: string;          // real backend UUID (users.id)
  profileId?: string;  // creator_profile.id (for profile updates)
  name: string;        // display name (specialization) or full name fallback
  avatar: string;      // avatar URL or emoji fallback
  niche: string;       // specialization field
  followers: number;
  location: string;
  contact: string;
  engagement: string;
  collabPrice: number;
  verified: boolean;
  bio: string;
  subscribersCount: number;
  subscriptionFee?: number;
}

export interface Business {
  id: string;
  name: string;
  logo?: string;
  email?: string;
  contact?: string;
  niche: string;
  location: string;
  verified: boolean;
  bio: string;
}

export interface Post {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  content: string;
  type: "text" | "image" | "video";
  mediaUrl?: string;
  visibility: "public" | "subscriber" | "premium";
  price?: number;
  likes: number;
  comments: { id: string; user: string; text: string }[];
  isLocked?: boolean;
  unlockedBy: string[];
  flagged?: boolean;
  flagReason?: string;
}

export interface Proposal {
  id: string;
  businessId: string;
  businessName: string;
  creatorId: string;
  creatorName: string;
  title: string;
  details: string;
  budget: number;
  status: "pending_creator" | "pending_business" | "accepted" | "declined";
  contractCreated: boolean;
  messages: { id: string; sender: string; text: string; timestamp: string }[];
}

export interface DirectMessageThread {
  id: string;                // conversationId from backend (MD5 hash)
  fanId: string;
  fanName: string;
  creatorId: string;
  creatorName: string;
  participantAvatar?: string;
  participantRole?: string;
  messages: { id: string; sender: string; senderId?: string; text: string; timestamp: string }[];
  lastFetched?: number;
}

export interface WalletTransaction {
  id: string;
  type:
    | "deposit"
    | "withdrawal"
    | "tip_sent"
    | "tip_received"
    | "subscription_paid"
    | "subscription_earned"
    | "unlock_paid"
    | "unlock_earned"
    | "campaign_escrow"
    | "campaign_payout";
  amount: number;
  description: string;
  date: string;
}

interface Notification {
  id: string;
  text: string;
  date: string;
  read: boolean;
  linkTab?: Tab;
}

interface AppContextType {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  fanBalance: number;
  creatorBalance: number;
  businessBalance: number;
  adminBalance: number;
  transactions: WalletTransaction[];
  creators: Creator[];
  businesses: Business[];
  posts: Post[];
  proposals: Proposal[];
  directMessages: DirectMessageThread[];
  notifications: Notification[];
  pendingVerifications: {
    id: string;
    name: string;
    type: "creator" | "business";
    niche: string;
    bio: string;
  }[];
  isLoadingCreators: boolean;
  isLoadingPosts: boolean;
  registerUser: (
    payload: RegisterUserPayload
  ) => Promise<{ ok: boolean; message: string; userId?: string }>;
  verifyRegistration: (
    userId: string,
    otp: string
  ) => Promise<{ ok: boolean; message: string }>;
  loginUser: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; message: string }>;
  logoutUser: () => Promise<void>;
  refreshCreators: () => Promise<void>;
  refreshPosts: () => Promise<void>;
  refreshDirectMessages: () => Promise<void>;
  updateFanProfile: (
    updates: Partial<AuthUser> & { avatarFile?: File }
  ) => Promise<{ ok: boolean; message: string }>;
  updateBusinessProfile: (
    brandId: string,
    updates: {
      name: string;
      avatar?: string;
      email?: string;
      contact?: string;
      bio: string;
    }
  ) => void;
  updateCreatorProfile: (
    creatorId: string,
    updates: CreatorProfileUpdate
  ) => Promise<{ ok: boolean; message: string }>;
  deposit: (amount: number, target: "fan" | "business") => void;
  withdraw: (
    amount: number,
    target: "creator" | "business" | "fan",
    method: string,
    details: string
  ) => void;
  tipCreator: (creatorId: string, amount: number) => boolean;
  subscribeToCreator: (creatorId: string) => boolean;
  unlockPremiumPost: (postId: string) => boolean;
  createPost: (
    title: string,
    content: string,
    type: "text" | "image" | "video",
    visibility: "public" | "subscriber" | "premium",
    price?: number,
    mediaUrl?: string,
    mediaFile?: File
  ) => Promise<{ ok: boolean; message: string }>;
  likePost: (postId: string) => void;
  commentOnPost: (postId: string, text: string) => void;
  launchCampaignProposal: (
    creatorId: string,
    title: string,
    details: string,
    budget: number
  ) => void;
  startChat: (partnerId: string, partnerName: string) => void;
  respondToProposal: (proposalId: string, action: "accept" | "decline") => void;
  sendMessageToProposal: (proposalId: string, text: string) => Promise<boolean>;
  startDirectMessage: (creatorId: string) => void;
  sendMessageToDirectMessage: (threadId: string, text: string) => Promise<boolean>;
  approveVerification: (id: string) => void;
  rejectVerification: (id: string) => void;
  flagPost: (postId: string, reason: string) => void;
  removePost: (postId: string) => void;
  dismissFlag: (postId: string) => void;
  clearNotifications: () => void;
  addNotification: (text: string, linkTab?: Tab) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const AppContext = createContext<AppContextType | undefined>(undefined);

const formatMessageDeliveryTime = (value?: string | null) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

/**
 * Map a BackendUser (role = CREATOR) into a Creator shape.
 * Uses the user's real UUID as id so all API calls use the correct recipient.
 */
const backendUserToCreator = (u: BackendUser): Creator => ({
  id: u.id,                                      // real UUID — critical for messaging
  name: u.name,
  avatar: u.profileImage ?? "🎨",
  niche: "Creator",
  followers: 0,
  location: "",
  contact: u.email,
  engagement: "0%",
  collabPrice: 0,
  verified: u.verificationStatus === "VERIFIED",
  bio: "",
  subscribersCount: 0,
  subscriptionFee: 0,
});

/**
 * Map a BackendUser (role = BUSINESS) into a Business shape.
 */
const backendUserToBusiness = (u: BackendUser): Business => ({
  id: u.id,
  name: u.name,
  logo: u.profileImage ?? "🏢",
  email: u.email,
  niche: "Business",
  location: "",
  verified: u.verificationStatus === "VERIFIED",
  bio: "",
});

/**
 * Convert a BackendContent record into the local Post shape.
 * Looks up the creator by creatorId from the provided creators list.
 */
const backendContentToPost = (content: BackendContent, creatorsList: Creator[]): Post => {
  const creator = creatorsList.find((c) => c.id === content.creatorId);
  const postType =
    content.type === "article" ? "text" : content.type === "audio" ? "video" : content.type;
  const visibility =
    content.visibility === "public" ? "public" : "premium";
  return {
    id: content.id,
    creatorId: content.creatorId,
    creatorName: creator?.name ?? "Creator",
    creatorAvatar: creator?.avatar ?? "🎨",
    title: content.title,
    content: content.description ?? "",
    type: postType as Post["type"],
    mediaUrl: content.contentUrl,
    visibility,
    price: content.price ?? undefined,
    likes: 0,
    comments: [],
    unlockedBy: [],
  };
};

const initialTransactions: WalletTransaction[] = [
  {
    id: "tx0",
    type: "deposit",
    amount: 500.0,
    description: "Wallet Initialized (Business)",
    date: "2026-05-18",
  },
  {
    id: "tx1",
    type: "deposit",
    amount: 50.0,
    description: "Wallet Initialized (Fan)",
    date: "2026-05-19",
  },
  {
    id: "tx2",
    type: "unlock_earned",
    amount: 120.0,
    description: "Post unlock earnings (Creator)",
    date: "2026-05-20",
  },
];

const initialNotifications: Notification[] = [
  {
    id: "n1",
    text: "Welcome to InzoziMarket! Complete your profile to get started.",
    date: "Today",
    read: false,
  },
];

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [activeRole, setActiveRole] = useState<Role>("landing");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Balances
  const [fanBalance, setFanBalance] = useState<number>(50.0);
  const [creatorBalance, setCreatorBalance] = useState<number>(120.0);
  const [businessBalance, setBusinessBalance] = useState<number>(500.0);
  const [adminBalance, setAdminBalance] = useState<number>(12.5);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(initialTransactions);

  // Real data from backend — no mock seed values
  const [creators, setCreators] = useState<Creator[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [directMessages, setDirectMessages] = useState<DirectMessageThread[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isLoadingCreators, setIsLoadingCreators] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  const [pendingVerifications, setPendingVerifications] = useState<
    { id: string; name: string; type: "creator" | "business"; niche: string; bio: string }[]
  >([]);

  // ---------------------------------------------------------------------------
  // Data fetching helpers
  // ---------------------------------------------------------------------------

  /**
   * Fetch all users from the backend and split them into creators / businesses.
   * Also fetches creator profiles to enrich with niche, bio, location, avatar, etc.
   */
  const refreshCreators = async () => {
    setIsLoadingCreators(true);
    try {
      const allUsers = await fetchUsersApi();

      // Build creators from CREATOR role users
      const creatorUsers = allUsers.filter((u) => u.role === "CREATOR");
      const businessUsers = allUsers.filter((u) => u.role === "BUSINESS");

      // Try to enrich creators with their creator_profile data
      try {
        const API_BASE_URL = (
          process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"
        ).replace(/\/$/, "");
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("inzozi_accessToken")
            : null;
        const profileRes = await fetch(`${API_BASE_URL}/creator-profile?limit=200`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (profileRes.ok) {
          const profileJson = await profileRes.json();
          const profiles: Array<{
            id: string;
            userId: string;
            bio?: string;
            specialization?: string;
            socialLinks?: string;
            earnings?: number;
            followers?: number;
            avatar?: string;
            location?: string;
            subscriptionFee?: number;
          }> = Array.isArray(profileJson) ? profileJson : profileJson.data ?? [];

          // Merge profile data onto creator users
          const enrichedCreators: Creator[] = creatorUsers.map((u) => {
            const profile = profiles.find((p) => p.userId === u.id);
            return {
              id: u.id,                                             // real UUID
              profileId: profile?.id,
              name: profile?.specialization?.trim() || u.name,     // nickname or real name
              avatar: profile?.avatar || u.profileImage || "🎨",
              niche: profile?.specialization || "Creator",
              followers: profile?.followers ?? 0,
              location: profile?.location || "",
              contact: u.email,
              engagement: "0%",
              collabPrice: profile?.subscriptionFee ?? 0,
              verified: u.verificationStatus === "VERIFIED",
              bio: profile?.bio || "",
              subscribersCount: 0,
              subscriptionFee: profile?.subscriptionFee ?? 0,
            };
          });

          setCreators(enrichedCreators);
        } else {
          // No profile data — use raw user data
          setCreators(creatorUsers.map(backendUserToCreator));
        }
      } catch {
        setCreators(creatorUsers.map(backendUserToCreator));
      }

      setBusinesses(businessUsers.map(backendUserToBusiness));
    } catch {
      // Leave empty on failure — UI should show empty state
    } finally {
      setIsLoadingCreators(false);
    }
  };

  /**
   * Fetch published content from the backend and map to Post shape.
   * Uses current creators state for name/avatar enrichment.
   */
  const refreshPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const contentList = await fetchContentList();
      // We need latest creators for enrichment — read from state via closure
      // Use a callback to get the latest creators value
      setPosts((currentPosts) => {
        // We use setCreators callback trick: read creators from React state
        // but since we can't do that here, we enrich after creators load
        return contentList.map((c) => backendContentToPost(c, []));
      });
      // Immediately re-enrich with creators
      setCreators((currentCreators) => {
        setPosts(contentList.map((c) => backendContentToPost(c, currentCreators)));
        return currentCreators;
      });
    } catch {
      // Leave posts empty on failure
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Load real conversations from backend
  // ---------------------------------------------------------------------------

  /**
   * Fetch all conversations from backend, then load each thread's messages.
   * Maps backend shape → DirectMessageThread so MessagingPanel works unchanged.
   */
  const refreshDirectMessages = async () => {
    const convRes = await listConversationsApi();
    if (!convRes.ok || !convRes.data) return;

    const threads: DirectMessageThread[] = await Promise.all(
      convRes.data.map(async (conv: BackendConversation) => {
        // Load the full thread messages
        const threadRes = await getConversationThreadApi(conv.conversationId);
        const backendMessages = threadRes.data ?? [];

        // Map backend messages to local shape
        const messages = backendMessages.map((m: BackendMessage) => ({
          id: m.id,
          senderId: m.senderId,
          sender: m.sender?.name ?? m.senderId,
          text: m.message,
          timestamp: new Date(m.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        // currentUser might not be in state yet during restore; read from localStorage
        const storedUser = (() => {
          try {
            return JSON.parse(localStorage.getItem("inzozi_currentUser") ?? "null");
          } catch { return null; }
        })();
        const meId = storedUser?.id ?? "";
        const participant = conv.participant;

        // Determine fanId/creatorId so existing MessagingPanel logic still works
        const amIFan = storedUser?.role === "fan" || storedUser?.role === "CONSUMER";
        const fanId = amIFan ? meId : participant.id;
        const fanName = amIFan ? (storedUser?.fullName ?? meId) : participant.name;
        const creatorId = amIFan ? participant.id : meId;
        const creatorName = amIFan ? participant.name : (storedUser?.fullName ?? meId);

        return {
          id: conv.conversationId,           // use stable backend id
          conversationId: conv.conversationId,
          fanId,
          fanName,
          creatorId,
          creatorName,
          participantAvatar: participant.profileImage ?? undefined,
          participantRole: participant.role,
          messages,
          lastFetched: Date.now(),
        } as DirectMessageThread;
      })
    );

    setDirectMessages(threads);
    localStorage.setItem("inzozi_directMessages", JSON.stringify(threads));
  };

  // ---------------------------------------------------------------------------
  // Restore session on mount
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const readJson = <T,>(key: string): T | null => {
      const saved = localStorage.getItem(key);
      if (!saved) return null;
      try {
        return JSON.parse(saved) as T;
      } catch {
        localStorage.removeItem(key);
        return null;
      }
    };

    window.setTimeout(async () => {
      const savedUser = readJson<AuthUser>("inzozi_currentUser");
      const savedRole = localStorage.getItem("inzozi_activeRole") as Role | null;
      const savedFanBalance = localStorage.getItem("inzozi_fanBalance");
      const savedCreatorBalance = localStorage.getItem("inzozi_creatorBalance");
      const savedBusinessBalance = localStorage.getItem("inzozi_businessBalance");
      const savedAdminBalance = localStorage.getItem("inzozi_adminBalance");

      if (savedUser) {
        setCurrentUser(savedUser);
        setActiveRole(savedUser.role);
        setActiveTab(savedUser.role === "fan" || savedUser.role === "creator" ? "feed" : "dashboard");
        // Re-fetch live data on session restore
        await refreshCreators();
        await refreshPosts();
        await refreshDirectMessages(); // load real conversations from backend
      } else if (savedRole && ["landing", "creator", "business", "fan", "admin"].includes(savedRole)) {
        setActiveRole(savedRole);
        await refreshCreators();
        await refreshPosts();
      } else {
        // First visit — fetch public data
        await refreshCreators();
        await refreshPosts();
      }

      if (savedFanBalance) setFanBalance(parseFloat(savedFanBalance));
      if (savedCreatorBalance) setCreatorBalance(parseFloat(savedCreatorBalance));
      if (savedBusinessBalance) setBusinessBalance(parseFloat(savedBusinessBalance));
      if (savedAdminBalance) setAdminBalance(parseFloat(savedAdminBalance));

      setTransactions(readJson<WalletTransaction[]>("inzozi_transactions") ?? initialTransactions);
      setProposals(readJson<Proposal[]>("inzozi_proposals") ?? []);
      setDirectMessages(readJson<DirectMessageThread[]>("inzozi_directMessages") ?? []);
      setNotifications(readJson<Notification[]>("inzozi_notifications") ?? initialNotifications);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeRole !== "landing") localStorage.setItem("inzozi_activeRole", activeRole);
  }, [activeRole]);

  // ---------------------------------------------------------------------------
  // Notifications
  // ---------------------------------------------------------------------------

  const addNotification = (text: string, linkTab?: Tab) => {
    const newNotif: Notification = {
      id: "n_" + Date.now(),
      text,
      date: "Just now",
      read: false,
      linkTab,
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      localStorage.setItem("inzozi_notifications", JSON.stringify(updated));
      return updated;
    });
  };

  // ---------------------------------------------------------------------------
  // Auth helpers
  // ---------------------------------------------------------------------------

  const getRegisteredUsers = (): AuthUser[] => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("inzozi_user_profiles") ?? "[]");
    } catch {
      return [];
    }
  };

  const saveUserProfile = (user: AuthUser) => {
    const users = getRegisteredUsers();
    const normalizedEmail = user.email?.trim().toLowerCase();
    const updatedUsers = [
      user,
      ...users.filter((item) => item.email?.toLowerCase() !== normalizedEmail),
    ];
    localStorage.setItem("inzozi_user_profiles", JSON.stringify(updatedUsers));
  };

  const saveAuthenticatedUser = (
    user: AuthUser,
    accessToken: string,
    refreshToken: string
  ) => {
    localStorage.setItem("inzozi_accessToken", accessToken);
    localStorage.setItem("inzozi_refreshToken", refreshToken);
    localStorage.setItem("inzozi_currentUser", JSON.stringify(user));
    localStorage.setItem("inzozi_activeRole", user.role);
    setCurrentUser(user);
    setActiveRole(user.role);
    setActiveTab(user.role === "fan" || user.role === "creator" ? "feed" : "dashboard");
  };

  // ---------------------------------------------------------------------------
  // Auth actions
  // ---------------------------------------------------------------------------

  const registerUser = async (payload: RegisterUserPayload) => {
    const normalizedEmail = payload.email.trim().toLowerCase();
    try {
      const result = await registerWithApi({
        fullName: payload.fullName,
        email: normalizedEmail,
        phone: payload.phone,
        password: payload.password,
        role: payload.role,
      });
      saveUserProfile({
        id: "pending_" + Date.now(),
        email: normalizedEmail,
        fullName: payload.fullName.trim(),
        phone: payload.phone.trim(),
        role: payload.role,
      });
      return {
        ok: true,
        message: `${result.message} Enter the code sent to your email to continue.`,
        userId: result.userId,
      };
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Could not create account. Please try again.",
      };
    }
  };

  const verifyRegistration = async (userId: string, otp: string) => {
    try {
      const result = await verifyRegistrationWithApi({ userId, otp });
      return { ok: true, message: `${result.message} You can now log in.` };
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Could not verify account. Please try again.",
      };
    }
  };

  const loginUser = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const result = await loginWithApi(normalizedEmail, password);
      const savedProfile = getRegisteredUsers().find(
        (item) => item.email?.toLowerCase() === normalizedEmail
      );

      if (!result.accessToken || !result.refreshToken) {
        return { ok: false, message: "Login succeeded, but the API did not return tokens." };
      }

      const user: AuthUser = {
        id: result.userId ?? savedProfile?.id ?? "user_" + Date.now(),
        fullName: savedProfile?.fullName ?? normalizedEmail,
        email: normalizedEmail,
        phone: savedProfile?.phone,
        avatar: savedProfile?.avatar,
        location: savedProfile?.location,
        role: result.role ?? savedProfile?.role ?? "fan",
      };

      saveUserProfile(user);
      saveAuthenticatedUser(user, result.accessToken, result.refreshToken);

      // Fetch real data from backend after login
      await refreshCreators();
      await refreshPosts();
      await refreshDirectMessages(); // load real conversations

      return { ok: true, message: result.message };
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error ? error.message : "Invalid email or password.",
      };
    }
  };

  const logoutUser = async () => {
    const refreshToken = localStorage.getItem("inzozi_refreshToken");
    await logoutWithApi(refreshToken);
    localStorage.removeItem("inzozi_accessToken");
    localStorage.removeItem("inzozi_refreshToken");
    localStorage.removeItem("inzozi_currentUser");
    localStorage.removeItem("inzozi_activeRole");
    setCurrentUser(null);
    setActiveRole("landing");
    setActiveTab("dashboard");
    // Clear in-memory data so next user starts fresh
    setCreators([]);
    setBusinesses([]);
    setPosts([]);
    setProposals([]);
    setDirectMessages([]);
  };

  // ---------------------------------------------------------------------------
  // Profile updates
  // ---------------------------------------------------------------------------

  const updateFanProfile = async (updates: Partial<AuthUser> & { avatarFile?: File }) => {
    if (!currentUser) {
      return { ok: false, message: "Please log in before updating your profile." };
    }
    let avatar = updates.avatar;
    if (updates.avatarFile) {
      const uploaded = await uploadProfileImageWithApi(updates.avatarFile);
      avatar = uploaded.profileImage;
    }
    const { avatarFile: _avatarFile, ...profileUpdates } = updates;
    const updated = { ...currentUser, ...profileUpdates, ...(avatar ? { avatar } : {}) };
    setCurrentUser(updated);
    localStorage.setItem("inzozi_currentUser", JSON.stringify(updated));
    saveUserProfile(updated);
    addNotification("Profile updated.");
    return { ok: true, message: "Profile updated successfully." };
  };

  const updateBusinessProfile = (
    brandId: string,
    updates: { name: string; avatar?: string; email?: string; contact?: string; bio: string }
  ) => {
    setBusinesses((prev) => {
      const updated = prev.map((b) => {
        if (b.id !== brandId) return b;
        return {
          ...b,
          name: updates.name.trim(),
          logo: updates.avatar?.trim() ?? b.logo,
          email: updates.email?.trim(),
          contact: updates.contact?.trim(),
          bio: updates.bio?.trim(),
        };
      });
      return updated;
    });
    addNotification("Brand profile updated.");
  };

  const updateCreatorProfile = async (creatorId: string, updates: CreatorProfileUpdate) => {
    let avatar = updates.avatar;
    if (updates.avatarFile) {
      const uploaded = await uploadProfileImageWithApi(updates.avatarFile);
      avatar = uploaded.profileImage;
    }
    const existingCreator = creators.find((c) => c.id === creatorId);
    const nextName = updates.name?.trim() || existingCreator?.name || currentUser?.fullName || "Creator";
    const nextAvatar = avatar?.trim() || existingCreator?.avatar || currentUser?.avatar || "";

    setCreators((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== creatorId) return c;
        return {
          ...c,
          name: nextName,
          avatar: nextAvatar,
          location: updates.location?.trim() ?? c.location,
          contact: updates.contact?.trim() ?? c.contact,
          bio: updates.bio?.trim() ?? c.bio,
          niche: updates.niche?.trim() ?? c.niche,
          subscriptionFee: updates.subscriptionFee ?? c.subscriptionFee,
        };
      });
      return updated;
    });

    setPosts((prev) =>
      prev.map((post) => {
        if (post.creatorId !== creatorId) return post;
        return { ...post, creatorName: nextName, creatorAvatar: nextAvatar };
      })
    );

    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        fullName: nextName,
        email: updates.contact?.trim() || currentUser.email,
        location: updates.location?.trim() || currentUser.location,
        ...(nextAvatar ? { avatar: nextAvatar } : {}),
      };
      setCurrentUser(updatedUser);
      localStorage.setItem("inzozi_currentUser", JSON.stringify(updatedUser));
      saveUserProfile(updatedUser);
    }

    addNotification("Creator profile updated.");
    return { ok: true, message: "Creator profile updated successfully." };
  };

  // ---------------------------------------------------------------------------
  // Wallet
  // ---------------------------------------------------------------------------

  const saveTransactions = (newTx: WalletTransaction[]) => {
    setTransactions(newTx);
    localStorage.setItem("inzozi_transactions", JSON.stringify(newTx));
  };

  const deposit = (amount: number, target: "fan" | "business") => {
    const timestamp = new Date().toISOString().split("T")[0];
    const newTx: WalletTransaction = {
      id: "tx_" + Date.now(),
      type: "deposit",
      amount,
      description: "Deposited funds via Mobile Money",
      date: timestamp,
    };
    if (target === "fan") {
      const newBal = fanBalance + amount;
      setFanBalance(newBal);
      localStorage.setItem("inzozi_fanBalance", newBal.toString());
    } else {
      const newBal = businessBalance + amount;
      setBusinessBalance(newBal);
      localStorage.setItem("inzozi_businessBalance", newBal.toString());
    }
    saveTransactions([newTx, ...transactions]);
    addNotification(`Successfully deposited $${amount.toFixed(2)} into your wallet.`);
  };

  const withdraw = (
    amount: number,
    target: "creator" | "business" | "fan",
    method: string,
    details: string
  ) => {
    const timestamp = new Date().toISOString().split("T")[0];
    const newTx: WalletTransaction = {
      id: "tx_" + Date.now(),
      type: "withdrawal",
      amount,
      description: `Withdrew to ${method} (${details})`,
      date: timestamp,
    };
    if (target === "creator") {
      if (amount > creatorBalance) return;
      const newBal = creatorBalance - amount;
      setCreatorBalance(newBal);
      localStorage.setItem("inzozi_creatorBalance", newBal.toString());
    } else if (target === "business") {
      if (amount > businessBalance) return;
      const newBal = businessBalance - amount;
      setBusinessBalance(newBal);
      localStorage.setItem("inzozi_businessBalance", newBal.toString());
    } else {
      if (amount > fanBalance) return;
      const newBal = fanBalance - amount;
      setFanBalance(newBal);
      localStorage.setItem("inzozi_fanBalance", newBal.toString());
    }
    saveTransactions([newTx, ...transactions]);
    addNotification(`Requested withdrawal of $${amount.toFixed(2)} to ${method}.`);
  };

  const tipCreator = (creatorId: string, amount: number): boolean => {
    if (fanBalance < amount) {
      addNotification("Tipping failed: Insufficient wallet balance.");
      return false;
    }
    const commission = amount * 0.05;
    const netEarnings = amount - commission;
    const timestamp = new Date().toISOString().split("T")[0];
    const newFanBal = fanBalance - amount;
    setFanBalance(newFanBal);
    localStorage.setItem("inzozi_fanBalance", newFanBal.toString());
    const newCreatorBal = creatorBalance + netEarnings;
    setCreatorBalance(newCreatorBal);
    localStorage.setItem("inzozi_creatorBalance", newCreatorBal.toString());
    const newAdminBal = adminBalance + commission;
    setAdminBalance(newAdminBal);
    localStorage.setItem("inzozi_adminBalance", newAdminBal.toString());
    const creatorName = creators.find((c) => c.id === creatorId)?.name ?? "Creator";
    saveTransactions([
      { id: "tx_fan_" + Date.now(), type: "tip_sent", amount, description: `Tip sent to ${creatorName}`, date: timestamp },
      { id: "tx_cr_" + Date.now(), type: "tip_received", amount: netEarnings, description: `Tip from Fan (Net: $${netEarnings.toFixed(2)})`, date: timestamp },
      ...transactions,
    ]);
    addNotification(`Sent $${amount.toFixed(2)} tip to ${creatorName}!`);
    return true;
  };

  const subscribeToCreator = (creatorId: string): boolean => {
    const creator = creators.find((c) => c.id === creatorId);
    const subscriptionFee = creator?.subscriptionFee ?? 10.0;
    if (fanBalance < subscriptionFee) {
      addNotification("Subscription failed: Insufficient balance.");
      return false;
    }
    const commission = subscriptionFee * 0.05;
    const netEarnings = subscriptionFee - commission;
    const timestamp = new Date().toISOString().split("T")[0];
    const newFanBal = fanBalance - subscriptionFee;
    setFanBalance(newFanBal);
    localStorage.setItem("inzozi_fanBalance", newFanBal.toString());
    const newCreatorBal = creatorBalance + netEarnings;
    setCreatorBalance(newCreatorBal);
    localStorage.setItem("inzozi_creatorBalance", newCreatorBal.toString());
    const newAdminBal = adminBalance + commission;
    setAdminBalance(newAdminBal);
    localStorage.setItem("inzozi_adminBalance", newAdminBal.toString());
    setCreators((prev) =>
      prev.map((c) =>
        c.id === creatorId ? { ...c, subscribersCount: c.subscribersCount + 1 } : c
      )
    );
    const creatorName = creator?.name ?? "Creator";
    saveTransactions([
      { id: "tx_sub_fan_" + Date.now(), type: "subscription_paid", amount: subscriptionFee, description: `Subscribed to ${creatorName}`, date: timestamp },
      { id: "tx_sub_cr_" + Date.now(), type: "subscription_earned", amount: netEarnings, description: `New Subscriber (Net: $${netEarnings.toFixed(2)})`, date: timestamp },
      ...transactions,
    ]);
    addNotification(`Subscribed successfully to ${creatorName}!`);
    return true;
  };

  const unlockPremiumPost = (postId: string): boolean => {
    const post = posts.find((p) => p.id === postId);
    if (!post || !post.price) return false;
    const price = post.price;
    if (fanBalance < price) {
      addNotification("Cannot unlock post: Insufficient balance.");
      return false;
    }
    const commission = price * 0.05;
    const netEarnings = price - commission;
    const timestamp = new Date().toISOString().split("T")[0];
    const newFanBal = fanBalance - price;
    setFanBalance(newFanBal);
    localStorage.setItem("inzozi_fanBalance", newFanBal.toString());
    const newCreatorBal = creatorBalance + netEarnings;
    setCreatorBalance(newCreatorBal);
    localStorage.setItem("inzozi_creatorBalance", newCreatorBal.toString());
    const newAdminBal = adminBalance + commission;
    setAdminBalance(newAdminBal);
    localStorage.setItem("inzozi_adminBalance", newAdminBal.toString());
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, unlockedBy: [...(p.unlockedBy || []), currentUser?.id ?? ""], isLocked: false } : p
      )
    );
    saveTransactions([
      { id: "tx_unl_fan_" + Date.now(), type: "unlock_paid", amount: price, description: `Unlocked: "${post.title}"`, date: timestamp },
      { id: "tx_unl_cr_" + Date.now(), type: "unlock_earned", amount: netEarnings, description: `Content sale: "${post.title}" (Net: $${netEarnings.toFixed(2)})`, date: timestamp },
      ...transactions,
    ]);
    addNotification(`Unlocked premium content: "${post.title}"`);
    return true;
  };

  // ---------------------------------------------------------------------------
  // Content / Posts
  // ---------------------------------------------------------------------------

  const createPost = async (
    title: string,
    content: string,
    type: "text" | "image" | "video",
    visibility: "public" | "subscriber" | "premium",
    price?: number,
    mediaUrl?: string,
    mediaFile?: File
  ) => {
    const created = await createContentWithApi({
      title,
      description: content,
      type,
      visibility,
      price,
      mediaUrl,
      mediaFile,
    });
    const newPost = backendContentToPost(created, creators);
    setPosts((prev) => [newPost, ...prev]);
    addNotification(`Successfully published new ${visibility} post: "${title}"`);
    return { ok: true, message: "Post created successfully." };
  };

  const likePost = (postId: string) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p)));
  };

  const commentOnPost = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: [...p.comments, { id: "cm_" + Date.now(), user: currentUser?.fullName ?? "You", text }] }
          : p
      )
    );
  };

  // ---------------------------------------------------------------------------
  // Proposals / Campaigns
  // ---------------------------------------------------------------------------

  const launchCampaignProposal = (
    creatorId: string,
    title: string,
    details: string,
    budget: number
  ) => {
    if (!currentUser) return;
    if (businessBalance < budget) {
      addNotification("Failed to send proposal: Insufficient funds for escrow deposit.");
      return;
    }
    if (creatorId === currentUser.id) {
      addNotification("You cannot send a proposal to yourself.", "messages");
      return;
    }
    const timestamp = new Date().toISOString().split("T")[0];
    const creatorName = creators.find((c) => c.id === creatorId)?.name ?? "Creator";
    const newBizBal = businessBalance - budget;
    setBusinessBalance(newBizBal);
    localStorage.setItem("inzozi_businessBalance", newBizBal.toString());
    const newProposal: Proposal = {
      id: "pr_" + Date.now(),
      businessId: currentUser.id,           // real UUID
      businessName: currentUser.fullName || currentUser.id,
      creatorId,                             // real UUID
      creatorName,
      title,
      details,
      budget,
      status: "pending_creator",
      contractCreated: true,
      messages: [
        {
          id: "m_init",
          sender: currentUser.fullName || currentUser.id,
          text: `Hi ${creatorName}, we'd love to collaborate on: "${title}". Budget: $${budget}. ${details}`,
          timestamp: "Just Now",
        },
      ],
    };
    setProposals((prev) => {
      const updated = [newProposal, ...prev];
      localStorage.setItem("inzozi_proposals", JSON.stringify(updated));
      return updated;
    });
    saveTransactions([
      { id: "tx_esc_" + Date.now(), type: "campaign_escrow", amount: budget, description: `Escrow for campaign to ${creatorName}`, date: timestamp },
      ...transactions,
    ]);
    addNotification(`Sent sponsorship proposal to ${creatorName}. $${budget.toFixed(2)} held in escrow.`);
  };

  // ---------------------------------------------------------------------------
  // Messaging
  // ---------------------------------------------------------------------------

  const startChat = (partnerId: string, partnerName: string) => {
    if (!currentUser) return;
    if (partnerId === currentUser.id) {
      addNotification("You cannot start a conversation with yourself.", "messages");
      return;
    }
    startDirectMessage(partnerId);
  };

  /**
   * Start a DM thread. creatorId MUST be a real backend UUID.
   * Since creators state is now sourced from the backend, creator.id is always a real UUID.
   */
  const startDirectMessage = (creatorId: string) => {
    if (!currentUser) return;
    if (creatorId === currentUser.id) {
      addNotification("You cannot start a conversation with yourself.", "messages");
      return;
    }

    // Look up in creators first; if not found (e.g. fan messaging a business) fall back to businesses
    const targetCreator = creators.find((c) => c.id === creatorId);
    const targetBusiness = businesses.find((b) => b.id === creatorId);
    const targetName = targetCreator?.name ?? targetBusiness?.name ?? "User";

    const existing = directMessages.find(
      (dm) =>
        (dm.fanId === currentUser.id && dm.creatorId === creatorId) ||
        (dm.creatorId === currentUser.id && dm.fanId === creatorId)
    );
    if (existing) return;

    const newDM: DirectMessageThread = {
      id: "dm_" + Date.now(),
      fanId: currentUser.id,            // real UUID from login
      fanName: currentUser.fullName || currentUser.id,
      creatorId,                         // real UUID from backend
      creatorName: targetName,
      messages: [],
    };

    setDirectMessages((prev) => {
      const updated = [newDM, ...prev];
      localStorage.setItem("inzozi_directMessages", JSON.stringify(updated));
      return updated;
    });
  };

  const sendMessageToDirectMessage = async (threadId: string, text: string) => {
    if (!currentUser) return false;
    const thread = directMessages.find((dm) => dm.id === threadId);
    if (!thread) return false;

    // Both fanId and creatorId are real backend UUIDs
    const receiverId = currentUser.id === thread.fanId ? thread.creatorId : thread.fanId;

    if (!receiverId || receiverId === currentUser.id) {
      addNotification("Could not send message: invalid receiver.", "messages");
      return false;
    }

    const sent = await sendMessageApi(receiverId, text);
    if (!sent.ok) {
      addNotification(`Message failed: ${sent.message}`, "messages");
      return false;
    }

    // Optimistically add the message to the local thread immediately
    setDirectMessages((prev) => {
      const updated = prev.map((dm) => {
        if (dm.id !== threadId) return dm;
        return {
          ...dm,
          messages: [
            ...dm.messages,
            {
              id: sent.data?.id ?? "m_" + Date.now(),
              senderId: currentUser.id,
              sender: currentUser.fullName || currentUser.id,
              text,
              timestamp: formatMessageDeliveryTime(sent.data?.createdAt),
            },
          ],
        };
      });
      localStorage.setItem("inzozi_directMessages", JSON.stringify(updated));
      return updated;
    });

    // Re-fetch all conversations so both sides stay in sync
    setTimeout(() => refreshDirectMessages(), 500);

    return true;
  };

  const sendMessageToProposal = async (proposalId: string, text: string) => {
    if (!currentUser) return false;
    const proposal = proposals.find((p) => p.id === proposalId);
    if (!proposal) return false;

    // Both businessId and creatorId are real backend UUIDs
    const receiverId =
      currentUser.id === proposal.businessId ? proposal.creatorId : proposal.businessId;

    if (!receiverId || receiverId === currentUser.id) {
      addNotification("Could not send message: invalid receiver.", "messages");
      return false;
    }

    const sent = await sendMessageApi(receiverId, text);
    if (!sent.ok) {
      addNotification(`Message failed: ${sent.message}`, "messages");
      return false;
    }

    setProposals((prev) => {
      const updated = prev.map((prop) => {
        if (prop.id !== proposalId) return prop;
        return {
          ...prop,
          messages: [
            ...prop.messages,
            {
              id: "m_" + Date.now(),
              sender: currentUser.fullName || currentUser.id,
              text,
              timestamp: formatMessageDeliveryTime(sent.data?.createdAt),
            },
          ],
        };
      });
      localStorage.setItem("inzozi_proposals", JSON.stringify(updated));
      return updated;
    });

    return true;
  };

  const respondToProposal = (proposalId: string, action: "accept" | "decline") => {
    const timestamp = new Date().toISOString().split("T")[0];
    setProposals((prev) => {
      const updated = prev.map((prop) => {
        if (prop.id !== proposalId) return prop;
        if (action === "accept") {
          const commission = prop.budget * 0.05;
          const netPayout = prop.budget - commission;
          const newCreatorBal = creatorBalance + netPayout;
          setCreatorBalance(newCreatorBal);
          localStorage.setItem("inzozi_creatorBalance", newCreatorBal.toString());
          const newAdminBal = adminBalance + commission;
          setAdminBalance(newAdminBal);
          localStorage.setItem("inzozi_adminBalance", newAdminBal.toString());
          saveTransactions([
            { id: "tx_pay_" + Date.now(), type: "campaign_payout", amount: netPayout, description: `Escrow payout for "${prop.title}"`, date: timestamp },
            ...transactions,
          ]);
          return {
            ...prop,
            status: "accepted" as const,
            messages: [
              ...prop.messages,
              { id: "m_ans_" + Date.now(), sender: prop.creatorName, text: "Accepted! Let's get started. Contract is active.", timestamp: "Just Now" },
            ],
          };
        } else {
          const refundBal = businessBalance + prop.budget;
          setBusinessBalance(refundBal);
          localStorage.setItem("inzozi_businessBalance", refundBal.toString());
          saveTransactions([
            { id: "tx_ref_" + Date.now(), type: "deposit", amount: prop.budget, description: `Escrow refund: "${prop.title}"`, date: timestamp },
            ...transactions,
          ]);
          return {
            ...prop,
            status: "declined" as const,
            messages: [
              ...prop.messages,
              { id: "m_ans_" + Date.now(), sender: prop.creatorName, text: "Declined the proposal. Thank you for your interest!", timestamp: "Just Now" },
            ],
          };
        }
      });
      localStorage.setItem("inzozi_proposals", JSON.stringify(updated));
      return updated;
    });
    addNotification(`Sponsorship proposal ${action}ed.`);
  };

  // ---------------------------------------------------------------------------
  // Admin
  // ---------------------------------------------------------------------------

  const approveVerification = (id: string) => {
    const item = pendingVerifications.find((pv) => pv.id === id);
    if (!item) return;
    // The item was added from backend data, so just remove from pending
    setPendingVerifications((prev) => prev.filter((pv) => pv.id !== id));
    addNotification(`Approved verification for "${item.name}".`);
    // Refresh creators/businesses to reflect the now-verified status
    refreshCreators();
  };

  const rejectVerification = (id: string) => {
    const item = pendingVerifications.find((pv) => pv.id === id);
    setPendingVerifications((prev) => prev.filter((pv) => pv.id !== id));
    if (item) addNotification(`Rejected verification request for "${item.name}".`);
  };

  const flagPost = (postId: string, reason: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, flagged: true, flagReason: reason } : p))
    );
    addNotification("Post reported to administrators.");
  };

  const removePost = (postId: string) => {
    const target = posts.find((p) => p.id === postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    if (target) addNotification(`Admin removed post "${target.title}".`);
  };

  const dismissFlag = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, flagged: false, flagReason: undefined } : p))
    );
    addNotification("Flag dismissed.");
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.setItem("inzozi_notifications", JSON.stringify([]));
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        activeTab,
        setActiveTab,
        isMobileMenuOpen,
        setMobileMenuOpen,
        currentUser,
        isAuthenticated: Boolean(currentUser),
        fanBalance,
        creatorBalance,
        businessBalance,
        adminBalance,
        transactions,
        creators,
        businesses,
        posts,
        proposals,
        directMessages,
        notifications,
        pendingVerifications,
        isLoadingCreators,
        isLoadingPosts,
        registerUser,
        verifyRegistration,
        loginUser,
        logoutUser,
        refreshCreators,
        refreshPosts,
        refreshDirectMessages,
        updateFanProfile,
        updateBusinessProfile,
        updateCreatorProfile,
        deposit,
        withdraw,
        tipCreator,
        subscribeToCreator,
        unlockPremiumPost,
        createPost,
        likePost,
        commentOnPost,
        launchCampaignProposal,
        startChat,
        startDirectMessage,
        respondToProposal,
        sendMessageToProposal,
        sendMessageToDirectMessage,
        approveVerification,
        rejectVerification,
        flagPost,
        removePost,
        dismissFlag,
        clearNotifications,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};