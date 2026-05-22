"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "landing" | "creator" | "business" | "fan" | "admin";
export type Tab = "dashboard" | "feed" | "campaigns" | "messages" | "wallet" | "admin" | "profile";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Exclude<Role, "landing">;
  password: string;
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  niche: string;
  followers: string;
  location: string;
  contact: string;
  engagement: string;
  collabPrice: number;
  verified: boolean;
  bio: string;
  subscribersCount: number;
}

export interface Business {
  id: string;
  name: string;
  logo: string;
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
  unlockedBy: string[]; // fan user IDs who bought it
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

export interface WalletTransaction {
  id: string;
  type: "deposit" | "withdrawal" | "tip_sent" | "tip_received" | "subscription_paid" | "subscription_earned" | "unlock_paid" | "unlock_earned" | "campaign_escrow" | "campaign_payout";
  amount: number;
  description: string;
  date: string;
}

interface Notification {
  id: string;
  text: string;
  date: string;
  read: boolean;
}

interface AppContextType {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  
  // Wallet Balances
  fanBalance: number;
  creatorBalance: number;
  businessBalance: number;
  adminBalance: number;
  transactions: WalletTransaction[];
  
  // Lists
  creators: Creator[];
  businesses: Business[];
  posts: Post[];
  proposals: Proposal[];
  notifications: Notification[];
  
  // Pending queues
  pendingVerifications: { id: string; name: string; type: "creator" | "business"; niche: string; bio: string }[];
  
