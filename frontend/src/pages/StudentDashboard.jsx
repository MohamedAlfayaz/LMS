import React, { useMemo } from "react";
import StudentCharts from "../components/student/StudentCharts";
import StatsCard from "../components/ui/StatsCard";
import { useStudentAnalytics, useAnalytics, useArticleAnalytics } from "../hooks/useAnalytics";
import { BookOpen, Clock, Star } from "lucide-react";
import Loading from "../components/ui/Loading";

const StudentDashboard = () => {
  const { data: stats, isLoading } = useStudentAnalytics();
  const { data: analyticsData } = useAnalytics();
  const { data: history = [] } = useArticleAnalytics();

  // console.log("Student Analytics Data:", stats);

  const summary = analyticsData?.summary || {};

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  if (isLoading) {
    return <Loading />;
  }


  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* 🔥 HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Student Dashboard
            </h2>
            <p className="text-gray-400 mt-1 text-sm">
              Track your learning performance & insights
            </p>
          </div>

          <div className="bg-white px-4 py-2 rounded-xl shadow text-sm font-medium text-gray-600">
            Welcome back 👋
          </div>

        </div>

        {/* 🔥 STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <StatsCard
            title="Articles Read"
            value={stats?.totalRead || 0}
            icon={BookOpen}
            accent="bg-blue-500"
            variant="student"
          />

          <StatsCard
            title="Reading Time"
            value={formatTime(stats?.totalTime || 0)}
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

        {/* 🔥 MAIN GRID (IMPORTANT CHANGE) */}
        <div className="grid grid-cols-1 gap-6">

          {/* 📊 CHART SECTION */}
          <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Reading Analytics
              </h3>
              <span className="text-xs text-gray-400">
                Category-wise time
              </span>
            </div>

            <StudentCharts
              labels={stats?.categoryLabels || []}
              values={stats?.categoryTimeData || []}
            />

          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;