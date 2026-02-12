import React, { useState } from "react";
import Sidebar from "../components/teacher/Sidebar";
import StatsCards from "../components/teacher/StatsCards";
import ChartsSection from "../components/teacher/ChartsSection";
import CreateArticle from "../components/teacher/CreateArticle";
import ArticlesTable from "../components/teacher/ArticlesTable";


const TeacherDashboard = () => {
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="flex pt-12">
      <Sidebar active={active} setActive={setActive} />

      <div className="pl-24 p-8 w-full">
        {active === "Dashboard" && (
          <>
            <StatsCards />
            <ChartsSection />
          </>
        )}

        {active === "Create Article" && <CreateArticle />}

        {active === "Analytics" && <ChartsSection />}
        {active === "Articles" && <ArticlesTable />}

      </div>
    </div>
  );
};

export default TeacherDashboard;
