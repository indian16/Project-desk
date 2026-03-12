import React, { useState } from "react";
import SideMenu from "../../components/SideMenu";
import Documentation from "./Documentation";
import BankProject from "./BankProject";
import MentorMessage from "./MentorMessage";
import IdeaProject from "./IdeaProject";
import Navbar from "../../components/Navbar";

const MentorDashboard = () => {
  const [section, setSection] = useState("dashboard");

  const renderSection = () => {
    switch (section) {
      case "dashboard":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">Mentor Dashboard</h1>
            <p className="text-gray-600">
              Welcome to your dashboard. Use the side menu to navigate.
            </p>
          </div>
        );

      case "mentorIdeaProjects":
        return <IdeaProject />;

      case "mentorBankProjects":
        return <BankProject />;

      case "documents":
        return <Documentation />;

      case "messages":
        return <MentorMessage />;

      case "form3Mentor":
        return <Form3Mentor />;

      default:
        return <p>Invalid section</p>;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      {/* ✅ TOP NAVBAR */}
      <Navbar />

      {/* ✅ SIDE MENU + CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        <SideMenu activeMenu={section} setSection={setSection} />

        <main className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default MentorDashboard;
