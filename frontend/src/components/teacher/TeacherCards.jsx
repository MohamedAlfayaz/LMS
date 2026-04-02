import { useAnalytics } from "../../hooks/useAnalytics";
import { BookOpen, Users, BarChart3 } from "lucide-react";
import StatsCard from "../ui/StatsCard";

const TeacherCards = () => {

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-5">

      <StatsCard
        title="Articles Created"
        value={summary.totalArticles}
        icon={BookOpen}
        accent="bg-gradient-to-r from-indigo-500 to-indigo-600"
      />

      <StatsCard
        title="Total Students"
        value={summary.totalStudents}
        icon={Users}
        accent="bg-gradient-to-r from-emerald-500 to-green-600"
      />


      <StatsCard
        title="Total Student Articles Read"
        value={summary.totalViews}
        icon={Users}
        accent="bg-gradient-to-r from-purple-500 to-purple-600"
      />

      <StatsCard
        title="Top Category"
        value={`${summary.topCategory} (${summary.topCategoryCount})`}
        icon={BarChart3}
        accent="bg-gradient-to-r from-pink-500 to-rose-500"
      />

    </div>
  );
};

export default TeacherCards;
