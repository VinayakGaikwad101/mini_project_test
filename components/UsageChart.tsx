"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export default function UsageChart() {
  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu"],
    datasets: [
      {
        label: "Prescriptions",
        data: [12, 19, 10, 15],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [102, 0], // Sums to 102
        backgroundColor: ["#10b981", "#e2e8f0"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">
          Weekly Volume
        </h3>
        <div className="h-48">
          <Bar
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">
          Transcription Status
        </h3>
        <div className="h-48 flex justify-center">
          <Pie
            data={pieData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
}
