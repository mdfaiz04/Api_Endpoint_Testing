"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { FaChartPie, FaExclamationCircle } from "react-icons/fa";
import { useTheme } from "@/components/ThemeProvider";
import { getStatusDistribution } from "@/services/dashboard-api";

export default function StatusDistributionChart({ refreshKey }: { refreshKey?: number }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [distribution, setDistribution] = useState<{healthy: number, warning: number, down: number, unknown: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(false);
        const data = await getStatusDistribution();
        setDistribution(data);
      } catch (err) {
        console.error("Failed to load status distribution:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]);

  const chartData = useMemo(() => {
    if (!distribution) return [];
    
    const data = [
      { name: "Healthy", value: distribution.healthy, color: "#10b981" },
      { name: "Warning", value: distribution.warning, color: "#eab308" },
      { name: "Down", value: distribution.down, color: "#ef4444" },
    ];
    
    if (distribution.unknown > 0) {
      data.push({ name: "Unknown", value: distribution.unknown, color: "#6b7280" });
    }
    
    return data;
  }, [distribution]);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Custom legend payload to show counts
  const legendPayload = chartData.map(item => ({
    id: item.name,
    type: 'square' as const,
    value: `${item.name} (${item.value})`,
    color: item.color
  }));

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl transition-colors">
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6 transition-colors">
        <FaChartPie className="text-amber-500" size={18} />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight transition-colors">
          Status Distribution
        </h3>
      </div>
      
      {isLoading ? (
        <div className="h-[320px] w-full flex items-center justify-center animate-pulse bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
           <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-zinc-500">Loading distribution...</p>
           </div>
        </div>
      ) : error ? (
        <div className="h-[320px] w-full flex flex-col items-center justify-center text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
           <FaExclamationCircle size={32} className="text-red-400 mb-3" />
           <p className="text-sm font-medium">Unable to load status distribution.</p>
        </div>
      ) : total === 0 ? (
        <div className="h-[320px] w-full flex flex-col items-center justify-center text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
           <FaChartPie size={32} className="text-zinc-300 dark:text-zinc-700 mb-3" />
           <p className="text-sm font-medium">No endpoints registered.</p>
           <p className="text-xs mt-1 text-zinc-400">Add APIs to see status distribution.</p>
        </div>
      ) : (
        <div className="h-[320px] w-full min-w-0" style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <Pie
                data={chartData}
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
                formatter={(value: number, name: string) => {
                  const percent = Math.round((value / total) * 100);
                  return [`${value} API${value !== 1 ? 's' : ''} (${percent}%)`, name];
                }}
              />
              <Legend payload={legendPayload} wrapperStyle={{ paddingTop: "20px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
