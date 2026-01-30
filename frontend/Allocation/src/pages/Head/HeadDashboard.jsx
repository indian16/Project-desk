// src/pages/head/HeadDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import SideMenu from "../../components/SideMenu";
import Uploads from "./Uploads";
import Documents from "./Documents";
import HeadMessage from "./HeadMessage";
import Form3 from "./Form3";
import { Settings, Trash2 } from "lucide-react";
import {
  getAvailableYears,
  getAllProjectsCount,
  getUpcomingInterview,
  getNewProjectIdeaCount,
  getTotalProjects,
  getTotalForms,
  getTotalSRS,
  getTotalMentors,
  getTotalTeams,
  getChecklistItems,
  getChecklistMetrics,
  getChecklistFilters,
} from "../../services/headService";
import PendingIdeas from "./ReviewProjects/PendingIdeas";
import ReviewedIdeas from "./ReviewProjects/ReviewedIdeas";
import ScheduleInterview from "./ReviewProjects/ScheduleInterview";
import InterviewStatus from "./ReviewProjects/InterviewStatus";
import Projectsdata from "./Projectsdata";
import Navbar from "../../components/Navbar";
import {
  Filter,
  BarChart3,
  Calendar,
  MapPin,
  ChevronRight,
  Zap,
  Users,
  Cpu,
  UserCircle2,
  Plus, // Add this
  ExternalLink,
  Sun,
  CloudSun,
  Moon,
  Clock,
  Sparkles,
  Activity,
  Waves,
} from "lucide-react";
// ==================== BEAUTIFUL MODERN GREETING CARD ====================
const GreetingCard = () => {
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();

      if (hour >= 5 && hour < 12) setGreeting("Good Morning 🌅");
      else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon ☀");
      else if (hour >= 17 && hour < 20) setGreeting("Good Evening 🌆");
      else setGreeting("Good Night 🌙");

      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
      relative w-full p-6 mb-6 rounded-2xl 
      bg-gradient-to-r from-indigo-600 to-blue-500 
      shadow-xl overflow-hidden 
      text-white 
      transition-all duration-300 
      hover:scale-[1.01] hover:shadow-2xl
    "
    >
      {/* Glow circle */}
      <div className="absolute w-44 h-44 bg-white/20 rounded-full blur-3xl top-[-20px] right-[-20px] opacity-40"></div>

      {/* Shine overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-30"></div>

      <div className="relative z-10 flex justify-between items-center">
        {/* Left text */}
        <div>
          <h2 className="text-2xl font-bold drop-shadow-sm">
            {greeting}, Head!
          </h2>
          <p className="text-white/80 text-sm mt-1">
            Hope you're having a productive day.
          </p>
        </div>

        {/* Time + animated icon */}
        <div className="flex flex-col items-end">
          <div className="text-3xl font-semibold tracking-wide">{time}</div>
          <div className="mt-2 text-3xl animate-bounce">⏰</div>
        </div>
      </div>
    </div>
  );
};

