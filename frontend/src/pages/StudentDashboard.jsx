import React, { useEffect, useState } from "react";
import API from "../api/api";

import StudentSidebar from "../components/student/StudentSidebar";
import StudentStats from "../components/student/StudentStats";
import StudentCharts from "../components/student/StudentCharts";
import StudentHistory from "../components/student/StudentHistory";
import StudentArticles from "../components/student/StudentArticles";
import MyNotes from "../components/student/MyNotes";

const StudentDashboard = () => {
  const [active, setActive] = useState("Dashboard");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/analytics/student").then(res => setStats(res.data));
    document.body.style.overflow = "hidden"; // 🔒 kill body scroll
    return () => (document.body.style.overflow = "auto");
  }, []);

  return (
    <div className="flex h-screen pt-18 bg-gray-100 overflow-hidden">

      {/* ===== Sidebar ===== */}
      <div className="w-20 h-screen">
        <StudentSidebar active={active} setActive={setActive} />
      </div>

      {/* ===== Main Content ===== */}
      <div className="flex-1 p-6 h-screen overflow-hidden">
        {active === "Dashboard" && (
          <div className="grid grid-cols-12 gap-6 h-full">

            {/* ===== Stats ===== */}
            <div className="col-span-3 flex flex-col gap-6 h-full">
              <StudentStats type="read" value={stats?.totalRead} />
              <StudentStats type="time" value={stats?.totalTime} />
              <StudentStats type="category" value={stats?.favoriteCategory} />
            </div>

            {/* ===== Chart ===== */}
            <div className="col-span-9 bg-white rounded-2xl shadow-md p-6 h-120">
              <StudentCharts
                labels={stats?.categoryLabels || []}
                values={stats?.categoryTimeData || []}
              />

            </div>

          </div>
        )}

        {active === "Browse Articles" && <StudentArticles />}
        {active === "Reading History" && <StudentHistory />}
        {active === "My Notes" && <MyNotes />}
      </div>
    </div>
  );
};

export default StudentDashboard;
