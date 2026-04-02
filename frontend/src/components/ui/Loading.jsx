import React from "react";

const Bone = ({ className = "" }) => (
  <div className={`bg-purple-100 animate-pulse rounded-xl ${className}`} />
);

const StatSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-sm flex flex-col items-center gap-3">
    <div className="flex items-center gap-2">
      <Bone className="w-4 h-4 rounded-full" />
      <Bone className="w-20 h-3" />
    </div>
    <Bone className="w-16 h-6" />
  </div>
);

const CardSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 space-y-3">
    <div className="flex justify-between items-center">
      <Bone className="w-20 h-5 rounded-full" />
      <Bone className="w-10 h-5 rounded-full" />
    </div>
    <Bone className="w-11/12 h-4" />
    <Bone className="w-2/3 h-4" />
    <Bone className="w-full h-2 rounded-full mt-2" />
  </div>
);

// ── Main PageLoader ───────────────────────────────────────────────────────────

const Loading = ({ showStats = true, cards = 8 }) => {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Bone className="w-52 h-8" />
            <Bone className="w-36 h-3" />
          </div>
          <Bone className="w-24 h-9" />
        </div>

        {/* Stat cards — optional */}
        {showStats && (
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-5 max-w-xl w-full">
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </div>
          </div>
        )}

        {/* Spinner + dots */}
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="w-9 h-9 rounded-full border-[3px] border-purple-100 border-t-indigo-500 animate-spin" />

          <div className="flex gap-1.5 items-center">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 rounded-full bg-purple-200 animate-bounce [animation-delay:300ms]" />
          </div>

          <p className="text-xs font-semibold text-purple-400 tracking-widest uppercase">
            Loading…
          </p>
        </div>

        {/* Section title */}
        <Bone className="w-44 h-5" />

        {/* Content cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: cards }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Loading;