"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { FaChartArea } from "react-icons/fa";
import { useTheme } from "@/components/ThemeProvider";

const data = [
  { day: "Mon", Google: 100, GitHub: 95, OpenAI: 98 },
  { day: "Tue", Google: 100, GitHub: 96, OpenAI: 97 },
  { day: "Wed", Google: 98, GitHub: 94, OpenAI: 99 },
  { day: "Thu", Google: 99, GitHub: 95, OpenAI: 98 },
  { day: "Fri", Google: 100, GitHub: 97, OpenAI: 99 },
  { day: "Sat", Google: 99, GitHub: 96, OpenAI: 98 },
  { day: "Sun", Google: 100, GitHub: 98, OpenAI: 100 },
];

export default function SuccessRateChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl transition-colors">
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6 transition-colors">
        <FaChartArea className="text-emerald-500" size={18} />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight transition-colors">
          Success Rate (7 Days)
        </h3>
      </div>
      
      <div className="h-[320px] w-full min-w-0" style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorGitHub" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOpenAI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="day" 
              stroke={isDark ? "#52525b" : "#a1a1aa"} 
              fontSize={12} 
              tickMargin={10} 
            />
            <YAxis 
              stroke={isDark ? "#52525b" : "#a1a1aa"} 
              fontSize={12} 
              tickMargin={10} 
              domain={[90, 100]}
              tickFormatter={(value) => `${value}%`}
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
            <Area 
              type="monotone" 
              dataKey="Google" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorGoogle)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="GitHub" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorGitHub)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="OpenAI" 
              stroke="#8b5cf6" 
              fillOpacity={1} 
              fill="url(#colorOpenAI)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
