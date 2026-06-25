"use client";

import { FaPlay, FaCalendarAlt, FaHistory, FaCheckCircle, FaExchangeAlt } from "react-icons/fa";

export default function SchedulerStatusCard() {
  const selectedApis = ["Google", "GitHub", "OpenAI"];

  return (
    <div className="w-full md:w-[350px] shrink-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl space-y-6 transition-colors">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2 transition-colors">
          <FaCalendarAlt className="text-blue-500" size={16} />
          Scheduler Status
        </h3>
        <span className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2.5 py-0.5 rounded-full text-xs font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Running
        </span>
      </div>

      {/* Row 1 Metrics */}
      <div className="grid grid-cols-3 gap-3 border-y border-zinc-200 dark:border-zinc-800 py-4 text-xs transition-colors">
        <div className="space-y-1">
          <p className="text-zinc-500 font-medium">Status</p>
          <p className="text-emerald-400 font-semibold flex items-center gap-1">
            <FaCheckCircle size={10} /> Active
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-zinc-500 font-medium">Interval</p>
          <p className="text-zinc-900 dark:text-white font-semibold transition-colors">Every 5m</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-zinc-500 font-medium">Next Run</p>
          <p className="text-zinc-300 font-medium">in 2m 45s</p>
        </div>
      </div>

      {/* Row 2 Selected APIs */}
      <div className="space-y-3">
        <p className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">
          Selected APIs
        </p>
        <div className="flex flex-wrap gap-2">
          {selectedApis.map((api, idx) => (
            <span
              key={idx}
              className="bg-zinc-100 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white px-2.5 py-1 rounded-md text-xs font-medium transition-all"
            >
              {api}
            </span>
          ))}
        </div>
      </div>

      {/* Change Schedule Button */}
      <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-medium text-xs py-2.5 px-4 rounded-lg border border-zinc-200 hover:border-zinc-300 dark:border-zinc-700/50 dark:hover:border-zinc-650 transition-all cursor-pointer shadow-sm">
        <FaExchangeAlt size={12} className="text-zinc-400" />
        Change Schedule
      </button>
    </div>
  );
}
