import React from "react";
import { useAnalytics } from "../hooks/useAnalytics";
import { BookOpen, Users, BarChart3 } from "lucide-react";
import StatsCard from "../components/ui/StatsCard";
import Loading from "../components/ui/Loading";
import AddStudent from "../components/teacher/AddStudent";
import { FaUserPlus } from "react-icons/fa";
import Button from "../components/ui/Button";

import { useDispatch, useSelector } from "react-redux";
import { openModal, closeModal } from "../store/modalSlice";
import ChartsSection from "../components/teacher/ChartsSection";

const TeacherDashboard = () => {
  const { data, isLoading } = useAnalytics();
  const dispatch = useDispatch();
  const { modalOpen } = useSelector((state) => state.modal);

  if (isLoading) {
    return <Loading />;
  }

  const summary = data?.summary || {};

  // console.log("Sum", summary)

  const isNoData =
    !data ||
    !data.summary ||
    Object.keys(data.summary).length === 0;

  if (isNoData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed shadow-sm">
        <div className="text-5xl mb-3">📊</div>
        <p className="text-lg font-semibold text-gray-700">
          No analytics yet
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Data will appear when students start interacting
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* 🔥 HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Teacher Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Monitor students & content performance
            </p>
          </div>

          <Button
            onClick={() => dispatch(openModal())}
            variant="success"
            className="flex items-center gap-2 shadow-md hover:scale-[1.03] transition"
          >
            <FaUserPlus />
            Add Student
          </Button>

        </div>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatsCard
            title="Articles Created"
            value={summary.totalArticles ?? 0}
            icon={BookOpen}
            accent="bg-gradient-to-r from-indigo-500 to-indigo-600"
          />

          <StatsCard
            title="Total Students"
            value={summary.totalStudents ?? 0}
            icon={Users}
            accent="bg-gradient-to-r from-emerald-500 to-green-600"
          />

          <StatsCard
            title="Total Reads"
            value={summary.totalViews ?? 0}
            icon={Users}
            accent="bg-gradient-to-r from-purple-500 to-purple-600"
          />

          <StatsCard
            title="Top Category"
            value={
              summary.topCategory
                ? `${summary.topCategory} (${summary.topCategoryCount || 0})`
                : "-"
            }
            icon={BarChart3}
            accent="bg-gradient-to-r from-pink-500 to-rose-500"
          />

        </div>

        {/* 🔥 MAIN GRID (IMPORTANT) */}
        <div className="grid grid-cols-1 gap-6">

          {/* 📊 CHARTS */}
          <div className="bg-white rounded-3xl shadow-md p-2 border border-gray-100">
            <ChartsSection />
          </div>
        </div>

      </div>

      {/* 🔥 MODAL (UPGRADED) */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => dispatch(closeModal())}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <AddStudent />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;