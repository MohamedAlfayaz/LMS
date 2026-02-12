import React, { useEffect, useState } from "react";
import API from "../../api/api";
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

  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    totalStudents: 0,
    topCategory: "-",
    topCategoryCount: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/analytics");
        const summary = res.data?.summary || {};

        setStats({
          totalArticles: summary.totalArticles || 0,
          totalViews: summary.totalViews || 0,
          totalStudents: summary.totalStudents || 0,
          topCategory: summary.topCategory || "-",
          topCategoryCount: summary.topCategoryCount || 0
        });

      } catch (err) {
        console.error("Stats fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-5">

      <StatCard
        title="Articles Created"
        value={stats.totalArticles}
        icon={BookOpen}
        gradient="bg-gradient-to-r from-indigo-500 to-indigo-600"
      />

      <StatCard
        title="Total Students"
        value={stats.totalStudents}
        icon={Users}
        gradient="bg-gradient-to-r from-emerald-500 to-green-600"
      />


      <StatCard
        title="Total Student Articles Read"
        value={stats.totalViews}
        icon={Users}
        gradient="bg-gradient-to-r from-purple-500 to-purple-600"
      />

      <StatCard
        title="Top Category"
        value={`${stats.topCategory} (${stats.topCategoryCount})`}
        icon={BarChart3}
        gradient="bg-gradient-to-r from-pink-500 to-rose-500"
      />

    </div>
  );
};

export default StatsCards;
