import React from "react";
import { 
  Bell, 
  Search, 
  Command, 
  HelpCircle, 
  User, 
  ChevronRight,
  LayoutGrid,
  LogOut
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Navbar = ({ activeSection }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="h-16 w-full bg-white border-b border-slate-200/60 shadow-sm shadow-slate-200/50 sticky top-0 z-50 px-6 flex items-center justify-between">
      
      {/* Left Side: Brand & Breadcrumbs */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black text-slate-900 tracking-tighter">
            Project<span className="text-indigo-600"> Desk</span>
          </h1>
        </div>
        
        <div className="h-6 w-[1px] bg-slate-200" /> {/* Divider */}

        <div className="flex items-center gap-2 text-slate-400">
          <LayoutGrid size={16} />
          <ChevronRight size={14} />
          <span className="text-sm font-bold text-slate-900 capitalize tracking-tight">
            {activeSection || "Dashboard"}
          </span>
        </div>
      </div>

      {/* Middle: Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-10">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" size={16} />
          <input 
            type="text" 
            placeholder="Search projects, files, or teammates..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">
            <Command size={10} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400">K</span>
          </div>
        </div>
      </div>

      {/* Right Side: Actions & Profile */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
          <HelpCircle size={20} />
        </button>

        <button className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
        </button>

        <div className="h-8 w-[1px] bg-slate-200 mx-2" />

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 leading-none">{user?.name}</p>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter mt-1">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white border-2 border-white shadow-md group-hover:scale-105 transition-transform">
            <User size={18} />
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={logout} 
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
