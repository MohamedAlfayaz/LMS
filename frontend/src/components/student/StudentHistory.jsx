import React, { useMemo } from "react";
import { useArticleAnalytics } from "../../hooks/useAnalytics";
import { FiBookOpen, FiClock, FiBarChart2 } from "react-icons/fi";
import Loading from "../ui/Loading";

const StudentHistory = () => {
  const { data: history = [], isLoading } = useArticleAnalytics();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

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
      (a, b) => b[1] - a[1]
    )[0]?.[0];

    return {
      totalTime,
      avgTime,
      topCategory,
    };
  }, [history]);

  // 🔥 LOADING
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Reading Analytics
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Track your learning performance
            </p>
          </div>

          <div className="bg-indigo-600 px-5 py-2 rounded-xl shadow text-sm font-bold text-white">
            {history.length} Articles
          </div>
        </div>

        {/* 🔥 INSIGHTS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          {/* TOTAL */}
          <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold">
              <FiClock />
              Total Time
            </div>
            <h3 className="text-2xl font-bold mt-4 text-gray-900 text-center">
              {formatTime(insights.totalTime || 0)}
            </h3>
          </div>

          {/* AVG */}
          <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <FiBarChart2 />
              Average Time
            </div>
            <h3 className="text-2xl font-bold mt-4 text-gray-900 text-center">
              {formatTime(Math.floor(insights.avgTime || 0))}
            </h3>
          </div>

          {/* CATEGORY */}
          <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-2 text-pink-600 font-semibold">
              <FiBookOpen />
              Top Category
            </div>
            <h3 className="text-2xl font-bold mt-4 text-gray-900 text-center">
              {insights.topCategory || "-"}
            </h3>
          </div>

        </div>

        {/* ACTIVITY HEADER */}
        <h2 className="text-xl font-semibold text-gray-800">
          Your Reading Activity
        </h2>

        {/* EMPTY STATE */}
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-3xl bg-white">
            <div className="text-5xl mb-4">📚</div>

            <p className="text-lg font-semibold text-gray-700">
              No reading activity yet
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Start reading articles — your stats will show up here
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {history.map((item) => (
              <div
                key={item.articleId}
                className="group bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >

                {/* TOP */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                    {item.category}
                  </span>

                  <span className="text-xs text-gray-500">
                    {formatTime(item.duration)}
                  </span>
                </div>

                {/* TITLE */}
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition line-clamp-2">
                  {item.title}
                </h3>

                {/* PROGRESS */}
                <div className="mt-4">
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-700"
                      style={{
                        width: `${Math.min(item.duration / 5, 100)}%`,
                      }}
                    />
                  </div>
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