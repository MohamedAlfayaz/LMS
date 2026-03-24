import React from "react";
import { useAnalytics } from "../../hooks/useAnalytics";
import { BookOpen, Users, BarChart3 } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, gradient }) => (
  <div className={`relative overflow-hidden rounded-3xl p-6 shadow-lg bg-white border border-gray-100 hover:shadow-xl transition-all duration-300`}>

    {/* Gradient Accent */}
    <div className={`absolute top-0 left-0 w-full h-1 ${gradient}`} />

    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm flex-wrap font-bold">{title}</p>
        <h2 className="text-2xl font-bold text-gray-700 mt-3">
          {value}
        </h2>
      </div>

      <div className="p-3 bg-gray-100 rounded-xl">
        <Icon size={20} className="text-gray-600" />
      </div>
    </div>
  </div>
);

const StatsCards = () => {

  const { data, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 animate-pulse rounded-3xl"
          />
        ))}
      </div>
    );
  }

  const summary = data?.summary || {}

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-5">

      <StatCard
        title="Articles Created"
        value={summary.totalArticles}
        icon={BookOpen}
        gradient="bg-gradient-to-r from-indigo-500 to-indigo-600"
      />

      <StatCard
        title="Total Students"
        value={summary.totalStudents}
        icon={Users}
        gradient="bg-gradient-to-r from-emerald-500 to-green-600"
      />


      <StatCard
        title="Total Student Articles Read"
        value={summary.totalViews}
        icon={Users}
        gradient="bg-gradient-to-r from-purple-500 to-purple-600"
      />

      <StatCard
        title="Top Category"
        value={`${summary.topCategory} (${summary.topCategoryCount})`}
        icon={BarChart3}
        gradient="bg-gradient-to-r from-pink-500 to-rose-500"
      />

    </div>
  );
};

export default StatsCards;
