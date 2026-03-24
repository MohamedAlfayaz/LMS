import React from "react";
import StudentSidebar from "../components/student/StudentSidebar";
import StudentStats from "../components/student/StudentStats";
import StudentCharts from "../components/student/StudentCharts";
import StudentHistory from "../components/student/StudentHistory";
import StudentArticles from "../components/student/StudentArticles";
import MyNotes from "../components/student/MyNotes";

import { useSelector, useDispatch } from "react-redux";
import { setActive } from "../store/uiSlice";

import { useStudentAnalytics } from "../hooks/useAnalytics";

const StudentDashboard = () => {

  const dispatch = useDispatch();
  const active = useSelector((state) => state.ui.active);

  const { data: stats, isLoading } = useStudentAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (

    <div className="flex min-h-screen">

      <div className="w-20 h-screen">
        <StudentSidebar
          active={active}
          setActive={(value) => dispatch(setActive(value))}
        />
      </div>

      <div className="flex-1 p-6 h-screen pt-25">

        {active === "Dashboard" && (

          <div className="grid grid-cols-12 gap-6 h-full">

            <div className="col-span-3 flex flex-col gap-6">

              <StudentStats
                type="read"
                value={stats?.totalRead}
              />

              <StudentStats
                type="time"
                value={stats?.totalTime}
              />

              <StudentStats
                type="category"
                value={stats?.favoriteCategory}
              />

            </div>

            <div className="col-span-9 bg-white rounded-2xl shadow-md p-6">

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