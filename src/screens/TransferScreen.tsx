import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useBank } from "../context/BankContext";
import { Wallet, Banknote, UserPlus, ArrowRight, Search, CheckCircle2, Plus } from "lucide-react";

export const TransferScreen: React.FC = () => {
  const { accountBalance, verifyAccountNumber, performTransfer, isLoading } = useBank();
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [receiverName, setReceiverName] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  useEffect(() => {
    if (accountNumber.length === 10) {
      handleVerify(accountNumber);
    } else {
      setReceiverName(null);
    }
  }, [accountNumber]);

  const handleVerify = async (acc: string) => {
    setVerifying(true);
    const name = await verifyAccountNumber(acc);
    setReceiverName(name || "Could not verify name");
    setVerifying(false);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || !amount || parseFloat(amount) <= 0) return;
    
    const result = await performTransfer(accountNumber, parseFloat(amount), narration);
    setStatus(result);
    if (result.success) {
      setAccountNumber("");
      setAmount("");
      setNarration("");
      setReceiverName(null);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-700">
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Execute Atomic Transfer</h2>
        <p className="text-sm text-slate-500 italic">Fast, secure, and permanent internal movements.</p>
      </section>

      <div className="h-40 bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col h-full justify-between">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Available Balance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl text-orange-500 font-bold">₦</span>
            <span className="text-4xl text-white font-bold italic">{accountBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 opacity-10 rounded-full -mr-16 -mt-16 blur-xl"></div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 relative">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          Transfer Details
        </h3>

        <form onSubmit={handleTransfer} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Account Number (NUBAN)</label>
            <div className="relative">
              <input 
                type="text" 
                maxLength={10}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-mono text-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" 
                placeholder="0000000000" 
              />
              {verifying && <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>}
            </div>
            {receiverName && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`mt-2 p-4 border rounded-2xl flex items-center gap-3 ${receiverName === "Could not verify name" ? "bg-red-50 border-red-100 text-red-600" : "bg-green-50 border-green-100 text-green-700"}`}>
                 <div className={`w-2 h-2 rounded-full ${receiverName === "Could not verify name" ? "bg-red-500" : "bg-green-500"} animate-pulse`}></div>
                 <span className="text-xs font-bold uppercase tracking-tight">{receiverName}</span>
              </motion.div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Transfer Amount (₦)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-2xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all appearance-none" 
              placeholder="0.00" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Narration (Optional)</label>
            <input 
              type="text" 
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-orange-500 transition-all font-medium" 
              placeholder="What's this for?" 
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading || !receiverName || !amount}
            className={`w-full py-5 text-white font-bold text-lg rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 ${isLoading || !receiverName || !amount || receiverName === "Could not verify name" ? 'bg-slate-300' : 'bg-slate-900 active:scale-95'}`}
          >
            {isLoading ? "Executing SQL..." : "Execute Atomic Transfer"}
            <ArrowRight size={20} className="text-orange-500" />
          </button>
        </form>

        <AnimatePresence>
          {status && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`mt-6 p-5 rounded-2xl text-center text-sm font-bold border-2 ${status.success ? 'bg-green-50 border-green-500/20 text-green-700' : 'bg-red-50 border-red-500/20 text-red-700'}`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl">{status.success ? 'check_circle' : 'error'}</span>
                {status.message}
                <button 
                  onClick={() => setStatus(null)}
                  className="mt-2 text-[10px] uppercase underline tracking-widest opacity-60 hover:opacity-100"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Beneficiaries</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar scroll-smooth">
          {[
            { name: "John D.", initial: "JD", color: "bg-slate-900 text-orange-500" },
            { name: "Alice S.", initial: "AS", color: "bg-slate-200 text-slate-700" },
            { name: "Robert K.", initial: "RK", color: "bg-orange-500 text-white" },
          ].map((ben) => (
            <button key={ben.name} className="flex-shrink-0 flex flex-col items-center gap-2 group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xs shadow-sm transition-transform group-hover:scale-110 ${ben.color}`}>
                {ben.initial}
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{ben.name}</span>
            </button>
          ))}
          <button className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border-2 border-dashed border-slate-200 text-slate-400 hover:border-orange-500 hover:text-orange-500 transition-colors">
              <Plus size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Add</span>
          </button>
        </div>
      </section>
    </div>
  );
};