  // Methods
  registerUser: (payload: Omit<AuthUser, "id">) => { ok: boolean; message: string };
  loginUser: (email: string, password: string) => { ok: boolean; message: string };
  logoutUser: () => void;
  updateCreatorProfile: (creatorId: string, updates: Pick<Creator, "name" | "location" | "contact" | "bio" | "niche">) => void;
  deposit: (amount: number, target: "fan" | "business") => void;
  withdraw: (amount: number, target: "creator" | "business" | "fan", method: string, details: string) => void;
  tipCreator: (creatorId: string, amount: number) => boolean;
  subscribeToCreator: (creatorId: string) => boolean;
  unlockPremiumPost: (postId: string) => boolean;
  createPost: (title: string, content: string, type: "text" | "image" | "video", visibility: "public" | "subscriber" | "premium", price?: number, mediaUrl?: string) => void;
  likePost: (postId: string) => void;
  commentOnPost: (postId: string, text: string) => void;
  launchCampaignProposal: (creatorId: string, title: string, details: string, budget: number) => void;
  respondToProposal: (proposalId: string, action: "accept" | "decline") => void;
  approveVerification: (id: string) => void;
  rejectVerification: (id: string) => void;
  flagPost: (postId: string, reason: string) => void;
  removePost: (postId: string) => void;
  dismissFlag: (postId: string) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialCreators: Creator[] = [
  {
    id: "c1",
    name: "Kirenga Tech",
    avatar: "🎨",
    niche: "Technology & AI",
    followers: "12.5K",
    location: "Kigali, Rwanda",
    contact: "kirenga.tech@example.com",
    engagement: "8.4%",
    collabPrice: 150,
    verified: true,
    bio: "Reviewing tech innovations and bringing AI tools closer to African content creators. Let's build the future together.",
    subscribersCount: 24,
  },
  {
    id: "c2",
    name: "Ganza Designs",
    avatar: "👗",
    niche: "Fashion & Art",
    followers: "45.2K",
    location: "Nairobi, Kenya",
    contact: "hello@ganzadesigns.example",
    engagement: "6.2%",
    collabPrice: 300,
    verified: true,
    bio: "Eco-friendly street fashion designed and conceptualized in East Africa. Redefining style, one collection at a time.",
    subscribersCount: 88,
  },
  {
    id: "c3",
    name: "Inzozi Chef",
    avatar: "🍲",
    niche: "Food & Lifestyle",
    followers: "8.2K",
    location: "Kampala, Uganda",
    contact: "bookings@inzozichef.example",
    engagement: "11.1%",
    collabPrice: 90,
    verified: false,
    bio: "Bringing authentic East African flavors to modern plates. Sharing culinary masterclasses and spice secrets.",
    subscribersCount: 12,
  },
  {
    id: "c4",
    name: "Amani Sound",
    avatar: "🎙️",
    niche: "Music & Podcasts",
    followers: "18.1K",
    location: "Dar es Salaam, Tanzania",
    contact: "amani.sound@example.com",
    engagement: "7.8%",
    collabPrice: 180,
    verified: true,
    bio: "Exploring the cultural beats and stories of East Africa through ambient recordings and deep discussions.",
    subscribersCount: 35,
  }
];

const initialBusinesses: Business[] = [
  {
    id: "b1",
    name: "Amani Wear",
    logo: "🏬",
    niche: "Apparel & Fashion",
    location: "Kigali, Rwanda",
    verified: true,
    bio: "Premium cultural streetwear brand celebrating contemporary African identity."
  },
  {
    id: "b2",
    name: "Kovu Coffee",
    logo: "☕",
    niche: "Food & Beverages",
    location: "Gisenyi, Rwanda",
    verified: true,
    bio: "Organic single-origin arabica coffee, sourced directly from smallholder farmers."
  }
];

const initialPosts: Post[] = [
  {
    id: "p1",
    creatorId: "c1",
    creatorName: "Kirenga Tech",
    creatorAvatar: "🎨",
    title: "5 AI tools that will speed up your workflow in 2026! 🚀",
    content: "Content creation has changed dramatically. Here are my favorite tools: 1. Claude 3.5 for copy, 2. Midjourney v7 for visuals, 3. ElevenLabs for narration, 4. Veed.io for automatic edits, and 5. InzoziMarket for direct sponsorships. Try them out!",
    type: "text",
    visibility: "public",
    likes: 124,
    comments: [
      { id: "cm1", user: "Eric_K", text: "Great tips! Definitely going to try these." },
      { id: "cm2", user: "Sandra_U", text: "Is Midjourney v7 fully available locally?" }
    ],
    unlockedBy: [],
  },
  {
    id: "p2",
    creatorId: "c2",
    creatorName: "Ganza Designs",
    creatorAvatar: "👗",
    title: "Behind-The-Scenes Sketch of Summer Dream Collection",
    content: "Here is an exclusive look at the pattern mockups and fabric selections for the upcoming runway. Using organic cotton dyed with regional plants.",
    type: "image",
    mediaUrl: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&auto=format&fit=crop&q=60",
    visibility: "subscriber",
    likes: 85,
    comments: [
      { id: "cm3", user: "Grace_M", text: "I can't wait for this collection! The patterns look outstanding." }
    ],
    unlockedBy: [],
  },
  {
    id: "p3",
    creatorId: "c3",
    creatorName: "Inzozi Chef",
    creatorAvatar: "🍲",
    title: "My Secret Local Spice-Mix Masterclass Video 🍲🔥",
    content: "Unlock this full 15-minute video tutorial detailing how to balance coriander, cardamoms, regional chilies, and our secret dried herb to create the perfect stew base that keeps customers coming back.",
    type: "video",
    mediaUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=60",
    visibility: "premium",
    price: 5.99,
    likes: 42,
    comments: [],
    unlockedBy: [],
  }
];

const initialProposals: Proposal[] = [
  {
    id: "pr1",
    businessId: "b1",
    businessName: "Amani Wear",
    creatorId: "c2",
    creatorName: "Ganza Designs",
    title: "Summer Collection Launch Sponsorship",
    details: "We want to sponsor Ganza Designs to create 2 custom posts wearing Amani Wear's new premium cultural jacket during the Summer Launch. The creator will tag @AmaniWear and include purchase links.",
    budget: 250,
    status: "pending_creator",
    contractCreated: false,
    messages: [
      { id: "m1", sender: "Amani Wear", text: "Hello! We love your work and would love to collaborate on our upcoming collection launch.", timestamp: "10:14 AM" },
      { id: "m2", sender: "Amani Wear", text: "We have drafted a contract proposal for $250. Let us know if this works for you!", timestamp: "10:16 AM" }
    ]
  }
];

const initialTransactions: WalletTransaction[] = [
  { id: "tx0", type: "deposit", amount: 500.00, description: "Wallet Initialized (Business)", date: "2026-05-18" },
  { id: "tx1", type: "deposit", amount: 50.00, description: "Wallet Initialized (Fan)", date: "2026-05-19" },
  { id: "tx2", type: "unlock_earned", amount: 120.00, description: "Post unlock earnings (Creator)", date: "2026-05-20" }
];

const initialNotifications: Notification[] = [
  { id: "n1", text: "Welcome to InzoziMarket! Complete your profile to get started.", date: "Today", read: false }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [activeRole, setActiveRole] = useState<Role>("landing");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [fanBalance, setFanBalance] = useState<number>(50.00);
  const [creatorBalance, setCreatorBalance] = useState<number>(120.00);
  const [businessBalance, setBusinessBalance] = useState<number>(500.00);
  const [adminBalance, setAdminBalance] = useState<number>(12.50);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(initialTransactions);
  const [creators, setCreators] = useState<Creator[]>(initialCreators);
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [pendingVerifications, setPendingVerifications] = useState<{ id: string; name: string; type: "creator" | "business"; niche: string; bio: string }[]>([
    {
      id: "verify_1",
      name: "Telecel Africa",
      type: "business",
      niche: "Telecommunications",
      bio: "Connecting African businesses and creators to reliable networking utilities."
    },
    {
      id: "verify_2",
      name: "DJ Kalimba",
      type: "creator",
      niche: "Music & Beats",
      bio: "Afrobeats and Amapiano producer crafting sounds live in Kigali."
    }
  ]);

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

    window.setTimeout(() => {
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
      } else if (savedRole && ["landing", "creator", "business", "fan", "admin"].includes(savedRole)) {
        setActiveRole(savedRole);
      }

      if (savedFanBalance) setFanBalance(parseFloat(savedFanBalance));
      if (savedCreatorBalance) setCreatorBalance(parseFloat(savedCreatorBalance));
      if (savedBusinessBalance) setBusinessBalance(parseFloat(savedBusinessBalance));
      if (savedAdminBalance) setAdminBalance(parseFloat(savedAdminBalance));

      setTransactions(readJson<WalletTransaction[]>("inzozi_transactions") ?? initialTransactions);
      setCreators(readJson<Creator[]>("inzozi_creators") ?? initialCreators);
      setBusinesses(readJson<Business[]>("inzozi_businesses") ?? initialBusinesses);
      setPosts(readJson<Post[]>("inzozi_posts") ?? initialPosts);
      setProposals(readJson<Proposal[]>("inzozi_proposals") ?? initialProposals);
      setNotifications(readJson<Notification[]>("inzozi_notifications") ?? initialNotifications);
    }, 0);
  }, []);

  // Set initial localStorage items if they don't exist yet.
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("inzozi_transactions")) {
        localStorage.setItem("inzozi_transactions", JSON.stringify(initialTransactions));
      }
      if (!localStorage.getItem("inzozi_notifications")) {
        localStorage.setItem("inzozi_notifications", JSON.stringify(initialNotifications));
      }
      if (!localStorage.getItem("inzozi_creators")) {
        localStorage.setItem("inzozi_creators", JSON.stringify(initialCreators));
      }
      if (!localStorage.getItem("inzozi_posts")) {
        localStorage.setItem("inzozi_posts", JSON.stringify(initialPosts));
      }
      if (!localStorage.getItem("inzozi_proposals")) {
        localStorage.setItem("inzozi_proposals", JSON.stringify(initialProposals));
      }
    }
  }, []);

  // Save items on state change
  useEffect(() => {
    if (activeRole !== "landing") localStorage.setItem("inzozi_activeRole", activeRole);
  }, [activeRole]);

  const getRegisteredUsers = (): AuthUser[] => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("inzozi_users");
    return saved ? JSON.parse(saved) : [];
  };

  const registerUser = (payload: Omit<AuthUser, "id">) => {
    const users = getRegisteredUsers();
    const normalizedEmail = payload.email.trim().toLowerCase();

    if (users.some(user => user.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, message: "An account with this email already exists." };
    }

    const newUser: AuthUser = {
      ...payload,
      id: "user_" + Date.now(),
      email: normalizedEmail,
      fullName: payload.fullName.trim(),
      phone: payload.phone.trim()
    };

    localStorage.setItem("inzozi_users", JSON.stringify([newUser, ...users]));
    localStorage.setItem("inzozi_currentUser", JSON.stringify(newUser));
    localStorage.setItem("inzozi_activeRole", newUser.role);
    setCurrentUser(newUser);
    setActiveRole(newUser.role);
    setActiveTab(newUser.role === "fan" || newUser.role === "creator" ? "feed" : "dashboard");
    return { ok: true, message: "Account created successfully." };
  };

  const loginUser = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = getRegisteredUsers().find(
      item => item.email.toLowerCase() === normalizedEmail && item.password === password
    );

    if (!user) {
      return { ok: false, message: "Invalid email or password." };
    }

    localStorage.setItem("inzozi_currentUser", JSON.stringify(user));
    localStorage.setItem("inzozi_activeRole", user.role);
    setCurrentUser(user);
    setActiveRole(user.role);
    setActiveTab(user.role === "fan" || user.role === "creator" ? "feed" : "dashboard");
    return { ok: true, message: "Welcome back." };
  };

  const logoutUser = () => {
    localStorage.removeItem("inzozi_currentUser");
    localStorage.removeItem("inzozi_activeRole");
    setCurrentUser(null);
    setActiveRole("landing");
    setActiveTab("dashboard");
  };

  const updateCreatorProfile = (creatorId: string, updates: Pick<Creator, "name" | "location" | "contact" | "bio" | "niche">) => {
    const updatedCreators = creators.map(creator => {
      if (creator.id !== creatorId) return creator;

      return {
        ...creator,
        name: updates.name.trim(),
        location: updates.location.trim(),
        contact: updates.contact.trim(),
        bio: updates.bio.trim(),
        niche: updates.niche.trim()
      };
    });

    setCreators(updatedCreators);
    localStorage.setItem("inzozi_creators", JSON.stringify(updatedCreators));
    addNotification("Creator profile updated. Brands and fans can now discover your latest profile details.");
  };

  const saveTransactions = (newTx: WalletTransaction[]) => {
    setTransactions(newTx);
    localStorage.setItem("inzozi_transactions", JSON.stringify(newTx));
  };

  const addNotification = (text: string) => {
    const newNotif: Notification = {
      id: "n_" + Date.now(),
      text,
      date: "Just Now",
      read: false
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    localStorage.setItem("inzozi_notifications", JSON.stringify(updated));
  };

  // Deposit Action
  const deposit = (amount: number, target: "fan" | "business") => {
    const timestamp = new Date().toISOString().split("T")[0];
    const newTx: WalletTransaction = {
      id: "tx_" + Date.now(),
      type: "deposit",
      amount,
      description: `Deposited funds via Mobile Money`,
      date: timestamp
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

  // Withdrawal Action
  const withdraw = (amount: number, target: "creator" | "business" | "fan", method: string, details: string) => {
    const timestamp = new Date().toISOString().split("T")[0];
    const newTx: WalletTransaction = {
      id: "tx_" + Date.now(),
      type: "withdrawal",
      amount,
      description: `Withdrew to ${method} (${details})`,
      date: timestamp
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

  // Tipping Creator Action (Fan deducts, Creator gains, Platform gets 5% commission)
  const tipCreator = (creatorId: string, amount: number): boolean => {
    if (fanBalance < amount) {
      addNotification("Tipping failed: Insufficient wallet balance.");
      return false;
    }

    const commission = amount * 0.05;
    const netEarnings = amount - commission;
    const timestamp = new Date().toISOString().split("T")[0];

    // Deduct fan
    const newFanBal = fanBalance - amount;
    setFanBalance(newFanBal);
    localStorage.setItem("inzozi_fanBalance", newFanBal.toString());

    // Add creator
    const newCreatorBal = creatorBalance + netEarnings;
    setCreatorBalance(newCreatorBal);
    localStorage.setItem("inzozi_creatorBalance", newCreatorBal.toString());

    // Add admin
    const newAdminBal = adminBalance + commission;
    setAdminBalance(newAdminBal);
    localStorage.setItem("inzozi_adminBalance", newAdminBal.toString());

    const targetCreator = creators.find(c => c.id === creatorId);
    const creatorName = targetCreator ? targetCreator.name : "Creator";

    // Create transaction history
    const fanTx: WalletTransaction = {
      id: "tx_fan_" + Date.now(),
      type: "tip_sent",
      amount,
      description: `Support tip sent to ${creatorName}`,
      date: timestamp
    };

    const creatorTx: WalletTransaction = {
      id: "tx_cr_" + Date.now(),
      type: "tip_received",
      amount: netEarnings,
      description: `Support tip from Fan (Net: $${netEarnings.toFixed(2)})`,
      date: timestamp
    };

    saveTransactions([fanTx, creatorTx, ...transactions]);
    addNotification(`Sent $${amount.toFixed(2)} tip to ${creatorName}!`);
    return true;
  };

  // Subscribe to Creator (Fan deducts monthly fee, Creator earns, Platform takes 5% commission)
  const subscribeToCreator = (creatorId: string): boolean => {
    const subscriptionFee = 10.00; // Flat monthly rate for demo
    if (fanBalance < subscriptionFee) {
      addNotification("Subscription failed: Insufficient balance.");
      return false;
    }

    const commission = subscriptionFee * 0.05;
    const netEarnings = subscriptionFee - commission;
    const timestamp = new Date().toISOString().split("T")[0];

    // Update balances
    const newFanBal = fanBalance - subscriptionFee;
    setFanBalance(newFanBal);
    localStorage.setItem("inzozi_fanBalance", newFanBal.toString());

    const newCreatorBal = creatorBalance + netEarnings;
    setCreatorBalance(newCreatorBal);
    localStorage.setItem("inzozi_creatorBalance", newCreatorBal.toString());

    const newAdminBal = adminBalance + commission;
    setAdminBalance(newAdminBal);
    localStorage.setItem("inzozi_adminBalance", newAdminBal.toString());

    // Update creators subscribers count
    const updatedCreators = creators.map(c => {
      if (c.id === creatorId) {
        return { ...c, subscribersCount: c.subscribersCount + 1 };
      }
      return c;
    });
    setCreators(updatedCreators);
    localStorage.setItem("inzozi_creators", JSON.stringify(updatedCreators));

    const targetCreator = creators.find(c => c.id === creatorId);
    const creatorName = targetCreator ? targetCreator.name : "Creator";

    // Logs
    const fanTx: WalletTransaction = {
      id: "tx_sub_fan_" + Date.now(),
      type: "subscription_paid",
      amount: subscriptionFee,
      description: `Subscribed to ${creatorName}`,
      date: timestamp
    };

    const creatorTx: WalletTransaction = {
      id: "tx_sub_cr_" + Date.now(),
      type: "subscription_earned",
      amount: netEarnings,
      description: `New Subscriber payout (Net: $${netEarnings.toFixed(2)})`,
      date: timestamp
    };

    saveTransactions([fanTx, creatorTx, ...transactions]);
    addNotification(`Subscribed successfully to ${creatorName}!`);
    return true;
  };

  // Unlock Premium Post
  const unlockPremiumPost = (postId: string): boolean => {
    const post = posts.find(p => p.id === postId);
    if (!post || !post.price) return false;
    
    const price = post.price;
    if (fanBalance < price) {
      addNotification("Cannot unlock post: Insufficient balance.");
      return false;
    }

    const commission = price * 0.05;
    const netEarnings = price - commission;
    const timestamp = new Date().toISOString().split("T")[0];

    // Update balances
    const newFanBal = fanBalance - price;
    setFanBalance(newFanBal);
    localStorage.setItem("inzozi_fanBalance", newFanBal.toString());

    const newCreatorBal = creatorBalance + netEarnings;
    setCreatorBalance(newCreatorBal);
    localStorage.setItem("inzozi_creatorBalance", newCreatorBal.toString());

    const newAdminBal = adminBalance + commission;
    setAdminBalance(newAdminBal);
    localStorage.setItem("inzozi_adminBalance", newAdminBal.toString());

    // Update post unlocked state
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        const unlockedList = [...(p.unlockedBy || []), "fan_user_id"];
        return { ...p, unlockedBy: unlockedList, isLocked: false };
      }
      return p;
    });
    setPosts(updatedPosts);
    localStorage.setItem("inzozi_posts", JSON.stringify(updatedPosts));

    // Tx
    const fanTx: WalletTransaction = {
      id: "tx_unl_fan_" + Date.now(),
      type: "unlock_paid",
      amount: price,
      description: `Unlocked premium post: "${post.title}"`,
      date: timestamp
    };

    const creatorTx: WalletTransaction = {
      id: "tx_unl_cr_" + Date.now(),
      type: "unlock_earned",
      amount: netEarnings,
      description: `Premium content sale: "${post.title}" (Net: $${netEarnings.toFixed(2)})`,
      date: timestamp
    };

    saveTransactions([fanTx, creatorTx, ...transactions]);
    addNotification(`Unlocked premium content: "${post.title}"`);
    return true;
  };

  // Creator Upload Content
  const createPost = (
    title: string,
    content: string,
    type: "text" | "image" | "video",
    visibility: "public" | "subscriber" | "premium",
    price?: number,
    mediaUrl?: string
  ) => {
    const newPost: Post = {
      id: "p_" + Date.now(),
      creatorId: "c1", // Hardcoded creator user for testing
      creatorName: "Kirenga Tech",
      creatorAvatar: "🎨",
      title,
      content,
      type,
      visibility,
      price: visibility === "premium" ? (price || 1.99) : undefined,
      likes: 0,
      comments: [],
      unlockedBy: [],
      mediaUrl: mediaUrl || (type !== "text" ? "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60" : undefined),
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem("inzozi_posts", JSON.stringify(updated));
    addNotification(`Successfully published new ${visibility} post: "${title}"`);
  };

  // Engage with Posts
  const likePost = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem("inzozi_posts", JSON.stringify(updated));
  };

  const commentOnPost = (postId: string, text: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const comments = [...p.comments, { id: "cm_" + Date.now(), user: "You", text }];
        return { ...p, comments };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem("inzozi_posts", JSON.stringify(updated));
  };

  // Brand launches collaboration campaign proposal
  const launchCampaignProposal = (creatorId: string, title: string, details: string, budget: number) => {
    // Escrow verification
    if (businessBalance < budget) {
      addNotification("Failed to send proposal: Insufficient funds in brand wallet for escrow deposit.");
      return;
    }

    const timestamp = new Date().toISOString().split("T")[0];
    const targetCreator = creators.find(c => c.id === creatorId);
    const creatorName = targetCreator ? targetCreator.name : "Creator";

    // Deduct brand balance into escrow
    const newBizBal = businessBalance - budget;
    setBusinessBalance(newBizBal);
    localStorage.setItem("inzozi_businessBalance", newBizBal.toString());

    // Create escrow transaction log
    const escTx: WalletTransaction = {
      id: "tx_esc_" + Date.now(),
      type: "campaign_escrow",
      amount: budget,
      description: `Escrow hold for campaign proposal to ${creatorName}`,
      date: timestamp
    };

    const newProposal: Proposal = {
      id: "pr_" + Date.now(),
      businessId: "b1",
      businessName: "Amani Wear",
      creatorId,
      creatorName,
      title,
      details,
      budget,
      status: "pending_creator",
      contractCreated: true,
      messages: [
        { id: "m_init", sender: "Amani Wear", text: `Hi ${creatorName}, we would love to collaborate on a sponsored campaign: "${title}". Budget: $${budget}. Details: ${details}`, timestamp: "Just Now" }
      ]
    };

    const updatedProposals = [newProposal, ...proposals];
    setProposals(updatedProposals);
    localStorage.setItem("inzozi_proposals", JSON.stringify(updatedProposals));

    saveTransactions([escTx, ...transactions]);
    addNotification(`Sent sponsorship proposal to ${creatorName}. $${budget.toFixed(2)} held in escrow.`);
  };

  // Creator responds to proposal (accept or decline)
  const respondToProposal = (proposalId: string, action: "accept" | "decline") => {
    const timestamp = new Date().toISOString().split("T")[0];
    const updated = proposals.map(prop => {
      if (prop.id === proposalId) {
        if (action === "accept") {
          // Release escrow payout to creator (minus 5% fee)
          const commission = prop.budget * 0.05;
          const netPayout = prop.budget - commission;

          const newCreatorBal = creatorBalance + netPayout;
          setCreatorBalance(newCreatorBal);
          localStorage.setItem("inzozi_creatorBalance", newCreatorBal.toString());

          const newAdminBal = adminBalance + commission;
          setAdminBalance(newAdminBal);
          localStorage.setItem("inzozi_adminBalance", newAdminBal.toString());

          const payoutTx: WalletTransaction = {
            id: "tx_pay_" + Date.now(),
            type: "campaign_payout",
            amount: netPayout,
            description: `Escrow payout for campaign "${prop.title}"`,
            date: timestamp
          };
          saveTransactions([payoutTx, ...transactions]);

          return {
            ...prop,
            status: "accepted" as const,
            messages: [...prop.messages, { id: "m_ans_" + Date.now(), sender: prop.creatorName, text: "I have accepted the campaign proposal! Let's get started on the content. The contract is active.", timestamp: "Just Now" }]
          };
        } else if (action === "decline") {
          // Refund escrow back to business
          const refundBal = businessBalance + prop.budget;
          setBusinessBalance(refundBal);
          localStorage.setItem("inzozi_businessBalance", refundBal.toString());

          const refundTx: WalletTransaction = {
            id: "tx_ref_" + Date.now(),
            type: "deposit",
            amount: prop.budget,
            description: `Escrow refund for declined campaign: "${prop.title}"`,
            date: timestamp
          };
          saveTransactions([refundTx, ...transactions]);

          return {
            ...prop,
            status: "declined" as const,
            messages: [...prop.messages, { id: "m_ans_" + Date.now(), sender: prop.creatorName, text: "I have declined the proposal details. Thank you for the interest!", timestamp: "Just Now" }]
          };
        }
      }
      return prop;
    });

    setProposals(updated);
    localStorage.setItem("inzozi_proposals", JSON.stringify(updated));
    addNotification(`Sponsorship proposal updated: status is now ${action}ed.`);
  };

  // Administrator Actions
  const approveVerification = (id: string) => {
    const verifiedItem = pendingVerifications.find(pv => pv.id === id);
    if (!verifiedItem) return;

    if (verifiedItem.type === "creator") {
      const updatedCreators = creators.map(c => {
        // Since we might be adding DJ Kalimba, check if he exists, or add him
        if (c.name === verifiedItem.name) {
          return { ...c, verified: true };
        }
        return c;
      });

      // If he does not exist, append him
      const exists = creators.some(c => c.name === verifiedItem.name);
      if (!exists) {
        const newCr: Creator = {
          id: "c_" + Date.now(),
          name: verifiedItem.name,
          avatar: "🎧",
          niche: verifiedItem.niche,
          followers: "5.4K",
          location: "Kigali, Rwanda",
          contact: "bookings@example.com",
          engagement: "9.2%",
          collabPrice: 120,
          verified: true,
          bio: verifiedItem.bio,
          subscribersCount: 0
        };
        updatedCreators.push(newCr);
      }

      setCreators(updatedCreators);
      localStorage.setItem("inzozi_creators", JSON.stringify(updatedCreators));
    } else {
      const updatedBiz = businesses.map(b => {
        if (b.name === verifiedItem.name) return { ...b, verified: true };
        return b;
      });
      const exists = businesses.some(b => b.name === verifiedItem.name);
      if (!exists) {
        const newBz: Business = {
          id: "b_" + Date.now(),
          name: verifiedItem.name,
          logo: "📶",
          niche: verifiedItem.niche,
          location: "Kigali, Rwanda",
          verified: true,
          bio: verifiedItem.bio
        };
        updatedBiz.push(newBz);
      }
      setBusinesses(updatedBiz);
      localStorage.setItem("inzozi_businesses", JSON.stringify(updatedBiz));
    }

    setPendingVerifications(pendingVerifications.filter(pv => pv.id !== id));
    addNotification(`Approved and verified profile for "${verifiedItem.name}".`);
  };

  const rejectVerification = (id: string) => {
    const rejectedItem = pendingVerifications.find(pv => pv.id === id);
    setPendingVerifications(pendingVerifications.filter(pv => pv.id !== id));
    if (rejectedItem) {
      addNotification(`Rejected profile verification request for "${rejectedItem.name}".`);
    }
  };

  // Flag post action
  const flagPost = (postId: string, reason: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, flagged: true, flagReason: reason };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem("inzozi_posts", JSON.stringify(updated));
    addNotification(`Post reported successfully to administrators.`);
  };

  // Admin removes post
  const removePost = (postId: string) => {
    const targetPost = posts.find(p => p.id === postId);
    const updated = posts.filter(p => p.id !== postId);
    setPosts(updated);
    localStorage.setItem("inzozi_posts", JSON.stringify(updated));
    if (targetPost) {
      addNotification(`Admin removed post "${targetPost.title}" due to guidelines violations.`);
    }
  };

  const dismissFlag = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, flagged: false, flagReason: undefined };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem("inzozi_posts", JSON.stringify(updated));
    addNotification(`Admin dismissed flags for post.`);
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.setItem("inzozi_notifications", JSON.stringify([]));
  };

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        activeTab,
        setActiveTab,
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
        notifications,
        pendingVerifications,
        registerUser,
        loginUser,
        logoutUser,
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
        respondToProposal,
        approveVerification,
        rejectVerification,
        flagPost,
        removePost,
        dismissFlag,
        clearNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
