import React, { useEffect, useState } from "react";
import API from "../../api/api";

const StudentHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/analytics/student");
        setHistory(res.data.readingHistory);
      } catch (err) {
        console.error("Failed to fetch history");
      }
    };

    fetchHistory();
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-white to-gray-50 p-10 rounded-3xl shadow-xl border border-gray-100">
      
      {/* TITLE */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-bold text-gray-900">
          📖 Reading History
        </h2>

        <span className="text-sm text-gray-400">
          {history.length} Articles
        </span>
      </div>

      {/* EMPTY STATE */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-gray-300 rounded-2xl bg-white">
          <p className="text-gray-500 text-lg">
            No reading activity yet.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Start reading articles to see your progress here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {history.map((item) => (
            <div
              key={item.articleId}
              className="group flex justify-between items-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* LEFT SECTION */}
              <div className="flex flex-col">
                <p className="font-semibold text-lg text-gray-800 group-hover:text-indigo-600 transition">
                  {item.title}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {item.category}
                </p>
              </div>

              {/* RIGHT SECTION */}
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-semibold">
                  {formatTime(item.duration)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentHistory;
