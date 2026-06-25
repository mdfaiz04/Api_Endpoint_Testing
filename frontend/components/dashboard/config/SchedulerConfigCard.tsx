"use client";

import { useState } from "react";
import { FaCog, FaSave } from "react-icons/fa";

const intervals = [
  { label: "5 sec", value: "5s" },
  { label: "15 sec", value: "15s" },
  { label: "30 sec", value: "30s" },
  { label: "1 min", value: "1m" },
  { label: "5 min", value: "5m" },
];

interface ApiEndpoint {
  id: string;
  name: string;
  selected: boolean;
}

const initialApis: ApiEndpoint[] = [
  { id: "1", name: "Google", selected: true },
  { id: "2", name: "GitHub", selected: true },
  { id: "3", name: "OpenAI", selected: false },
];

export default function SchedulerConfigCard() {
  const [selectedInterval, setSelectedInterval] = useState<string>("1m");
  const [apis, setApis] = useState<ApiEndpoint[]>(initialApis);

  const toggleApi = (id: string) => {
    setApis(apis.map(api => 
      api.id === id ? { ...api, selected: !api.selected } : api
    ));
  };

  const handleSave = () => {
    // Local state save logic here (mock)
    console.log("Saving schedule configuration...");
    console.log("Interval:", selectedInterval);
    console.log("Selected APIs:", apis.filter(a => a.selected).map(a => a.name));
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl space-y-6 transition-colors">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4 transition-colors">
        <FaCog className="text-zinc-400" size={18} />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight transition-colors">
          Scheduler Configuration
        </h3>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Section 1: Current Interval */}
        <div className="space-y-4 flex-1">
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider transition-colors">
            Current Interval
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {intervals.map((interval) => (
              <label 
                key={interval.value} 
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedInterval === interval.value 
                    ? "bg-indigo-50 dark:bg-indigo-600/10 border-indigo-200 dark:border-indigo-500/50" 
                    : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <input
                  type="radio"
                  name="interval"
                  value={interval.value}
                  checked={selectedInterval === interval.value}
                  onChange={(e) => setSelectedInterval(e.target.value)}
                  className="w-4 h-4 text-indigo-600 dark:text-indigo-500 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 focus:ring-indigo-500 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
                />
                <span className={`text-sm font-medium ${
                  selectedInterval === interval.value ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-700 dark:text-zinc-300"
                } transition-colors`}>
                  {interval.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 2: Selected APIs */}
        <div className="space-y-4 flex-1">
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider transition-colors">
            Selected APIs
          </p>
          <div className="space-y-2">
            {apis.map((api) => (
              <label 
                key={api.id} 
                className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer transition-colors group"
              >
                <input
                  type="checkbox"
                  checked={api.selected}
                  onChange={() => toggleApi(api.id)}
                  className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 focus:ring-offset-white dark:focus:ring-offset-zinc-900 bg-white dark:bg-zinc-900 cursor-pointer"
                />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  {api.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end transition-colors">
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
        >
          <FaSave size={14} />
          Save Schedule
        </button>
      </div>
    </div>
  );
}
