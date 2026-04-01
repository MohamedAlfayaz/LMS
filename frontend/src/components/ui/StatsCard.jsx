import React from "react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  accent = "bg-indigo-500",
  variant = "default", // student | teacher | admin
}) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 h-[120px] flex flex-col justify-between overflow-hidden">

      {/* LEFT ACCENT (student style) */}
      {variant === "student" && (
        <div className={`absolute top-0 left-0 h-full w-1 ${accent}`} />
      )}

      {/* TOP BORDER (teacher/admin style) */}
      {variant !== "student" && (
        <div className={`absolute top-0 left-0 w-full h-1 ${accent}`} />
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
          {title}
        </p>

        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
      </div>

      {/* VALUE */}
      <h2 className="text-2xl font-bold text-gray-800">
        {value}
      </h2>
    </div>
  );
};

export default StatCard;