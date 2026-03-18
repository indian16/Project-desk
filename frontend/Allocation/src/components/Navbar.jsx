import React from "react";
import { 
  Bell, 
  HelpCircle, 
  User, 
  LogOut, 
  LayoutGrid, 
  ChevronRight, 
  Menu, 
  X 
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Navbar = ({
  activeSection,
  toggleSidebar,
  isSidebarOpen,
  selectedYear,
  onYearChange,
  years
}) => {
  const { user, logout } = useAuth();

  const formatTitle = (text) => {
    if (!text) return "Dashboard";
    return text
      .replace(/([A-Z])/g, " $1")
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <nav className="h-16 w-full bg-white border-b border-slate-200/60 shadow-sm shadow-slate-200/50 sticky top-0 z-50 px-4 sm:px-6 flex items-center justify-between">
      
      {/* Left Side: Mobile Menu + Brand + Breadcrumbs + Year Selector */}
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Toggle */}
        <button 
          onClick={toggleSidebar} 
          className="lg:hidden p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Brand */}
        <h1 className="text-xl font-black text-slate-900 tracking-tighter">
          Project<span className="text-indigo-600"> Desk</span>
        </h1>

        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-slate-400">
          <LayoutGrid size={16} />
          <ChevronRight size={14} />
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            {formatTitle(activeSection)}
          </span>
        </div>

        {/* Academic Year Selector */}
        {years?.length > 0 && (
  <>
    {/* Desktop version: inline label + select */}
    <div className="ml-4 hidden sm:flex items-center gap-2">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        Academic Year:
      </span>
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
        className="border border-slate-300 text-sm text-slate-700 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
      >
        {years.map((y, idx) => (
          <option key={idx} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>

    {/* Mobile version: stacked label + select */}
    <div className="flex sm:hidden flex-col ml-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
        Year
      </label>
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
        className="border border-slate-300 text-sm text-slate-700 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
      >
        {years.map((y, idx) => (
          <option key={idx} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  </>
)}
      </div>

      {/* Right Side: Icons & User */}
      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
          <HelpCircle size={20} />
        </button>

        <button className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
        </button>

        <div className="h-8 w-[1px] bg-slate-200 mx-2" />

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 leading-none">
              {user?.name}
            </p>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter mt-1">
              {user?.role}
            </p>
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