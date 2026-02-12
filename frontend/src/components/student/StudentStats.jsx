import React from "react";
import {
  BookOpen,
  Clock,
  Star
} from "lucide-react";

const config = {
  read: {
    title: "Articles Read",
    icon: BookOpen,
    accent: "bg-blue-500"
  },
  time: {
    title: "Reading Time",
    icon: Clock,
    accent: "bg-green-500"
  },
  category: {
    title: "Favorite Category",
    icon: Star,
    accent: "bg-purple-500"
  }
};

const StudentStats = ({ type, value }) => {
  const Icon = config[type].icon;

  return (
    <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between h-[130px]">
      
      {/* Accent bar */}
      <div className={`absolute top-0 left-0 h-full w-1 rounded-l-2xl ${config[type].accent}`} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-xs uppercase tracking-widest">
          {config[type].title}
        </p>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>

      {/* Value */}
      <h2 className="text-3xl font-bold text-gray-800">
        {value}
      </h2>
    </div>
  );
};

export default StudentStats;
