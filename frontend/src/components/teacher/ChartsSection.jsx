import React, { useEffect, useState } from "react";
import API from "../../api/api";
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#374151",
          font: { size: 13 }
        }
      }
    },
    scales: {
      x: { ticks: { color: "#6B7280" } },
      y: { ticks: { color: "#6B7280" } },
    }
  };

  const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#374151",
        font: { size: 14 }
      }
    }
  }
};


  const [barData, setBarData] = useState({ labels: [], datasets: [] });
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });
  const [lineData, setLineData] = useState({ labels: [], datasets: [] });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get("/analytics");
        if (!res.data) return;

        setBarData({
          labels: res.data.viewsPerArticle?.labels || [],
          datasets: [
            {
              label: "Views",
              data: res.data.viewsPerArticle?.data || [],
              backgroundColor: "#3B82F6",
              borderRadius: 8,
            },
          ],
        });

        setPieData({
          labels: res.data.categoryDistribution?.labels || [],
          datasets: [
            {
              data: res.data.categoryDistribution?.data || [],
              backgroundColor: [
                "#6366F1",
                "#22C55E",
                "#F97316",
                "#EF4444",
                "#14B8A6",
              ],
              borderWidth: 0,
            },
          ],
        });

        setLineData({
          labels: res.data.studentProgress?.labels || [],
          datasets: [
            {
              label: "Reading Progress %",
              data: res.data.studentProgress?.data || [],
              borderColor: "#10B981",
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "#10B981",
              pointRadius: 4,
            },
          ],
        });

      } catch (err) {
        console.error("Analytics fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-2">
        {[1,2,3].map((i) => (
          <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="">
      
      {/* SECTION TITLE */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-700">
          Analytics Overview
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Track engagement and performance metrics
        </p>
      </div>

      {/* CHART GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Views per Article
          </h3>
          <div className="h-72">
            <Bar data={barData} options={options} />
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Category Distribution
          </h3>
          <div className="h-72">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* LINE CHART */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
