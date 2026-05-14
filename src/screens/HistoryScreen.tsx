import React from "react";
import { motion } from "motion/react";
import { useBank } from "../context/BankContext";
import { TrendingDown, TrendingUp, Filter, Search, ChevronRight } from "lucide-react";

export const HistoryScreen: React.FC = () => {
  const { recentTransactions } = useBank();

  // Group transactions by date
  const groupedTransactions: { [key: string]: typeof recentTransactions } = {};
  recentTransactions.forEach(tx => {
    const date = new Date(tx.created_at).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    if (!groupedTransactions[date]) groupedTransactions[date] = [];
    groupedTransactions[date].push(tx);
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-700 pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Transaction History</h1>
        <button className="p-3 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-500 hover:border-orange-500 hover:text-orange-500 active:scale-95 transition-all">
          <Filter size={20} />
        </button>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input 
          type="text" 
          placeholder="Filter by name, date or type..."
          className="w-full h-14 pl-14 pr-5 bg-white border border-slate-200 rounded-2xl text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none shadow-sm transition-all"
        />
      </div>

      <div className="space-y-10">
        {Object.entries(groupedTransactions).map(([date, transactions]) => (
          <div key={date}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">{date}</p>
            <div className="space-y-4">
              {transactions.map((tx) => {
                const isDebit = tx.transaction_type !== 'DEPOSIT';
                return (
                  <motion.div 
                    key={tx.id}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white p-5 rounded-[1.5rem] flex items-center justify-between border border-slate-200 shadow-sm cursor-pointer hover:border-orange-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDebit ? 'bg-slate-900 text-orange-500' : 'bg-green-100 text-green-600'} shadow-sm`}>
                        {isDebit ? <TrendingDown size={22} /> : <TrendingUp size={22} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 uppercase tracking-tight">{tx.receiver_name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          {tx.transaction_type} • {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className={`font-bold text-sm ${isDebit ? 'text-slate-900' : 'text-green-600'}`}>
                          {isDebit ? '- ' : '+ '}₦ {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <p className={`text-[9px] uppercase font-bold text-right ${tx.status === 'COMPLETED' ? 'text-green-500' : 'text-orange-500'}`}>{tx.status}</p>
                      </div>
                      <ChevronRight size={18} className="text-slate-200 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl mt-12 border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 opacity-10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2 italic">Spend Analysis</h3>
            <p className="text-sm text-slate-400 max-w-xs">Your operational overhead decreased by <span className="text-orange-500 font-bold">12%</span> this audit period.</p>
          </div>
          <button className="bg-orange-500 text-slate-900 font-bold px-8 py-3 rounded-xl text-xs shadow-lg active:scale-95 transition-all w-fit uppercase tracking-widest">
            Detailed Insights
          </button>
        </div>
      </div>
    </div>
  );
};
