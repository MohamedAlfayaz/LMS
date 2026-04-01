import React from "react";
import StudentCharts from "../components/student/StudentCharts";
import StatsCard from "../components/ui/StatsCard";

import { useStudentAnalytics } from "../hooks/useAnalytics";
import { BookOpen, Clock, Star } from "lucide-react";

const StudentDashboard = () => {
  const { data: stats, isLoading } = useStudentAnalytics();

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">

        {/* 🔥 TITLE */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">
            Student Dashboard
          </h1>
          <span className="text-sm text-gray-500">
            Welcome back 👋
          </span>
        </div>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <StatsCard
            title="Articles Read"
            value={stats?.totalRead}
            icon={BookOpen}
            accent="bg-blue-500"
            variant="student"
          />

          <StatsCard
            title="Reading Time"
            value={stats?.totalTime}
            icon={Clock}
            accent="bg-green-500"
            variant="student"
          />

          <StatsCard
            title="Favorite Category"
            value={stats?.favoriteCategory}
            icon={Star}
            accent="bg-purple-500"
            variant="student"
          />

        </div>

        {/* 🔥 CHART */}
        <div className="bg-white rounded-2xl shadow p-6">
          <StudentCharts
            labels={stats?.categoryLabels || []}
            values={stats?.categoryTimeData || []}
          />
        </div>

      </div>
    </>
  );
};

export default StudentDashboard;