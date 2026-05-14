import React from "react";
import { motion } from "motion/react";
import { useBank } from "../context/BankContext";
import { Eye, Wallet, Plus, TrendingDown, TrendingUp } from "lucide-react";

export const Dashboard: React.FC = () => {
  const { userProfile, accountBalance, recentTransactions } = useBank();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <section>
        <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-orange-200">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-1">Total Balance</p>
              <h2 className="text-4xl font-bold italic">₦ {accountBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
            </div>
            <div className="flex gap-12 font-mono text-sm opacity-80">
              <div>
                <p className="text-[10px] uppercase mb-1 tracking-widest font-bold">Income</p>
                ₦ 840,000.00
              </div>
              <div>
                <p className="text-[10px] uppercase mb-1 tracking-widest font-bold">Expense</p>
                ₦ 120,400.00
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        </div>
      </section>

      <section className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          Quick Services
        </h3>
        <div className="grid grid-cols-4 gap-y-6 gap-x-4">
          {[
            { id: 'transfer', label: 'Transfer', icon: 'sync_alt' },
            { id: 'airtime', label: 'Airtime', icon: 'phone_android' },
            { id: 'data', label: 'Data', icon: 'network_check' },
            { id: 'bills', label: 'Bills', icon: 'receipt_long' },
            { id: 'qr', label: 'QR Pay', icon: 'qr_code_scanner' },
            { id: 'loans', label: 'Loans', icon: 'payments' },
            { id: 'bet', label: 'Bet', icon: 'sports_soccer' },
            { id: 'insurance', label: 'Insurance', icon: 'security' },
          ].map((service) => (
            <div key={service.id} className="flex flex-col items-center gap-2">
              <button className="w-14 h-14 bg-slate-50 rounded-xl shadow-sm flex items-center justify-center text-slate-700 border border-slate-200 hover:border-orange-500 hover:text-orange-500 active:scale-90 transition-all">
                <span className="material-symbols-outlined text-[28px]">{service.icon}</span>
              </button>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">{service.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-[2rem] border border-slate-200 p-6 flex flex-col shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800">Recent Transactions</h3>
          <button className="text-orange-600 text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {recentTransactions.slice(0, 4).map((tx) => {
            const isDebit = tx.transaction_type !== 'DEPOSIT';
            return (
              <motion.div 
                key={tx.id}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between p-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${isDebit ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} rounded-full flex items-center justify-center font-bold text-lg`}>
                    {isDebit ? '-' : '+'}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800 uppercase tracking-tight">{tx.narration}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(tx.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <p className={`font-bold text-sm ${isDebit ? 'text-slate-800' : 'text-green-600'}`}>
                  {isDebit ? '- ' : '+ '}₦ {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <div className="fixed right-6 bottom-24 md:bottom-8 z-40">
        <button className="w-14 h-14 bg-slate-900 text-orange-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-slate-700">
          <Plus size={32} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};
