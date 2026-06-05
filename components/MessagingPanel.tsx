"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import {
  Send,
  Briefcase,
  Check,
  X,
  MessageSquare,
  ShieldCheck,
  DollarSign,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export const MessagingPanel: React.FC = () => {
  const {
    activeRole,
    proposals,
    directMessages,
    sendMessageToProposal,
    sendMessageToDirectMessage,
    respondToProposal,
    creators,
    businesses,
    currentUser,
    addNotification,
    refreshDirectMessages,
    refreshProposals,
  } = useApp();

  const [chatInput, setChatInput] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ─── Build unified conversation list ──────────────────────────────────────

  const visibleConversations = React.useMemo(() => {
    if (!currentUser) return [];

    const convos: any[] = [];

    // Proposal threads (business ↔ creator)
    proposals.forEach((p) => {
      if (p.creatorId !== currentUser.id && p.businessId !== currentUser.id) return;

      const isBusiness = activeRole === "business";
      const partnerName = isBusiness ? p.creatorName : p.businessName;
      const partnerAvatar = isBusiness
        ? creators.find((c) => c.id === p.creatorId)?.avatar ?? "👤"
        : businesses.find((b) => b.id === p.businessId)?.logo ?? "🏢";

      convos.push({
        id: p.id,
        type: "proposal",
        title: p.title,
        partnerName,
        partnerAvatar,
        partnerRole: isBusiness ? "Creator" : "Brand",
        messages: p.messages,
        originalProposal: p,
      });
    });

    // Direct message threads — sourced from backend via refreshDirectMessages
    directMessages.forEach((dm) => {
      if (dm.creatorId !== currentUser.id && dm.fanId !== currentUser.id) return;

      const isFan =
        activeRole === "fan" ||
        activeRole === "creator" ||
        activeRole === "business" ||
        activeRole === "admin";

      // Determine partner relative to current user
      const isCurrentUserFan = dm.fanId === currentUser.id;
      const partnerName = isCurrentUserFan ? dm.creatorName : dm.fanName;
      const partnerId = isCurrentUserFan ? dm.creatorId : dm.fanId;
      const partnerRole = dm.participantRole ?? (isCurrentUserFan ? "Creator" : "Fan");

      // Try to find avatar from creators/businesses list, fallback to stored avatar
      const creatorMatch = creators.find((c) => c.id === partnerId);
      const businessMatch = businesses.find((b) => b.id === partnerId);
      const partnerAvatar =
        dm.participantAvatar ??
        creatorMatch?.avatar ??
        businessMatch?.logo ??
        "👤";

      convos.push({
        id: dm.id,
        type: "dm",
        title: "Direct Message",
        partnerName,
        partnerAvatar,
        partnerRole,
        messages: dm.messages,
        originalDM: dm,
      });
    });

    return convos;
  }, [proposals, directMessages, currentUser, activeRole, creators, businesses]);

  // Auto-select first conversation
  useEffect(() => {
    if (visibleConversations.length > 0 && !activeConversationId) {
      setActiveConversationId(visibleConversations[0].id);
    }
  }, [visibleConversations, activeConversationId]);

  // If active conversation disappears (e.g. after refresh), reset to first
  useEffect(() => {
    const exists = visibleConversations.some((c) => c.id === activeConversationId);
    if (!exists && visibleConversations.length > 0) {
      setActiveConversationId(visibleConversations[0].id);
    }
  }, [visibleConversations, activeConversationId]);

  // Scroll to latest message when thread changes or new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversationId, visibleConversations]);

  const currentConversation = visibleConversations.find(
    (c) => c.id === activeConversationId
  );

  // ─── Send message ──────────────────────────────────────────────────────────

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentConversation) return;

    let sent = false;
    if (currentConversation.type === "proposal") {
      sent = await sendMessageToProposal(currentConversation.id, chatInput.trim());
    } else {
      sent = await sendMessageToDirectMessage(currentConversation.id, chatInput.trim());
    }

    if (sent) {
      setChatInput("");
    }
  };

  const handleProposalAction = (action: "accept" | "decline") => {
    if (!currentConversation || currentConversation.type !== "proposal") return;
    respondToProposal(
      currentConversation.originalProposal.campaignId,
      currentConversation.originalProposal.creatorId,
      action
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refreshDirectMessages(), refreshProposals()]);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (!currentUser) return;
    refreshProposals();
  }, [currentUser?.id, activeRole]);

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const isMyMessage = (msg: any) => {
    if (!currentUser) return false;
    // Prefer senderId comparison (reliable), fall back to name match
    if (msg.senderId) return msg.senderId === currentUser.id;
    const myName = currentUser.fullName || currentUser.id;
    return msg.sender === myName;
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex max-w-[1200px] mx-auto w-full border border-gray-200 rounded-2xl bg-white overflow-hidden h-[calc(100vh-140px)] sticky top-[90px] shadow-sm">

      {/* ── Chat pane (left) ── */}
      <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
        {currentConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-zinc-900 flex items-center justify-center text-xl text-white border border-gray-200 overflow-hidden">
                  {currentConversation.partnerAvatar?.startsWith("http") ? (
                    <img
                      src={currentConversation.partnerAvatar}
                      alt={currentConversation.partnerName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    currentConversation.partnerAvatar
                  )}
                </div>
                <div>
                  <span className="font-bold text-sm text-black flex items-center gap-2">
                    {currentConversation.partnerName}
                    <span className="text-[10px] font-medium px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                      {currentConversation.partnerRole}
                    </span>
                  </span>
                  <span className="text-[11px] text-gray-500 block mt-0.5">
                    Discussion on:{" "}
                    <strong className="text-gray-700">{currentConversation.title}</strong>
                  </span>
                </div>
              </div>
              {currentConversation.type === "proposal" && currentConversation.originalProposal && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <DollarSign className="w-4 h-4" />
                  <span>
                    Escrow: ${currentConversation.originalProposal.budget.toFixed(2)}
                  </span>
                </span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {currentConversation.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
                  <MessageSquare className="w-8 h-8 text-gray-300" />
                  <p>No messages yet. Say hello!</p>
                </div>
              ) : (
                currentConversation.messages.map((msg: any) => {
                  const mine = isMyMessage(msg);
                  return (
                    <div key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                          mine
                            ? "bg-blue-600 text-white rounded-br-none shadow-sm"
                            : "bg-gray-100 border border-gray-200 text-black rounded-bl-none"
                        }`}
                      >
                        {!mine && (
                          <span className="block font-semibold text-[11px] text-gray-500 mb-1">
                            {msg.sender}
                          </span>
                        )}
                        <p>{msg.text}</p>
                        <span
                          className={`block text-[10px] mt-2 text-right ${
                            mine ? "text-blue-200" : "text-gray-400"
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 flex gap-3 bg-gray-50"
            >
              <input
                type="text"
                placeholder="Type your message here..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white transition-all shadow-sm font-bold flex items-center gap-2"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-sm gap-3">
            <MessageSquare className="w-12 h-12 text-gray-300" />
            <p>Select a conversation to start chatting.</p>
            {currentUser && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Loading..." : "Refresh conversations"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Sidebar (right) ── */}
      <div className="w-80 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-black text-sm">Conversations</h2>
            {visibleConversations.length > 0 && (
              <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {visibleConversations.length}
              </span>
            )}
          </div>
          {currentUser && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh conversations"
              className="text-gray-400 hover:text-blue-600 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
          {visibleConversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs px-4 space-y-3">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto" />
              <p>No conversations yet.</p>
              {currentUser && (
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-1.5 text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg mx-auto"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
                  {isRefreshing ? "Loading..." : "Load conversations"}
                </button>
              )}
            </div>
          ) : (
            visibleConversations.map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              const isActive = activeConversationId === conv.id;

              let statusLabel = "Direct";
              let statusClass = "bg-blue-100 text-blue-700";
              if (conv.type === "proposal" && conv.originalProposal) {
                const s = conv.originalProposal.status;
                statusLabel =
                  s === "accepted"
                    ? "accepted"
                    : s === "declined"
                    ? "declined"
                    : "Pending";
                statusClass =
                  s === "accepted"
                    ? "bg-emerald-100 text-emerald-700"
                    : s === "declined"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-amber-100 text-amber-700";
              }

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`w-full text-left p-4 hover:bg-gray-100 transition-all flex flex-col gap-2 ${
                    isActive
                      ? "bg-white border-l-4 border-l-blue-600 shadow-sm"
                      : "border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-[12px] text-white overflow-hidden flex-shrink-0">
                        {conv.partnerAvatar?.startsWith("http") ? (
                          <img
                            src={conv.partnerAvatar}
                            alt={conv.partnerName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          conv.partnerAvatar
                        )}
                      </div>
                      <span className="font-bold text-sm text-black truncate max-w-[110px]">
                        {conv.partnerName}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1 ml-[42px]">
                    {lastMsg
                      ? `${isMyMessage(lastMsg) ? "You" : lastMsg.sender}: ${lastMsg.text}`
                      : "No messages yet"}
                  </p>
                </button>
              );
            })
          )}
        </div>

        {/* Contract details drawer */}
        {currentConversation?.type === "proposal" && currentConversation.originalProposal && (
          <div className="h-2/5 border-t border-gray-200 p-5 bg-white flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-black flex items-center gap-2 pb-2 border-b border-gray-200">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>Contract Details</span>
              </h3>
              <div>
                <span className="text-[11px] text-gray-500 font-bold block uppercase tracking-wide">
                  Deliverables
                </span>
                <p className="text-xs text-gray-700 leading-relaxed mt-1 max-h-24 overflow-y-auto bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                  {currentConversation.originalProposal.details}
                </p>
              </div>
            </div>

            <div className="pt-3 mt-3">
              {currentConversation.originalProposal.status === "pending_creator" ? (
                activeRole === "creator" ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleProposalAction("accept")}
                      className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-4 h-4" /> Accept Contract
                    </button>
                    <button
                      onClick={() => handleProposalAction("decline")}
                      className="w-full py-2.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-gray-200 hover:border-rose-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <X className="w-4 h-4" /> Decline
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex gap-2.5 text-xs text-amber-700">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-1">Awaiting Creator Response</span>
                      <p className="text-[10px] opacity-80 leading-tight">
                        Funds held in secure vault until creator decides.
                      </p>
                    </div>
                  </div>
                )
              ) : currentConversation.originalProposal.status === "accepted" ? (
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex gap-2.5 text-xs text-emerald-700">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">Contract Active</span>
                    <p className="text-[10px] opacity-80 leading-tight">
                      Escrow payout complete. Safe to collaborate.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex gap-2.5 text-xs text-rose-700">
                  <X className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">Declined</span>
                    <p className="text-[10px] opacity-80 leading-tight">
                      Funds fully refunded to brand wallet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
