import React from "react";
import { motion } from "motion/react";
import { Search, Lightbulb, Tv, Wifi, MoreHorizontal, Droplets, Zap, Share2, ChevronRight } from "lucide-react";

export const PaymentsScreen: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <section className="mb-8">
        <div className="relative w-full h-48 rounded-[2rem] overflow-hidden flex items-center p-8 bg-slate-900 shadow-xl border border-slate-800">
          <div className="z-10 w-2/3">
            <h2 className="text-3xl font-bold text-white mb-2 leading-tight italic">Simplify your bills</h2>
            <p className="text-slate-400 text-sm">Pay for utilities, data, and subscriptions in seconds with one click.</p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 bg-gradient-to-l from-orange-500 to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 opacity-10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </div>
        
        <div className="relative mt-8 group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search size={20} className="text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search for a biller..."
            className="w-full h-14 pl-14 pr-5 bg-white border border-slate-200 rounded-[1.25rem] text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-sm transition-all outline-none"
          />
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Utilities", icon: Lightbulb, color: "text-orange-500" },
          { label: "Cable TV", icon: Tv, color: "text-orange-500" },
          { label: "Internet", icon: Wifi, color: "text-orange-500" },
          { label: "More", icon: MoreHorizontal, color: "text-slate-500" },
        ].map((item) => (
          <div key={item.label} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md hover:border-orange-500/30 transition-all active:scale-95 group">
            <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-slate-900 transition-colors`}>
              <item.icon size={26} className={`${item.color} group-hover:text-orange-500 transition-colors`} />
            </div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">{item.label}</span>
          </div>
        ))}
      </section>

      <section className="space-y-4 pt-6">
        <div className="flex justify-between items-end mb-2 px-1">
          <h3 className="text-xl font-bold text-slate-800">Quick Payments</h3>
          <button className="text-orange-500 text-[10px] font-bold uppercase tracking-widest hover:underline">View All</button>
        </div>
        
        <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-slate-200">
          {[
            { name: "Water Board Corp", sub: "Account: 0045938221", icon: Droplets, status: "Due Today", val: "₦ 15,000.00", statusColor: "text-red-500" },
            { name: "ElectroGrid Power", sub: "Meter: 9944-SH-01", icon: Zap, status: "Scheduled", val: "Oct 24", statusColor: "text-slate-900" },
            { name: "HyperFiber Net", sub: "User: access_user_44", icon: Share2, status: "Paid", val: "Oct 12", statusColor: "text-green-600" },
          ].map((bill, i) => (
            <div key={bill.name} className={`flex items-center p-5 hover:bg-slate-50 transition-colors cursor-pointer group active:scale-[0.99] ${i < 2 ? 'border-b border-slate-100' : ''}`}>
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mr-5 shadow-sm">
                <bill.icon size={20} className="text-orange-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{bill.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{bill.sub}</p>
              </div>
              <div className="text-right mr-5">
                <span className={`block text-xs font-bold ${bill.statusColor}`}>{bill.status}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{bill.val}</span>
              </div>
              <ChevronRight size={18} className="text-slate-200 group-hover:text-orange-500 transition-colors" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 pb-12">
        <div className="bg-orange-500 rounded-[2rem] p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-white/20">
          <div className="z-10 text-center md:text-left">
            <h3 className="text-3xl font-bold text-slate-900 mb-2 leading-tight italic">Automate Life</h3>
            <p className="text-slate-900/70 text-sm max-w-sm mb-8 font-medium">Never miss a due date again. Set up recurring payments for all your utility bills with zero transactional fees.</p>
            <button className="bg-slate-900 text-white px-10 py-4 rounded-xl text-xs font-bold shadow-2xl hover:-translate-y-1 transition-all uppercase tracking-widest border border-slate-700">Get Started</button>
          </div>
          <div className="relative w-40 h-40 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 z-10 shrink-0 rotate-3">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhzklAjdkbKpHLmX_23oH6j_7hvof1Tgwx6sD3TgKV1WdyO0rRxVFTLWquLlwxZMaR88xpFJk5cSf0SydetkvpvNRF-5Rfi8wHhwdcLAOGpb5Y0OmWzbWWrk0EvtxFmYdBZrjxH4kJn1hPH_aOlIlU0xzP6Y4yJbz0irQkV94-8FIASeTOe4GSCE0cZc5-mxd5YWwHtGpH3iabNzplP1JdegL-M4J0M0fnv3AhYdOaXuFp4bQ7vLY5ydWOStMwymUBbeTF6x2c7_I" />
          </div>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0l30 30-30 30L0 30z\' fill=\'%230f172a\' /%3E%3C/svg%3E")' }}></div>
        </div>
      </section>
    </div>
  );
};