const CardSettingsPanel = ({
  card,
  metricOptions,
  dynamicMetrics = [],
  filters,
  setFilters,
  filterOptions,
  onClose,
  onSave,
  onDelete,
}) => {
  const [tempCard, setTempCard] = useState({ ...card });
  const [showFilters, setShowFilters] = useState(false);
  const selectStyle =
    "w-full p-3 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer text-slate-700 font-medium shadow-sm hover:border-slate-300";

  const allMetrics = [
    ...metricOptions,
    ...dynamicMetrics.map((m) => ({ key: m._id, label: m.title })),
  ];

  return (
    <div className="absolute inset-0 bg-white flex flex-col animate-in slide-in-from-top-2 duration-300 rounded-2xl ">
      {/* HEADER - Stays fixed */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h3 className="font-bold text-[10px] uppercase tracking-widest text-indigo-600">
          Card Settings
        </h3>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
            showFilters
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          <Filter size={12} />
          {showFilters ? ".." : "."}
        </button>
      </div>

      {/* BODY - This part scrolls */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
              Card Size
            </label>
            <select
              className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
              value={tempCard.size}
              onChange={(e) =>
                setTempCard({ ...tempCard, size: e.target.value })
              }
            >
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
              Active Metric
            </label>
            <select
              className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
              value={tempCard.metric}
              onChange={(e) =>
                setTempCard({ ...tempCard, metric: e.target.value })
              }
            >
              {allMetrics.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="space-y-3 pt-4 border-t border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Filter
              </span>
              <button
                onClick={() =>
                  setFilters({ branch: "", section: "", group: "" })
                }
                className="text-[9px] font-bold text-indigo-500 hover:underline"
              >
                RESET
              </button>
            </div>

            <select
              className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg"
              value={filters.branch}
              onChange={(e) =>
                setFilters({ branch: e.target.value, section: "", group: "" })
              }
            >
              <option value="">All Branches</option>
              {filterOptions.branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg disabled:opacity-50"
              value={filters.section}
              disabled={!filters.branch}
              onChange={(e) =>
                setFilters({ ...filters, section: e.target.value, group: "" })
              }
            >
              <option value="">All Sections</option>
              {filterOptions.sections.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg disabled:opacity-50"
              value={filters.group}
              disabled={!filters.branch || !filters.section}
              onChange={(e) =>
                setFilters({ ...filters, group: e.target.value })
              }
            >
              <option value="">All Groups</option>
              {filterOptions.groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* FOOTER - Stays fixed */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-2xl">
        <button
          onClick={() => onDelete(tempCard.id)}
          className="flex items-center gap-1 text-[10px] font-bold text-red-400 hover:text-red-600 transition"
        >
          <Trash2 size={14} /> DELETE
        </button>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600"
          >
            CANCEL
          </button>
          <button
            onClick={() => onSave(tempCard)}
            className="px-5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-md active:scale-95 transition-all"
          >
            APPLY
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

const HeadDashboard = () => {
  const [section, setSection] = useState("dashboard");
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [subTab, setSubTab] = useState("pending");
  const [counts, setCounts] = useState({
    total: 0,
    ideaCount: 0,
    assignedCount: 0,
  });
  const [upcomingInterview, setUpcomingInterview] = useState(null);
  const [newIdeasCount, setNewIdeasCount] = useState(0);
  const [showInterview, setShowInterview] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const headId = storedUser?.id;
  const [cards, setCards] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const headId = storedUser?.id;

    if (!headId) return [];

    const saved = localStorage.getItem(`head-dashboard-cards-${headId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [metrics, setMetrics] = useState({});
  const [expandedCardId, setExpandedCardId] = useState(null);

  const cardRefs = useRef({});
  const [filterOptions, setFilterOptions] = useState({
    branches: [],
    sections: [],
    groups: [],
  });
  const [filters, setFilters] = useState({
    branch: "",
    section: "",
    group: "",
  });
  const [dynamicMetrics, setDynamicMetrics] = useState([]);

  const metricOptions = [
    {
      key: "totalProjects",
      label: "Total Projects",
      fetch: getTotalProjects,
    },
    { key: "totalForms", label: "Total Forms", fetch: getTotalForms },
    { key: "totalSRS", label: "Total SRS", fetch: getTotalSRS },
    { key: "totalMentors", label: "Total Mentors", fetch: getTotalMentors },
    { key: "totalTeams", label: "Total Teams", fetch: getTotalTeams },
    {
      key: "checklistCounts",
      label: "Checklist Uploads",
      fetch: getChecklistMetrics,
    },
  ];

  const [completion, setCompletion] = useState({ form1: 0, form2: 0 });

  const [theme, setTheme] = useState(
    localStorage.getItem("head-theme") || "calm",
  );

  useEffect(() => {
    const syncTheme = () =>
      setTheme(localStorage.getItem("head-theme") || "calm");

    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, []);
  const dashboardThemes = {
    // Speciality: Indigo-Calm. Deep focus with smooth transitions.
    calm: "bg-[radial-gradient(at_top_left,_#e0e7ff,_#f8fafc,_#dbeafe)] animate-gradient-slow",

    // Speciality: Pure Minimalist. Uses a "Mesh" of soft greys and whites.
    light: "bg-[conic-gradient(at_top,_#ffffff,_#f1f5f9,_#ffffff)]",

    // Speciality: Professional Depth. Indigo base with Cyan and Slate accents.
    academic:
      "bg-[gradient-to-tr,_#eef2ff,_#e0f2fe,_#f5f3ff] animate-pulse-subtle",

    // Speciality: Energy Boost. A mix of Peach, Rose, and Soft Gold.
    warm: "bg-[radial-gradient(circle_at_0%_0%,_#fff1f2_0%,_#fff7ed_50%,_#fdf2f8_100%)]",

    // Speciality: Deep Space. Not just black, but deep Navy to Charcoal.
    dark: "bg-[radial-gradient(at_top_right,_#1e293b,_#0f172a,_#020617)] text-slate-100",
  };

  useEffect(() => {
    if (!headId) return;

    localStorage.setItem(
      `head-dashboard-cards-${headId}`,
      JSON.stringify(cards),
    );
  }, [cards, headId]);

  useEffect(() => {
    const fetchFilters = async () => {
      const res = await getChecklistFilters();
      setFilterOptions(res.data);
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchProjectCompletion = async () => {
      try {
        const res = await getProjectCompletion();

        setCompletion({
          form1: res.form1 || 0,
          form2: res.form2 || 0,
        });
      } catch (err) {
        console.error("Error fetching project completion:", err);
        setCompletion({ form1: 0, form2: 0 });
      }
    };

    fetchProjectCompletion();
  }, []);

  useEffect(() => {
    const fetchChecklistMetrics = async () => {
      const res = await getChecklistMetrics(filters);
      setDynamicMetrics(res.data);
    };
    fetchChecklistMetrics();
  }, [filters]);

  useEffect(() => {
    const loadMetrics = async () => {
      const results = {};
      for (const metric of metricOptions) {
        try {
          const res = await metric.fetch(filters);
          results[metric.key] = res.data?.total || res.data?.count || 0;
        } catch {
          results[metric.key] = "—";
        }
      }
      setMetrics(results);
    };

    loadMetrics();
  }, [filters]);
  const addCard = () => {
    setCards([
      ...cards,
      { id: Date.now(), size: "S", metric: "totalProjects" },
    ]);
  };

  const handleUpdateCard = (updatedCard) => {
    setCards(cards.map((c) => (c.id === updatedCard.id ? updatedCard : c)));
    setExpandedCardId(null);
  };

  const handleDeleteCard = (id) => {
    setCards(cards.filter((c) => c.id !== id));
    setExpandedCardId(null);
  };

  useEffect(() => {
    const loadUpcomingInterview = async () => {
      try {
        const data = await getUpcomingInterview();
        setUpcomingInterview(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadUpcomingInterview();
  }, []);
  useEffect(() => {
    const fetchIdeaCount = async () => {
      try {
        const data = await getNewProjectIdeaCount();
        setNewIdeasCount(data.newIdeaCount ?? 0); // Use correct key and fallback
      } catch (err) {
        console.error("Error loading new ideas count:", err);
        setNewIdeasCount(0); // fallback
      }
    };
    fetchIdeaCount();
  }, []);
  // Fetch available years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const data = await getAvailableYears();
        const yearList = data.map((y) => (typeof y === "string" ? y : y.year));
        setYears(yearList);
        if (yearList.length > 0) setSelectedYear(yearList[0]);
      } catch (err) {
        console.error("Error fetching years:", err);
      }
    };
    fetchYears();
  }, []);

  // Fetch project counts
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const data = await getAllProjectsCount();
        setCounts(data);
      } catch (err) {
        console.error("Error loading project counts:", err);
      }
    };
    loadCounts();
  }, []);

  return (
    <div
      className={`flex flex-col h-screen w-full overflow-hidden bg-[#fcfdfe] ${dashboardThemes[theme]}`}
    >
      {/* Left Sidebar */}
      <Navbar />
      {/* Right Section (Navbar + Content) */}
      <div className="flex flex-1 overflow-hidden">
        {/* TOP NAVBAR */}

        <SideMenu activeMenu={section} setSection={setSection} />

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc]">
          {/* Academic Year Selector */}
          {/* <div className="mb-6 flex items-center gap-4">
          <label className="font-medium">Select Academic Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border p-2 rounded"
          >
            {years.map((y, index) => (
              <option key={index} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div> */}

          {/* ======================= DASHBOARD ======================= */}
          {section === "dashboard" && (
            <div className="max-w-[2000px] mx-auto p-2.5 space-y-8 bg-[#f8fafc]">
              {/* 1. Header Area */}
              <GreetingCard />

              {/* 2. Top Action Bar & Metrics */}
              <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Cards Section
                  </h3>
                  <button
                    onClick={addCard}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-100"
                  >
                    <Plus size={14} />
                    Add Card
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {cards.map((card) => {
                    // --- Logic Kept Exactly as Provided ---
                    let displayValue = 0;
                    if (metrics.hasOwnProperty(card.metric)) {
                      displayValue = metrics[card.metric];
                    } else {
                      const dynamic = dynamicMetrics.find(
                        (m) => m._id === card.metric,
                      );
                      displayValue = dynamic?.uploadedCount ?? 0;
                    }
                    const metricTitle =
                      metricOptions.find((m) => m.key === card.metric)?.label ||
                      dynamicMetrics.find((m) => m._id === card.metric)
                        ?.title ||
                      "Metric";

                    return (
                      <div
                        key={card.id}
                        ref={cardRefs.current[card.id]}
                        className={`relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition-all duration-300 w-100
    ${expandedCardId === card.id ? "ring-2 ring-indigo-500 h-80" : "hover:border-slate-300"}
    ${!expandedCardId && (card.size === "S" ? "h-36" : card.size === "M" ? "h-44" : "h-52")}
  `}
                      >
                        {/* Settings Button */}
                        <button
                          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-md transition-colors"
                          onClick={() =>
                            setExpandedCardId(
                              expandedCardId === card.id ? null : card.id,
                            )
                          }
                        >
                          <Settings size={18} />
                        </button>

                        {/* Title at the top */}
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                          {metricTitle}
                        </p>

                        {/* Number centered vertically */}
                        <div className="flex flex-1 items-center justify-center">
                          <p className="text-5xl font-black text-black-900 tracking-tight">
                            {displayValue}
                          </p>
                        </div>

                        {/* Expanded Panel stays as-is */}
                        {expandedCardId === card.id && (
                          <div className="mt-4 pt-4 border-t border-slate-100 overflow-y-auto h-[calc(100%-80px)]">
                            <CardSettingsPanel
                              card={card}
                              metricOptions={metricOptions}
                              dynamicMetrics={dynamicMetrics}
                              filters={filters}
                              setFilters={setFilters}
                              filterOptions={filterOptions}
                              onClose={() => setExpandedCardId(null)}
                              onSave={handleUpdateCard}
                              onDelete={() => handleDeleteCard(card.id)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 3. Mid Section: Completion & Interview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* ================= LEFT CARD ================= */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-[450px] flex flex-col">
                  {/* HEADER + SWAP BUTTON */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Calendar size={18} />
                      </div>
                      <h2 className="text-sm font-bold text-slate-800">
                        {showInterview ? "Scheduled Interview" : "Messages"}
                      </h2>
                    </div>

                    <button
                      onClick={() => setShowInterview(!showInterview)}
                      className="text-[11px] font-bold px-4 py-1.5 rounded-lg border border-slate-200
                 text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition"
                    >
                      {showInterview ? "View Messages" : "View Interview"}
                    </button>
                  </div>

                  {/* ================= CARD BODY (ONLY THIS SWAPS) ================= */}
                  <div className="flex-1 overflow-hidden">
                    {showInterview ? (
                      !upcomingInterview ? (
                        <div className="flex items-center justify-center h-full bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            No Sessions Found
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col md:flex-row gap-8 h-full">
                          {/* LEFT: INTERVIEW DETAILS */}
                          <div className="md:w-48 space-y-5 border-l border-slate-100 pl-4">
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                Date
                              </p>
                              <p className="text-sm font-bold text-slate-700">
                                {new Date(
                                  upcomingInterview.date,
                                ).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>

                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                Time
                              </p>
                              <p className="text-sm font-bold text-slate-700">
                                {upcomingInterview.time}
                              </p>
                            </div>

                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                Location
                              </p>
                              <p className="text-sm font-bold text-slate-700 truncate">
                                {upcomingInterview.location}
                              </p>
                            </div>
                          </div>

                          {/* RIGHT: PROJECT INFO */}
                          <div className="flex-1 bg-slate-50 rounded-xl p-5 border border-slate-100">
                            <div className="flex justify-between mb-4">
                              <span className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black uppercase rounded">
                                Project Description
                              </span>
                              <ExternalLink
                                size={14}
                                className="text-slate-300"
                              />
                            </div>

                            <h4 className="text-lg font-black text-slate-900 uppercase mb-1">
                              {upcomingInterview.idea?.title ||
                                "Untitled Project"}
                            </h4>

                            <p className="text-xs font-bold text-indigo-600 uppercase mb-4">
                              {upcomingInterview.idea?.technology || "N/A"}
                            </p>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/60">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">
                                  {upcomingInterview.idea?.teamLead?.name?.charAt(
                                    0,
                                  ) || "L"}
                                </div>
                                <p className="text-xs font-bold text-slate-600">
                                  Lead:{" "}
                                  {upcomingInterview.idea?.teamLead?.name ||
                                    "N/A"}
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <Users size={14} className="text-slate-400" />
                                <p className="text-xs font-bold text-slate-600">
                                  {upcomingInterview.idea?.teamMembers
                                    ?.length || 0}{" "}
                                  Members
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="h-full">
                        <HeadMessage />
                      </div>
                    )}
                  </div>
                </div>

                {/* ================= RIGHT CARD (FIXED CONTAINER) ================= */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm max-h-[450px]">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-900 text-white rounded-xl">
                      <Zap size={18} fill="currentColor" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Immediate Actions
                      </h3>
                      <p className="text-xs font-medium text-slate-500">
                        You have{" "}
                        <span className="text-indigo-600 font-bold">
                          {newIdeasCount} pending
                        </span>{" "}
                        reviews to complete.
                      </p>
                    </div>
                  </div>
                  <button className="px-6 py-2.5 bg-slate-900 text-white text-xs font-black rounded-lg hover:bg-black transition-all flex items-center gap-2">
                    View Pipeline <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* 4. Action Footer */}
            </div>
          )}

          {/* ======================= OTHER SECTIONS ======================= */}
          {section === "uploads" && <Uploads />}
          {section === "messages" && <HeadMessage />}
          {section === "form3" && <Form3 />}

          {section === "projects" && <Projectsdata />}
          {section === "documents" && <Documents />}
          {section === "CheckList" && <Checklist />}

          {section === "reviewProjects" && (
            /* Removed p-8/p-10 and added a negative margin-top (mt-[-2rem]) to pull the whole UI up */
            <div className="w-full px-6 lg:px-10 mt-[-1.2rem] min-h-screen font-sans relative z-20">
              {/* Navigation Container - Pulled even closer to the top */}
              <div className="flex justify-end pr-0 items-end mb-[-1px]">
                <div className="flex bg-slate-200/40 p-1.5 rounded-t-[1.5rem] border-t border-l border-r border-slate-200/60 backdrop-blur-sm">
                  {[
                    { id: "pending", label: "Pending Ideas" },
                    { id: "reviewed", label: "Reviewed" },
                    { id: "interview", label: "Schedule" },
                    { id: "interviewstatus", label: "Status" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSubTab(tab.id)}
                      className={`relative px-5 py-2 text-xs lg:text-sm font-bold transition-all duration-500 rounded-t-[1.2rem] flex items-center gap-2 group ${
                        subTab === tab.id
                          ? "bg-white text-indigo-600 z-20 shadow-[0_-8px_20px_rgba(0,0,0,0.02)]"
                          : "text-slate-400 hover:text-slate-600 z-10"
                      }`}
                    >
                      <span
                        className={`transition-all duration-500 rounded-full bg-indigo-500 ${
                          subTab === tab.id
                            ? "w-1.5 h-1.5 opacity-100"
                            : "w-0 h-0 opacity-0"
                        }`}
                      ></span>

                      <span className="tracking-wide">{tab.label}</span>

                      {/* Connection Bridge */}
                      {subTab === tab.id && (
                        <div className="absolute -bottom-[2px] left-0 w-full h-[5px] bg-white z-30" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* The Main Card */}
              <div className="bg-white rounded-tr-none rounded-tl-[2rem] rounded-b-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-200/60 relative z-10 overflow-hidden">
                {/* Header Section */}
                <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                  <div className="space-y-0.5">
                    <h2 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight">
                      {subTab === "pending" && "Project Proposals"}
                      {subTab === "reviewed" && "Technical Review"}
                      {subTab === "interview" && "Interview Board"}
                      {subTab === "interviewstatus" && "Admission Status"}
                    </h2>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                        Academic Session {selectedYear}
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:block px-4 py-1.5 bg-indigo-50/50 rounded-full border border-indigo-100/50">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                      Workspace
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 lg:p-10 min-h-[700px]">
                  <div
                    key={subTab}
                    className="animate-in fade-in slide-in-from-top-2 duration-500 ease-out"
                  >
                    {subTab === "pending" && (
                      <PendingIdeas academicYear={selectedYear} />
                    )}
                    {subTab === "reviewed" && (
                      <ReviewedIdeas academicYear={selectedYear} />
                    )}
                    {subTab === "interview" && (
                      <ScheduleInterview academicYear={selectedYear} />
                    )}
                    {subTab === "interviewstatus" && (
                      <InterviewStatus academicYear={selectedYear} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeadDashboard;
