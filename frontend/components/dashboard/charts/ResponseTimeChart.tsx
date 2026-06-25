"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { FaChartLine } from "react-icons/fa";
import { useTheme } from "@/components/ThemeProvider";

const data = [
  { time: "00:00", Google: 1200, GitHub: 900, OpenAI: 1400 },
  { time: "04:00", Google: 1100, GitHub: 1000, OpenAI: 1350 },
  { time: "08:00", Google: 1500, GitHub: 950, OpenAI: 1450 },
  { time: "12:00", Google: 1300, GitHub: 850, OpenAI: 1500 },
  { time: "16:00", Google: 1250, GitHub: 920, OpenAI: 1380 },
  { time: "20:00", Google: 1150, GitHub: 890, OpenAI: 1420 },
];

export default function ResponseTimeChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl transition-colors">
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6 transition-colors">
        <FaChartLine className="text-indigo-500" size={18} />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight transition-colors">
          Response Time (24 Hours)
        </h3>
      </div>
      
      <div className="h-[320px] w-full min-w-0" style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="time" 
              stroke={isDark ? "#52525b" : "#a1a1aa"} 
              fontSize={12} 
              tickMargin={10} 
            />
            <YAxis 
              stroke={isDark ? "#52525b" : "#a1a1aa"} 
              fontSize={12} 
              tickMargin={10} 
              tickFormatter={(value) => `${value}ms`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? "#18181b" : "#ffffff", 
                borderColor: isDark ? "#27272a" : "#e4e4e7", 
                borderRadius: "8px",
                color: isDark ? "#e4e4e7" : "#18181b" 
              }} 
              itemStyle={{ color: isDark ? "#e4e4e7" : "#18181b" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Line 
              type="monotone" 
              dataKey="Google" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="GitHub" 
              stroke="#10b981" 
              strokeWidth={2} 
              dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="OpenAI" 
              stroke="#8b5cf6" 
              strokeWidth={2} 
              dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }}
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
