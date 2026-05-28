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
    respondToProposal
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
    const sender = activeRole === "business" ? currentProposal.businessName : currentProposal.creatorName;
    
    currentProposal.messages.push({
      id: generateMsgId(),
      sender,
      text: chatInput.trim(),
      timestamp
    });

    setChatInput("");
    // Trigger small UI force update by setting active ID
    setActiveProposalId(currentProposal.id);
  };

  const handleProposalAction = (action: "accept" | "decline") => {
    if (!currentProposal) return;
    respondToProposal(currentProposal.id, action);
  };

  // Filter threads based on role
  const visibleProposals = proposals.filter(p => {
    if (activeRole === "creator") return p.creatorId === "c2"; // Ganza Designs
    if (activeRole === "business") return p.businessId === "b1"; // Amani Wear
    return true;
  });

  return (
    <div className="flex-1 flex max-w-5xl mx-auto w-full border border-white/5 rounded-2xl glass-panel overflow-hidden h-[calc(100vh-140px)] sticky top-[90px]">
      {/* Threads list sidebar */}
      <div className="w-1/3 border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <h2 className="font-bold text-white text-sm">Collaboration Chats</h2>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {visibleProposals.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs px-4">
              No chat threads active. Brands can initiate chats by offering sponsorships to creators.
            </div>
          ) : (
            visibleProposals.map(prop => {
              const partnerName = activeRole === "business" ? prop.creatorName : prop.businessName;
              const lastMsg = prop.messages[prop.messages.length - 1];

              return (
                <button
                  key={prop.id}
                  onClick={() => setActiveProposalId(prop.id)}
                  className={`w-full text-left p-4 hover:bg-white/3 transition-all flex flex-col gap-1.5 ${
                    activeProposalId === prop.id ? "bg-white/5" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-white truncate">{partnerName}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                      prop.status === "accepted" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      prop.status === "declined" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                      "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {prop.status === "pending_creator" ? "Pending" : prop.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 line-clamp-1">
                    {lastMsg ? `${lastMsg.sender}: ${lastMsg.text}` : "No messages yet"}
                  </p>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat pane */}
      {currentProposal ? (
        <div className="flex-1 flex flex-col">
          {/* Active Partner Header */}
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/2">
            <div>
              <span className="font-bold text-sm text-white">
                {activeRole === "business" ? currentProposal.creatorName : currentProposal.businessName}
              </span>
              <span className="text-[10px] text-zinc-500 block">
                Discussion on: <strong className="text-zinc-400">{currentProposal.title}</strong>
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Contract Escrow: ${currentProposal.budget}</span>
            </span>
          </div>

          {/* Messages ledger scroll area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {currentProposal.messages.map(msg => {
              const myName = activeRole === "business" ? currentProposal.businessName : currentProposal.creatorName;
              const isMe = msg.sender === myName;

              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-md rounded-2xl p-3 text-xs leading-relaxed ${
                    isMe 
                      ? "bg-gradient-brand text-white rounded-tr-none shadow-md shadow-purple-500/5" 
                      : "bg-white/5 border border-white/5 text-zinc-200 rounded-tl-none"
                  }`}>
                    {!isMe && (
                      <span className="block font-semibold text-[10px] text-purple-300 mb-1">
                        {msg.sender}
                      </span>
                    )}
                    <p>{msg.text}</p>
                    <span className="block text-[8px] text-zinc-400/80 mt-1 text-right">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat box message draft input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 flex gap-2 bg-white/2">
            <input
              type="text"
              placeholder="Type your message here..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
            />
            <button
              type="submit"
              className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md shadow-purple-500/10 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-sm">
          Select a conversation thread to review deliverables and chat history.
        </div>
      )}

      {/* Negotiations Drawer */}
      {currentProposal && (
        <div className="w-80 border-l border-white/5 p-5 bg-white/2 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5 pb-2.5 border-b border-white/5">
              <Briefcase className="w-4.5 h-4.5 text-purple-400" />
              <span>Contract Negotiation</span>
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold block uppercase">Proposal Title</span>
                <span className="text-xs font-semibold text-zinc-200">{currentProposal.title}</span>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 font-bold block uppercase">Campaign Deliverables</span>
                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1 bg-white/5 p-3 rounded-xl border border-white/5 max-h-48 overflow-y-auto">
                  {currentProposal.details}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 font-bold block uppercase">Escrow Vault hold</span>
                <span className="text-sm font-extrabold text-emerald-400 mt-0.5 block">
                  ${currentProposal.budget.toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-5 space-y-3">
            {currentProposal.status === "pending_creator" ? (
              activeRole === "creator" ? (
                /* Creator sees accept / decline controls */
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-center text-[10px] text-purple-300 leading-normal mb-1">
                    Accepting this contract releases the escrow payment of ${(currentProposal.budget * 0.95).toFixed(2)} (net of platform fee) to your wallet immediately.
                  </div>
                  <button
                    onClick={() => handleProposalAction("accept")}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-md shadow-emerald-500/10"
                  >
                    <Check className="w-4.5 h-4.5" />
                    <span>Accept & Release Payout</span>
                  </button>
                  <button
                    onClick={() => handleProposalAction("decline")}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/10 text-rose-400 border border-white/10 hover:border-rose-500/25 font-bold text-xs transition-all flex items-center justify-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Decline & Refund Brand</span>
                  </button>
                </div>
              ) : (
                /* Business sees wait notice */
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-2.5 text-xs text-amber-400">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Awaiting Creator Response</span>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Your budget of ${currentProposal.budget} is held in secure vault custody. If they decline, it will be refunded to your brand wallet automatically.
                    </p>
                  </div>
                </div>
              )
            ) : currentProposal.status === "accepted" ? (
              /* Accepted state notice */
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-2.5 text-xs text-emerald-400">
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px]">Contract Active</span>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Escrow payouts have been completed. The creator is approved to finalize and publish the sponsored deliverables.
                  </p>
                </div>
              </div>
            ) : (
              /* Declined state notice */
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex gap-2.5 text-xs text-rose-400">
                <X className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px]">Proposal Declined</span>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    The contract was declined. Locked funds have been fully refunded back to the brand wallet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
