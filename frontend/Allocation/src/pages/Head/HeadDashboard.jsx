// src/pages/head/HeadDashboard.jsx

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import SideMenu from "../../components/SideMenu";
import Uploads from "./Uploads";
import Documents from "./Documents";
import HeadMessage from "./HeadMessage";
import Form3 from "./Form3";
import Projectsdata from "./Projectsdata";
import Register from "../Auth/Register";

import PendingIdeas from "./ReviewProjects/PendingIdeas";
import ReviewedIdeas from "./ReviewProjects/ReviewedIdeas";
import ScheduleInterview from "./ReviewProjects/ScheduleInterview";
import InterviewStatus from "./ReviewProjects/InterviewStatus";

import GreetingCard from "./GreetingCard";
import AcademicYearSelector from "./AcademicYearSelector";
import DashboardCards from "./DashboardCards";
import InterviewSection from "./InterviewSection";

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
  getChecklistMetrics,
  getChecklistFilters,
} from "../../services/headService";

const HeadDashboard = () => {
  const [section, setSection] = useState("dashboard");
  const [subTab, setSubTab] = useState("pending");

  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  const [interviews, setInterviews] = useState([]);
  const [newIdeasCount, setNewIdeasCount] = useState(0);
  const [showInterview, setShowInterview] = useState(true);
  const [metrics, setMetrics] = useState({});
  const [dynamicMetrics, setDynamicMetrics] = useState([]);

  const [filters, setFilters] = useState({
    branch: "",
    section: "",
    group: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    branches: [],
    sections: [],
    groups: [],
  });

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const headId = storedUser?.id;

  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem(`head-dashboard-cards-${headId}`);
    return saved ? JSON.parse(saved) : [];
  });

  /* ---------------- METRIC OPTIONS ---------------- */

  const metricOptions = [
    { key: "totalProjects", label: "Total Projects", fetch: getTotalProjects },
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

  /* ---------------- FETCH YEARS ---------------- */

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const data = await getAvailableYears();
        const yearList = data.map((y) => (typeof y === "string" ? y : y.year));

        setYears(yearList);

        if (yearList.length > 0) setSelectedYear(yearList[0]);
      } catch (err) {
        console.error("Year fetch error", err);
      }
    };

    fetchYears();
  }, []);

  /* ---------------- FETCH FILTERS ---------------- */

  useEffect(() => {
    const fetchFilters = async () => {
      const res = await getChecklistFilters();
      setFilterOptions(res.data);
    };

    fetchFilters();
  }, []);

  /* ---------------- FETCH DYNAMIC METRICS ---------------- */

  useEffect(() => {
    const fetchChecklistMetrics = async () => {
      const res = await getChecklistMetrics(filters);
      setDynamicMetrics(res.data);
    };

    fetchChecklistMetrics();
  }, [filters]);

  /* ---------------- FETCH METRICS ---------------- */

  useEffect(() => {
    const loadMetrics = async () => {
      const results = {};

      for (const metric of metricOptions) {
        try {
          const res = await metric.fetch(filters);

          results[metric.key] = res.data?.total || res.data?.count || 0;
        } catch {
          results[metric.key] = 0;
        }
      }

      setMetrics(results);
    };

    loadMetrics();
  }, [filters]);

  /* ---------------- FETCH INTERVIEWS ---------------- */

  useEffect(() => {
    const loadUpcomingInterview = async () => {
      try {
        const data = await getUpcomingInterview();
        setInterviews(data.interviews || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadUpcomingInterview();
  }, []);

  /* ---------------- FETCH NEW IDEAS ---------------- */

  useEffect(() => {
    const fetchIdeaCount = async () => {
      try {
        const data = await getNewProjectIdeaCount();
        setNewIdeasCount(data.newIdeaCount ?? 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchIdeaCount();
  }, []);

  /* ---------------- SAVE CARDS ---------------- */

  useEffect(() => {
    if (!headId) return;

    localStorage.setItem(
      `head-dashboard-cards-${headId}`,
      JSON.stringify(cards),
    );
  }, [cards, headId]);

  /* ---------------- CARD ACTION ---------------- */

  const addCard = () => {
    setCards([
      ...cards,
      {
        id: Date.now(),
        size: "S",
        metric: "totalProjects",
      },
    ]);
  };

  const updateCard = (updatedCard) => {
    setCards(cards.map((c) => (c.id === updatedCard.id ? updatedCard : c)));
  };

  const deleteCard = (id) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  /* ================================================= */

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <SideMenu activeMenu={section} setSection={setSection} />

        <div className="flex-1 overflow-y-auto p-6">
          {/* ================= DASHBOARD ================= */}

          {section === "dashboard" && (
            <div className="space-y-8">
              <GreetingCard />

              <AcademicYearSelector
                years={years}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
              />

              <DashboardCards
                cards={cards}
                metrics={metrics}
                dynamicMetrics={dynamicMetrics}
                metricOptions={metricOptions}
                filterOptions={filterOptions}
                filters={filters}
                setFilters={setFilters}
                addCard={addCard}
                handleUpdateCard={updateCard}
                handleDeleteCard={deleteCard}
              />

              <InterviewSection
                interviews={interviews}
                showInterview={showInterview}
                setShowInterview={setShowInterview}
                newIdeasCount={newIdeasCount}
              />
            </div>
          )}

          {/* ================= OTHER SECTIONS ================= */}

          {section === "uploads" && <Uploads />}
          {section === "messages" && <HeadMessage />}
          {section === "form3" && <Form3 />}
          {section === "projects" && <Projectsdata />}
          {section === "documents" && <Documents />}
          {section === "Register" && <Register />}

          {/* ================= REVIEW PROJECTS ================= */}

          {section === "reviewProjects" && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <button onClick={() => setSubTab("pending")}>Pending</button>
                <button onClick={() => setSubTab("reviewed")}>Reviewed</button>
                <button onClick={() => setSubTab("interview")}>Schedule</button>
                <button onClick={() => setSubTab("interviewstatus")}>
                  Status
                </button>
              </div>

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
          )}
        </div>
      </div>
    </div>
  );
};

export default HeadDashboard;
