"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  CheckCircle, 
  CreditCard, 
  PhoneCall, 
  Send,
  AlertTriangle
} from "lucide-react";

export const WalletDashboard: React.FC = () => {
  const { 
    activeRole, 
    fanBalance, 
    creatorBalance, 
    businessBalance, 
    adminBalance,
    transactions,
    deposit,
    withdraw
  } = useApp();

  // Operation tab: 'deposit' | 'withdraw'
  const [activeOp, setActiveOp] = useState<"deposit" | "withdraw">("deposit");

  // Form states
  const [amount, setAmount] = useState("50.00");
  const [provider, setProvider] = useState("MTN Mobile Money");
  const [accountNo, setAccountNo] = useState("0788123456");
  const [payoutBank, setPayoutBank] = useState("Kigali Bank");
  const [payoutAccount, setPayoutAccount] = useState("10029384812");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const getCurrentBalance = () => {
    switch (activeRole) {
      case "fan": return fanBalance;
      case "creator": return creatorBalance;
      case "business": return businessBalance;
      case "admin": return adminBalance;
      default: return 0;
    }
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg("Please enter a valid deposit amount.");
      return;
    }

    if (activeRole !== "fan" && activeRole !== "business") {
      setErrorMsg("Only Fans and Businesses can deposit funds directly. Creator wallets collect earnings from tips and sponsorships.");
      return;
    }

    deposit(amt, activeRole);
    setSuccessMsg(`Successfully deposited $${amt.toFixed(2)} into your wallet.`);
    setAmount("50.00");
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg("Please enter a valid cashout amount.");
      return;
    }

    const currentBal = getCurrentBalance();
    if (amt > currentBal) {
      setErrorMsg(`Insufficient funds! Your max withdrawal limit is $${currentBal.toFixed(2)}.`);
      return;
    }

    const method = provider === "Direct Bank Transfer" ? `Bank: ${payoutBank}` : provider;
    const details = provider === "Direct Bank Transfer" ? payoutAccount : accountNo;

    withdraw(amt, activeRole as "fan" | "creator" | "business", method, details);
    setSuccessMsg(`Cashout request submitted. $${amt.toFixed(2)} will be processed to ${method}.`);
    setAmount("50.00");
  };

  return (
    <div className="flex-1 space-y-8 p-6 md:p-10 max-w-5xl mx-auto w-full">
      {/* Wallet Heading */}
      <div className="flex justify-between items-center border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Finance & Digital Wallet</h1>
          <p className="text-zinc-400 text-sm mt-1">Add advertising budgets or withdraw earned tips and sponsorships.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 badge-glow"></span>
          <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Gateway online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Balance & Quick Transaction Actions */}
        <div className="space-y-6">
          {/* Balance card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-purple-500/10 to-transparent flex flex-col justify-between h-48 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl z-0"></div>
            
            <div className="z-10 flex justify-between items-start">
              <div>
                <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Ecosystem Balance</span>
                <span className="block text-3xl font-black text-white mt-1.5">${getCurrentBalance().toFixed(2)}</span>
              </div>
              <Wallet className="w-8 h-8 text-purple-400" />
            </div>

            <div className="z-10 flex gap-2 border-t border-white/5 pt-4">
              {/* Only show deposit options to paying roles */}
              {(activeRole === "fan" || activeRole === "business") && (
                <button
                  onClick={() => { setActiveOp("deposit"); setErrorMsg(""); setSuccessMsg(""); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeOp === "deposit" ? "bg-purple-600 text-white" : "bg-white/5 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  Deposit
                </button>
              )}
              <button
                onClick={() => { setActiveOp("withdraw"); setErrorMsg(""); setSuccessMsg(""); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeOp === "withdraw" ? "bg-purple-600 text-white" : "bg-white/5 text-zinc-300 hover:bg-white/10"
                }`}
              >
                Cash Out
              </button>
            </div>
          </div>

          {/* Secure vault advisory */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/2">
            <h3 className="font-bold text-xs text-zinc-300 flex items-center gap-1.5 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Mobile Money Protected</span>
            </h3>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              Deposits and withdrawals support East African Mobile Money systems (MTN MoMo, Airtel Money) as well as global credit card processing. Escrow budgets are locked securely in transit.
            </p>
          </div>
        </div>

        {/* Middle: Deposit/Withdrawal Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <h2 className="text-base font-bold text-white mb-4">
              {activeOp === "deposit" ? "Load Wallet Funds" : "Withdraw Earnings"}
            </h2>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex gap-2 items-start mb-4">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs flex gap-2 items-start mb-4">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {activeOp === "deposit" ? (
              /* DEPOSIT FORM */
              <form onSubmit={handleDepositSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase">Payment Method</label>
                    <select
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    >
                      <option value="MTN Mobile Money">MTN MoMo</option>
                      <option value="Airtel Money">Airtel Money</option>
                      <option value="Visa Credit Card">Visa / Mastercard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase">Amount ($ USD)</label>
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                      <span className="text-xs text-zinc-400 font-bold">$</span>
                      <input
                        type="number"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-transparent text-xs border-none focus:outline-none text-white font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {provider !== "Visa Credit Card" ? (
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase">Mobile Money Number</label>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                      <PhoneCall className="w-4 h-4 text-zinc-500" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0788123456"
                        value={accountNo}
                        onChange={(e) => setAccountNo(e.target.value)}
                        className="w-full bg-transparent text-xs border-none focus:outline-none text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase">Card Number</label>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                      <CreditCard className="w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        required
                        placeholder="4111 2222 3333 4444"
                        className="w-full bg-transparent text-xs border-none focus:outline-none text-white"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-brand text-white text-xs font-bold shadow-lg shadow-purple-500/10 flex items-center justify-center gap-1 hover:scale-101 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Initiate Deposit</span>
                </button>
              </form>
            ) : (
              /* WITHDRAWAL FORM */
              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase">Payout System</label>
                    <select
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    >
                      <option value="MTN Mobile Money">MTN MoMo Payout</option>
                      <option value="Airtel Money">Airtel Money Payout</option>
                      <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase">Amount to Cashout</label>
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                      <span className="text-xs text-zinc-400 font-bold">$</span>
                      <input
                        type="number"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-transparent text-xs border-none focus:outline-none text-white font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {provider === "Direct Bank Transfer" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase">Bank Name</label>
                      <input
                        type="text"
                        required
                        value={payoutBank}
                        onChange={(e) => setPayoutBank(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase">Account Number</label>
                      <input
                        type="text"
                        required
                        value={payoutAccount}
                        onChange={(e) => setPayoutAccount(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase">Mobile Money Wallet Number</label>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                      <PhoneCall className="w-4 h-4 text-zinc-500" />
                      <input
                        type="tel"
                        required
                        value={accountNo}
                        onChange={(e) => setAccountNo(e.target.value)}
                        className="w-full bg-transparent text-xs border-none focus:outline-none text-white"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-500/10 flex items-center justify-center gap-1 hover:scale-101 transition-all"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Request Cashout</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Ledger */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <h2 className="text-base font-bold text-white mb-5">Transactions Ledger Log</h2>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-sm">
            No transaction records found. Complete tipping or post unlocks to record events.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 font-bold uppercase pb-3">
                  <th className="pb-3">Transaction ID</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {transactions.map(tx => {
                  const isPositive = 
                    tx.type === "deposit" || 
                    tx.type === "tip_received" || 
                    tx.type === "subscription_earned" || 
                    tx.type === "unlock_earned" || 
                    tx.type === "campaign_payout";

                  return (
                    <tr key={tx.id} className="hover:bg-white/2 transition-all">
                      <td className="py-3.5 font-mono text-[10px] text-zinc-500">{tx.id}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          isPositive 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}>
                          {isPositive ? <ArrowDownLeft className="w-2.5 h-2.5" /> : <ArrowUpRight className="w-2.5 h-2.5" />}
                          {tx.type.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 max-w-xs truncate text-zinc-400">{tx.description}</td>
                      <td className="py-3.5 text-zinc-500">{tx.date}</td>
                      <td className={`py-3.5 text-right font-bold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                        {isPositive ? "+" : "-"}${tx.amount.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
