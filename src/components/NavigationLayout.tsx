import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ArrowLeftRight, CreditCard, History, MoreHorizontal, Bell, LogOut } from "lucide-react";
import { useBank } from "../context/BankContext";

export const NavigationLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { userProfile } = useBank();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/transfer", label: "Transfers", icon: ArrowLeftRight },
    { path: "/payments", label: "Payments", icon: CreditCard },
    { path: "/history", label: "History", icon: History },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Sidebar - Hidden on Mobile */}
      <nav className="hidden md:flex w-64 bg-slate-900 h-full flex-col p-6 text-white shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-xl">A</div>
          <span className="text-xl font-bold tracking-tight">AccessClone</span>
        </div>
        
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-slate-800 text-orange-500 shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto">
          <div className="p-4 bg-orange-600/10 border border-orange-500/30 rounded-2xl mb-6">
            <p className="text-[10px] text-orange-200 uppercase tracking-widest font-bold mb-1">Auth Mode</p>
            <p className="text-xs font-mono text-white/80 uppercase">SECURE_PIN_V2</p>
          </div>
          
          <button className="flex items-center gap-3 p-3 w-full text-slate-400 hover:text-red-400 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-800">Welcome back, {userProfile?.fullName.split(' ')[0]}</h1>
            <p className="hidden md:block text-sm text-slate-500">Last login: Today, 09:41 AM</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-orange-500 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4 ml-2">
              <div className="hidden md:block text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Diamond Account</p>
                <p className="text-xs font-mono text-slate-700">{userProfile?.accountNumber}</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-orange-500 overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1G4WqmzMhWrLRU7_CN0jJOpc5URahOKU3J6FOH2AMnk_MV8tDgH_qp8wn7Ylud9RWo5mNAIc9fOQMHJ93Cquh9uTB5xMPPvhgWmKNnbqiQ7FkG_xyMwUuM-4BNAuLxQxwwdiYTdxv-eMDkpazImyZgrQqRHANC5uJt4mA45uQehT5bzhLKNum1KAqA0_G_7-jDaeOq0VCVyN1Wu8FJIbtzaHmDNtMwJdKZQ-MxZCy3cLZ06Sm9D9t8IIAGakCvBpM3oMVTX3z4NM" alt="Profile" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto pb-24 md:pb-0">
            {children}
          </div>
        </main>
        
        {/* Mobile Bottom Nav - Only on Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 rounded-t-3xl shadow-2xl z-50">
          <div className="flex justify-around items-center h-20 px-4 text-white">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center transition-all ${isActive ? 'text-orange-500' : 'text-slate-400'}`}
                >
                  <Icon size={24} />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{item.label}</span>
                </Link>
              );
            })}
            <Link 
              to="/more"
              className={`flex flex-col items-center justify-center transition-all ${location.pathname === '/more' ? 'text-orange-500' : 'text-slate-400'}`}
            >
              <MoreHorizontal size={24} />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">More</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};
