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
  getNewProjectIdeaCount,
  getTotalProjects,
  getChecklistMetrics,
  getChecklistFilters,
} from "../../services/headService";
import PendingIdeas from "./ReviewProjects/PendingIdeas";
import ReviewedIdeas from "./ReviewProjects/ReviewedIdeas";
import ScheduleInterview from "./ReviewProjects/ScheduleInterview";
import InterviewStatus from "./ReviewProjects/InterviewStatus";
import Projectsdata from "./Projectsdata";
import Navbar from "../../components/Navbar";
import Register from "../auth/Register";
import InterviewSection from "./InterviewSection";
import {
  Filter,
  Zap,
  Plus, // Add this
} from "lucide-react";

import GreetingCard from "./GreetingCard";

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

      <style>
        {`
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }
  `}
      </style>
    </div>
  );
};

const HeadDashboard = () => {
  const [section, setSection] = useState("dashboard");
  const [years, setYears] = useState([]);
  // const [selectedYear, setSelectedYear] = useState("");
  const [subTab, setSubTab] = useState("pending");
  const [counts, setCounts] = useState({
    total: 0,
    ideaCount: 0,
    assignedCount: 0,
  });

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
  const [selectedYear, setSelectedYear] = useState(years[0] || "");

  const metricOptions = [
    {
      key: "totalProjects",
      label: "Total Projects",
      fetch: getTotalProjects,
    },
  ];
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  //const [completion, setCompletion] = useState({ form1: 0, form2: 0 });

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

  // useEffect(() => {
  //   const fetchProjectCompletion = async () => {
  //     try {
  //       const res = await getProjectCompletion();

  //       setCompletion({
  //         form1: res.form1 || 0,
  //         form2: res.form2 || 0,
  //       });
  //     } catch (err) {
  //       console.error("Error fetching project completion:", err);
  //       setCompletion({ form1: 0, form2: 0 });
  //     }
  //   };

  //   fetchProjectCompletion();
  // }, []);

  // useEffect(() => {
  //   const fetchChecklistMetrics = async () => {
  //     const res = await getChecklistMetrics(filters);
  //     setDynamicMetrics(res.data);
  //   };
  //   fetchChecklistMetrics();
  // }, [filters]);

  useEffect(() => {
    const fetchChecklistMetrics = async () => {
      const res = await getChecklistMetrics(filters);

      if (JSON.stringify(res.data) !== JSON.stringify(dynamicMetrics)) {
        setDynamicMetrics(res.data);
      }
    };

    fetchChecklistMetrics();

    const interval = setInterval(fetchChecklistMetrics, 5000);

    return () => clearInterval(interval);
  }, [filters, dynamicMetrics]);

  useEffect(() => {
    const loadMetrics = async () => {
      const results = {};
      for (const metric of metricOptions) {
        try {
          let res;
          if (metric.key === "totalProjects") {
            res = await metric.fetch(); // no filters
          } else {
            res = await metric.fetch(filters);
          }
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

  // useEffect(() => {
  //   const loadUpcomingInterview = async () => {
  //     try {
  //       const data = await getUpcomingInterview();
  //       setUpcomingInterview(data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   loadUpcomingInterview();
  // }, []);

  // Polling every 5 seconds

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
      {/* ======================= TOP NAVBAR ======================= */}
      <Navbar
        toggleSidebar={setSidebarOpen}
        activeSection={section}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        years={years}
      />

      {/* ======================= MAIN CONTENT ======================= */}
      <div className="flex flex-1 overflow-hidden">
        {/* ======================= SIDE MENU ======================= */}
        <SideMenu
          activeMenu={section}
          setSection={setSection}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={setSidebarOpen}
        />

        {/* ======================= PAGE CONTENT ======================= */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] p-4 lg:p-6">
          {/* ======================= DASHBOARD: Academic Year Selector ======================= */}
          {/* {section === "dashboard" && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="font-medium">Select Academic Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border p-2 rounded w-full sm:w-auto"
              >
                {years.map((y, index) => (
                  <option key={index} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}
   */}
          {/* ======================= DASHBOARD: Cards Section ======================= */}
          {section === "dashboard" && (
            <div className="max-w-[2000px] mx-auto space-y-8">
              {/* Greeting Card */}
              <GreetingCard />

              {/* Top Cards */}
              <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-1 gap-3">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Cards Section
                  </h3>
                  <button
                    onClick={addCard}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-100"
                  >
                    <Plus size={14} /> Add Card
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {cards.map((card) => {
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
                        className={`relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition-all duration-300
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

                        {/* Metric Title */}
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                          {metricTitle}
                        </p>

                        {/* Number */}
                        <div className="flex flex-1 items-center justify-center">
                          <p className="text-5xl font-black text-black-900 tracking-tight">
                            {displayValue}
                          </p>
                        </div>

                        {/* Expanded Panel */}
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

              {/* Mid Section: Completion & Interview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Interview Section */}
                <InterviewSection
                  showInterview={showInterview}
                  setShowInterview={setShowInterview}
                />

                {/* Immediate Actions Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm max-h-[450px] flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-slate-900 text-white rounded-xl">
                      <Zap size={18} fill="currentColor" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900">
                      Immediate Actions Required
                    </h3>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {newIdeasCount === 0 ? (
                      <div className="flex items-center justify-center h-full bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          No Immediate Actions
                        </p>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-700">
                          {newIdeasCount} new project idea pending review
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= OTHER SECTIONS ======================= */}
          {section === "uploads" && <Uploads />}
          {section === "messages" && <HeadMessage />}
          {section === "form3" && <Form3 />}
          {section === "projects" && <Projectsdata />}
          {section === "documents" && <Documents />}
          {section === "CheckList" && <Checklist />}
          {section === "Register" && <Register />}

          {/* ======================= Review Projects ======================= */}
          {section === "reviewProjects" && (
            <div className="w-full px-4 lg:px-10 mt-6 min-h-screen font-sans relative z-20">
              {/* SubTab Navigation */}
              <div className="flex flex-wrap gap-3 justify-start mb-6">
                {[
                  { id: "pending", label: "Pending Ideas" },
                  { id: "reviewed", label: "Reviewed" },
                  { id: "interview", label: "Schedule" },
                  { id: "interviewstatus", label: "Status" },
                ].map((tab) => {
                  const isActive = subTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSubTab(tab.id)}
                      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300
              ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600"
              }
            `}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Main Card Container */}
              <div className="bg-white rounded-[1rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-200/60 relative z-10 overflow-hidden h-[800px] md:h-[700px]">
                {/* Header */}
                <div className="px-6 sm:px-8 lg:px-10 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 bg-white">
                  {/* Left: Title & Academic Year */}
                  <div className="space-y-1 w-full sm:w-auto">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-800 tracking-tight">
                      {subTab === "pending" && "Project Proposals"}
                      {subTab === "reviewed" && " Review"}
                      {subTab === "interview" && "Interview"}
                      {subTab === "interviewstatus" && " Status"}
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] mt-1">
                      Academic Session {selectedYear}
                    </p>
                  </div>

                  {/* Right: Workspace Badge */}
                  <div className="mt-3 sm:mt-0 flex-shrink-0">
                    <div className="inline-flex items-center px-4 py-1.5 bg-indigo-50/50 rounded-full border border-indigo-100/50">
                      <span className="text-xs sm:text-sm font-bold text-indigo-500 uppercase tracking-widest">
                        Workspace
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="p-6 sm:p-8 lg:p-10 h-[calc(100%-88px)] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
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
