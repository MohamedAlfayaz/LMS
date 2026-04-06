import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAnalytics } from "../../hooks/useAnalytics";
import { setAnalytics } from "../../store/analyticsSlice";
import Loading from "../ui/Loading";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const ChartsSection = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useAnalytics();

  useEffect(() => {
    if (data) {
      dispatch(setAnalytics(data));
    }
  }, [data, dispatch]);

  if (isLoading) return <Loading />;

  // 🔥 TIME FORMAT FUNCTION (seconds → mm:ss)
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 🔥 EMPTY CHECK
  const isNoData =
    !data ||
    (
      (!data.viewsPerArticle?.data?.length) &&
      (!data.categoryDistribution?.data?.length) &&
      (!data.studentProgress?.data?.length)
    );

  if (isNoData) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl shadow-sm">
        <p className="text-gray-500 text-lg font-medium">
          No Data Found
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Analytics data is empty or not available
        </p>
      </div>
    );
  }

  // 🔥 BAR CHART (Views)
  const barData = {
    labels: data?.viewsPerArticle?.labels?.length
      ? data.viewsPerArticle.labels
      : ["No Data"],
    datasets: [
      {
        label: "Views",
        data: data?.viewsPerArticle?.data?.length
          ? data.viewsPerArticle.data
          : [0],
        backgroundColor: "#3B82F6",
        borderRadius: 10
      }
    ]
  };

  // 🔥 PIE CHART (Categories)
  const pieData = {
    labels: data?.categoryDistribution?.labels?.length
      ? data.categoryDistribution.labels
      : ["No Data"],
    datasets: [
      {
        data: data?.categoryDistribution?.data?.length
          ? data.categoryDistribution.data
          : [1],
        backgroundColor: [
          "#6366F1",
          "#22C55E",
          "#F97316",
          "#EF4444",
          "#14B8A6"
        ]
      }
    ]
  };

  // 🔥 LINE CHART (Reading Time)
  const lineData = {
    labels: data?.studentProgress?.labels || [],
    datasets: [
      {
        label: "Reading Time",
        data: data?.studentProgress?.data || [], // KEEP SECONDS
        borderColor: "#10B981",
        backgroundColor: "rgba(16,185,129,0.2)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  // 🔥 OPTIONS (WITH TIME FORMAT)
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `Reading Time: ${formatTime(value)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 3, // 🔥 important
          callback: (value) => formatTime(value)
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `Views: ${context.parsed.y}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50">

      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          Analytics Dashboard
        </h2>
        <p className="text-gray-500 text-sm">
          Track performance, engagement, and insights in real-time
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* BAR CHART */}
        <div className="group relative bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300">

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-gray-700">
              Views per Article
            </h3>
            <span className="text-xs text-blue-500 font-medium bg-blue-100 px-2 py-1 rounded-full">
              Traffic
            </span>
          </div>

          <div className="h-72">
            <Bar data={barData} options={barOptions} />
          </div>

        </div>

        {/* PIE CHART */}
        <div className="group relative bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300">

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-gray-700">
              Category Split
            </h3>
            <span className="text-xs text-green-500 font-medium bg-green-100 px-2 py-1 rounded-full">
              Distribution
            </span>
          </div>

          <div className="h-72">
            <Pie data={pieData} options={{ responsive: true }} />
          </div>

        </div>

        {/* LINE CHART */}
        <div className="group relative bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300">

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-gray-700">
              Reading Time
            </h3>
            <span className="text-xs text-emerald-500 font-medium bg-emerald-100 px-2 py-1 rounded-full">
              Engagement
            </span>
          </div>

          <div className="h-72">
            <Line data={lineData} options={options} />
          </div>

        </div>

      </div>
    </div>
  );
};

export default ChartsSection;