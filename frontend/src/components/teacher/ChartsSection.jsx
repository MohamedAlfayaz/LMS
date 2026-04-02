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
    if (data) dispatch(setAnalytics(data));
  }, [data, dispatch]);

  if (isLoading) {
    return <Loading />
  }

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

  const barData = {
    labels: data.viewsPerArticle?.labels || [],
    datasets: [
      {
        label: "Views",
        data: data.viewsPerArticle?.data || [],
        backgroundColor: "#3B82F6",
        borderRadius: 8
      }
    ]
  };

  const pieData = {
    labels: data.categoryDistribution?.labels || [],
    datasets: [
      {
        data: data.categoryDistribution?.data || [],
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

  const lineData = {
    labels: data.studentProgress?.labels || [],
    datasets: [
      {
        label: "Reading Progress %",
        data: data.studentProgress?.data || [],
        borderColor: "#10B981",
        backgroundColor: "rgba(16,185,129,0.2)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false
  };



  return (
    <div className="space-y-6 p-4">

      <div >
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Analytics Overview
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Insights into student engagement & performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Views per Article
          </h3>
          <div className="h-72">
            <Bar data={barData} options={options} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Category Distribution
          </h3>
          <div className="h-72">
            <Pie data={pieData} options={options} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Student Reading Progress
          </h3>
          <div className="h-72">
            <Line data={lineData} options={options} />
          </div>
        </div>

      </div>

    </div>
  );
};

export default ChartsSection;