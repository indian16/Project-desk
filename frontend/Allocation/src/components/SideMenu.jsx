// frontend/Allocation/src/components/SideMenu.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Upload,
  BookOpen,
  FileSpreadsheet,
  LogOut,
  ClipboardList,
  Settings,
  
  ChevronRight,
} from "lucide-react";

const SideMenu = ({ activeMenu, setSection }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const MenuItem = ({ icon: Icon, label, sectionName }) => {
    const isActive = activeMenu === sectionName;
    return (
      <button
        onClick={() => setSection(sectionName)}
        className={`group flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all duration-300 group ${
          isActive
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <div className="flex items-center">
          <Icon
            className={`w-5 h-5 mr-3 transition-colors ${
              isActive
                ? "text-white"
                : "text-slate-400 group-hover:text-indigo-600"
            }`}
          />
          <span
            className={`text-[13px] font-bold tracking-tight ${
              isActive ? "font-black" : ""
            }`}
          >
            {label}
          </span>
        </div>
        {isActive && <ChevronRight size={14} className="opacity-50" />}
      </button>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200/60 h-full flex flex-col z-40">
      {/* 1. Brand Header - More Professional */}
      {/* 1. Brand Identity - Simplified for Navbar Sync */}

      <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
        {/* 2. User Card - Redesigned as a 'Profile' Section */}

        {/* 3. Navigation Groups */}
        <nav className="space-y-6 top-3">
          <div>
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              Main Menu
            </p>
            <div className="space-y-1">
              {user?.role === "head" && (
                <>
                  <MenuItem
                    icon={LayoutDashboard}
                    label="Dashboard"
                    sectionName="dashboard"
                  />
                  <MenuItem
                    icon={ClipboardList}
                    label="Review Projects"
                    sectionName="reviewProjects"
                  />
                  <MenuItem
                    icon={Upload}
                    label="Uploads"
                    sectionName="uploads"
                  />
                  <MenuItem
                    icon={MessageSquare}
                    label="Messages"
                    sectionName="messages"
                  />
                  <MenuItem
                    icon={FileText}
                    label="Documents"
                    sectionName="documents"
                  />
                  <MenuItem
                    icon={Settings}
                    label="Projects"
                    sectionName="projects"
                  />
                  <hr className="my-2 border-gray-200" />
                  <MenuItem
                    icon={FileSpreadsheet}
                    label="Form 3"
                    sectionName="form3"
                  />
                  <MenuItem
                    icon={Settings}
                    label="Settings"
                    sectionName="HeadSettings"
                  />
                </>
              )}

              {user?.role === "student" && (
                <>
                  <MenuItem
                    icon={LayoutDashboard}
                    label="My Project"
                    sectionName="dashboard"
                  />
                  <MenuItem
                    icon={BookOpen}
                    label="Project Idea"
                    sectionName="projectIdea"
                  />
                  <MenuItem
                    icon={ClipboardList}
                    label="Project Bank"
                    sectionName="projectBank"
                  />
                  <MenuItem
                    icon={Users}
                    label="Mentor List"
                    sectionName="mentorList"
                  />
                  <MenuItem
                    icon={FileText}
                    label="Documentation"
                    sectionName="documentation"
                  />
                   <MenuItem
                    icon={FileSpreadsheet}
                    label="Messages"
                    sectionName="messages"
                  />
                  <hr className="my-2 border-gray-200" />
                  
                  <MenuItem
                    icon={FileSpreadsheet}
                    label="Form 1 (Team lead)"
                    sectionName="form1"
                  />
                  <MenuItem
                    icon={FileSpreadsheet}
                    label="Form 2 (Student)"
                    sectionName="form2"
                  />
                  <MenuItem
                    icon={FileSpreadsheet}
                    label="Form 3"
                    sectionName="form3"
                  />
                 
                </>
              )}

              {user?.role === "mentor" && (
                <>
                  <MenuItem
                    icon={LayoutDashboard}
                    label="Dashboard"
                    sectionName="dashboard"
                  />
                  <MenuItem
                    icon={BookOpen}
                    label="Project Ideas"
                    sectionName="mentorIdeaProjects"
                  />
                  <MenuItem
                    icon={ClipboardList}
                    label="Project Bank"
                    sectionName="mentorBankProjects"
                  />
                  <MenuItem
                    icon={MessageSquare}
                    label="Messages"
                    sectionName="messages"
                  />
                  <MenuItem
                    icon={FileText}
                    label="Documents"
                    sectionName="documents"
                  />
                  <hr className="my-2 border-gray-200" />
                  <MenuItem
                    icon={FileSpreadsheet}
                    label="Form 3"
                    sectionName="form3m"
                  />
                </>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* 4. Logout - Minimal & Bottom-Aligned */}
      <div className="p-6 border-t border-slate-50 bg-slate-50/50">
        <button
          onClick={handleLogout}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-300 group shadow-sm"
        >
          <div className="flex items-center">
            <LogOut className="w-4 h-4 mr-3 group-hover:rotate-12 transition-transform" />
            <span className="text-xs">Sign Out</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-red-400" />
        </button>
      </div>
    </aside>
  );
};

export default SideMenu;