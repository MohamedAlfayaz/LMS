import React, { useMemo } from "react";
import { useArticleAnalytics } from "../../hooks/useAnalytics";
import { FiBookOpen, FiClock, FiBarChart2 } from "react-icons/fi";

const StudentHistory = () => {
  const { data: history = [], isLoading } = useArticleAnalytics();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  // 🔥 REAL INSIGHTS
  const insights = useMemo(() => {
    if (!history.length) return {};

    const totalTime = history.reduce((acc, cur) => acc + cur.duration, 0);
    const avgTime = totalTime / history.length;

    const categoryCount = {};
    history.forEach((item) => {
      categoryCount[item.category] =
        (categoryCount[item.category] || 0) + 1;
    });

    const topCategory = Object.entries(categoryCount).sort(
      (a, b) => a[1] - b[1]
    )[0]?.[0];

    return {
      totalTime,
      avgTime,
      topCategory,
    };
  }, [history]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-14 w-14 border-4 border-gray-200 border-t-indigo-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4">

      <div className="max-w-6xl mx-auto space-y-5">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Reading Analytics
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Track your learning performance
            </p>
          </div>

          <div className="bg-indigo-600 px-4 py-2 rounded-xl shadow text-md font-bold text-white">
            {history.length} Articles
          </div>
        </div>

        {/* 🔥 INSIGHTS */}
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">

            {/* TOTAL */}
            <div className="bg-white/80 backdrop-blur p-6 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-center items-center gap-3 text-indigo-600">
                <FiClock />
                <p className="text-md font-bold text-gray-500">Total Time</p>
              </div>
              <h3 className="text-xl font-bold mt-3 text-center text-gray-800">
                {formatTime(insights.totalTime || 0)}
              </h3>
            </div>

            {/* AVG */}
            <div className="bg-white/80 backdrop-blur p-6 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-center items-center gap-3 text-green-600">
                <FiBarChart2 />
                <p className="text-md font-bold text-gray-500">Average Time</p>
              </div>
              <h3 className="text-xl text-center font-bold mt-3 text-gray-800">
                {formatTime(Math.floor(insights.avgTime || 0))}
              </h3>
            </div>

            {/* CATEGORY */}
            <div className="bg-white/80 backdrop-blur p-6 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-center items-center gap-3 text-pink-600">
                <FiBookOpen />
                <p className="text-md font-bold text-gray-500">Top Category</p>
              </div>
              <h3 className="text-xl text-center font-bold mt-3 text-gray-800">
                {insights.topCategory || "-"}
              </h3>
            </div>

          </div>
        </div>


        {/* ACTIVITY HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Your Reading Activity
          </h2>
        </div>

        {/* EMPTY */}
        {history.length === 0 ? (
          <div className="rounded-3xl shadow p-16 text-center border border-dashed">
            <p className="text-lg text-gray-500 font-medium">
              No reading activity yet
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Start reading to see insights here
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {history.map((item) => (
              <div
                key={item.articleId}
                className="group bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >

                {/* TOP */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-medium bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                    {item.category}
                  </span>

                  <span className="text-xs font-semibold text-gray-500">
                    {formatTime(item.duration)}
                  </span>
                </div>

                {/* TITLE */}
                <h3 className="text-base font-semibold text-gray-800 leading-snug group-hover:text-indigo-600 transition mb-4 line-clamp-2">
                  {item.title}
                </h3>

                {/* PROGRESS */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 transition-all duration-500"
                    style={{
                      width: `${Math.min(item.duration / 5, 100)}%`,
                    }}
                  />
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default StudentHistory;