import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentCharts = ({ labels = [], values = [] }) => {

  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#4F46E5",
          "#22C55E",
          "#F59E0B",
          "#EF4444",
          "#06B6D4",
          "#8B5CF6"
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 6
      }
    ]
  }), [labels, values]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 0 },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 16
        }
      }
    }
  }), []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="pb-4 h-85">
          <Pie data={data} options={options} />
        </div>
      </div>

    </div>
  );
};

export default StudentCharts;