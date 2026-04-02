import React from "react";
import StudentCharts from "../components/student/StudentCharts";
import StatsCard from "../components/ui/StatsCard";
import { useStudentAnalytics } from "../hooks/useAnalytics";
import { BookOpen, Clock, Star } from "lucide-react";
import Loading from "../components/ui/Loading";

const StudentDashboard = () => {
  const { data: stats, isLoading } = useStudentAnalytics();

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

        {/* 🔥 MAIN GRID (IMPORTANT CHANGE) */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* 📊 CHART SECTION */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-md p-6 border border-gray-100">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
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

          {/* 🔥 SIDE PANEL (NEW → makes it look like real dashboard) */}
          <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100 flex flex-col justify-between">

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Performance Summary
              </h3>

              <div className="space-y-4 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-500">Total Articles</span>
                  <span className="font-semibold text-gray-800">
                    {stats?.totalRead || 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Total Time</span>
                  <span className="font-semibold text-gray-800">
                    {stats?.totalTime || 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Top Category</span>
                  <span className="font-semibold text-indigo-600">
                    {stats?.favoriteCategory || "-"}
                  </span>
                </div>

              </div>
            </div>

            {/* 🔥 PROGRESS BAR */}
            <div className="mt-6">
              <p className="text-xs text-gray-400 mb-2">
                Engagement Level
              </p>

              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-700"
                  style={{
                    width: `${Math.min(stats?.totalRead * 10 || 10, 100)}%`,
                  }}
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;