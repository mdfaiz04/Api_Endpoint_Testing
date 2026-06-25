"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { FaChartPie } from "react-icons/fa";
import { useTheme } from "@/components/ThemeProvider";

const data = [
  { name: "Healthy", value: 85 },
  { name: "Warning", value: 10 },
  { name: "Down", value: 5 },
];

const COLORS = ["#10b981", "#eab308", "#ef4444"];

export default function StatusDistributionChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl transition-colors">
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6 transition-colors">
        <FaChartPie className="text-amber-500" size={18} />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight transition-colors">
          Status Distribution
        </h3>
      </div>
      
      <div className="h-[320px] w-full min-w-0" style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <Pie
              data={data}
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? "#18181b" : "#ffffff", 
                borderColor: isDark ? "#27272a" : "#e4e4e7", 
                borderRadius: "8px",
                color: isDark ? "#e4e4e7" : "#18181b" 
              }} 
              itemStyle={{ color: isDark ? "#e4e4e7" : "#18181b" }}
              formatter={(value) => `${value}%`}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
