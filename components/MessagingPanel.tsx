"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  Send, 
  Briefcase, 
  Check, 
  X, 
  MessageSquare, 
  ShieldCheck, 
  DollarSign,
  AlertCircle
} from "lucide-react";

const generateMsgId = () => "msg_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now();

export const MessagingPanel: React.FC = () => {
  const { 
    activeRole, 
    proposals, 
    respondToProposal,
    creators,
    businesses,
    currentUser,
    addNotification
  } = useApp();

  const [activeProposalId, setActiveProposalId] = useState<string>(
    proposals.length > 0 ? proposals[0].id : ""
  );

  const [chatInput, setChatInput] = useState("");

  const currentProposal = proposals.find(p => p.id === activeProposalId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentProposal) return;

    // Simulate sending message by pushing to proposal message list
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sender = currentUser ? (currentUser.fullName || currentUser.id) : (activeRole === "business" ? currentProposal.businessName : currentProposal.creatorName);
    
    currentProposal.messages.push({
      id: generateMsgId(),
      sender,
      text: chatInput.trim(),
      timestamp
    });

    // Notify the other user (mock logic: we just add a global notification so you can see it)
    addNotification(`New message from ${sender}: "${chatInput.trim()}"`, "messages");

    setChatInput("");
    // Trigger small UI force update by setting active ID
    setActiveProposalId(currentProposal.id);
  };

  const handleProposalAction = (action: "accept" | "decline") => {
    if (!currentProposal) return;
    respondToProposal(currentProposal.id, action);
  };

  // Filter threads based on the current user
  const visibleProposals = proposals.filter(p => {
    if (!currentUser) return false;
    // Show if the user is either the creator or the business side of the chat
    return p.creatorId === currentUser.id || p.businessId === currentUser.id;
  });

  // Helper to get partner info
  const getPartnerInfo = (proposal: any) => {
    if (activeRole === "business") {
      const creator = creators.find(c => c.id === proposal.creatorId);
      return {
        name: proposal.creatorName,
        avatar: creator ? creator.avatar : "👤",
        role: "Creator"
      };
    } else {
      const business = businesses.find(b => b.id === proposal.businessId);
      return {
        name: proposal.businessName,
        avatar: business && business.logo ? business.logo : "🏢",
        role: "Brand"
      };
    }
  };

  return (
    <div className="flex-1 flex max-w-[1200px] mx-auto w-full border border-gray-200 rounded-2xl bg-white overflow-hidden h-[calc(100vh-140px)] sticky top-[90px] shadow-sm">
      
      {/* 1. Chat pane (Left Side - swapped) */}
      <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
        {currentProposal ? (
          <>
            {/* Active Partner Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-zinc-900 flex items-center justify-center text-xl text-white border border-gray-200">
                  {getPartnerInfo(currentProposal).avatar}
                </div>
                <div>
                  <span className="font-bold text-sm text-black flex items-center gap-2">
                    {getPartnerInfo(currentProposal).name}
                    <span className="text-[10px] font-medium px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                      {getPartnerInfo(currentProposal).role}
                    </span>
                  </span>
                  <span className="text-[11px] text-gray-500 block mt-0.5">
                    Discussion on: <strong className="text-gray-700">{currentProposal.title}</strong>
                  </span>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <DollarSign className="w-4 h-4" />
                <span>Escrow Vault: ${currentProposal.budget.toFixed(2)}</span>
              </span>
            </div>

            {/* Messages ledger scroll area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {currentProposal.messages.map(msg => {
                const myName = activeRole === "business" ? currentProposal.businessName : currentProposal.creatorName;
                const isMe = msg.sender === myName;

                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                      isMe 
                        ? "bg-blue-600 text-white rounded-br-none shadow-sm" 
                        : "bg-gray-100 border border-gray-200 text-black rounded-bl-none"
                    }`}>
                      {!isMe && (
                        <span className="block font-semibold text-[11px] text-gray-500 mb-1">
                          {msg.sender}
                        </span>
                      )}
                      <p>{msg.text}</p>
                      <span className={`block text-[10px] mt-2 text-right ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat box message draft input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex gap-3 bg-gray-50">
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
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-sm">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
            <p>Select a conversation thread to review deliverables and chat history.</p>
          </div>
        )}
      </div>

      {/* 2. Threads list sidebar (Right Side - swapped) */}
      <div className="w-80 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2 bg-white">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-black text-sm">Other Conversations</h2>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
          {visibleProposals.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs px-4">
              No active threads. Brands can initiate chats by offering sponsorships.
            </div>
          ) : (
            visibleProposals.map(prop => {
              const partnerInfo = getPartnerInfo(prop);
              const lastMsg = prop.messages[prop.messages.length - 1];

              return (
                <button
                  key={prop.id}
                  onClick={() => setActiveProposalId(prop.id)}
                  className={`w-full text-left p-4 hover:bg-gray-100 transition-all flex flex-col gap-2 ${
                    activeProposalId === prop.id ? "bg-white border-l-4 border-l-blue-600 shadow-sm" : "border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                       <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-[12px] text-white">
                         {partnerInfo.avatar}
                       </div>
                       <span className="font-bold text-sm text-black truncate max-w-[120px]">{partnerInfo.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      prop.status === "accepted" ? "bg-emerald-100 text-emerald-700" :
                      prop.status === "declined" ? "bg-rose-100 text-rose-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {prop.status === "pending_creator" ? "Pending" : prop.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1 ml-[42px]">
                    {lastMsg ? `${lastMsg.sender === partnerInfo.name ? partnerInfo.name : 'You'}: ${lastMsg.text}` : "No messages yet"}
                  </p>
                </button>
              );
            })
          )}
        </div>

        {/* Negotiations Drawer */}
        {currentProposal && (
          <div className="h-2/5 border-t border-gray-200 p-5 bg-white flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-black flex items-center gap-2 pb-2 border-b border-gray-200">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>Contract Details</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <span className="text-[11px] text-gray-500 font-bold block uppercase tracking-wide">Deliverables</span>
                  <p className="text-xs text-gray-700 leading-relaxed mt-1 max-h-24 overflow-y-auto bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    {currentProposal.details}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3">
              {currentProposal.status === "pending_creator" ? (
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
                      <p className="text-[10px] opacity-80 leading-tight">Funds held in secure vault until creator decides.</p>
                    </div>
                  </div>
                )
              ) : currentProposal.status === "accepted" ? (
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex gap-2.5 text-xs text-emerald-700">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">Contract Active</span>
                    <p className="text-[10px] opacity-80 leading-tight">Escrow payouts complete. Safe to collaborate.</p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex gap-2.5 text-xs text-rose-700">
                  <X className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">Declined</span>
                    <p className="text-[10px] opacity-80 leading-tight">Funds fully refunded to brand wallet.</p>
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
