"use client";

import { useState } from "react";
import { FaPlay, FaCheckCircle, FaVial, FaTimesCircle } from "react-icons/fa";

interface ApiEndpoint {
  id: string;
  name: string;
  selected: boolean;
}

const mockApis: ApiEndpoint[] = [
  { id: "1", name: "Google", selected: true },
  { id: "2", name: "GitHub", selected: false },
  { id: "3", name: "OpenAI", selected: true },
];

export default function ManualTestingCard() {
  const [apis, setApis] = useState<ApiEndpoint[]>(mockApis);
  
  const toggleSelection = (id: string) => {
    setApis(apis.map(api => 
      api.id === id ? { ...api, selected: !api.selected } : api
    ));
  };

  return (
    <div className="w-full md:w-[350px] shrink-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl flex flex-col space-y-6 transition-colors">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4 transition-colors">
        <FaVial className="text-pink-500" size={16} />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight transition-colors">
          Manual Testing
        </h3>
      </div>

      {/* Selected APIs Checkbox List */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Selected APIs
        </p>
        <div className="space-y-2">
          {apis.map((api) => (
            <label 
              key={api.id} 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850/50 cursor-pointer transition-colors group"
            >
              <input
                type="checkbox"
                checked={api.selected}
                onChange={() => toggleSelection(api.id)}
                className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 focus:ring-offset-white dark:focus:ring-offset-zinc-900 bg-white dark:bg-zinc-800 cursor-pointer"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                {api.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button className="flex-1 flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium py-2.5 px-4 rounded-lg transition-colors">
          <FaPlay size={10} />
          Run Selected
        </button>
        <button className="flex-1 flex justify-center items-center gap-2 bg-white hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-medium py-2.5 px-4 rounded-lg transition-colors border border-zinc-200 hover:border-zinc-300 dark:border-zinc-700">
          <FaPlay size={10} />
          Run All
        </button>
      </div>

      {/* Recent Result */}
      <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-lg p-4 space-y-3 border border-zinc-200 dark:border-zinc-800/50 transition-colors">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Recent Result
        </p>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-zinc-500">Last Execution</p>
            <p className="text-sm text-zinc-800 dark:text-zinc-300 font-medium transition-colors">2 min ago</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-xs text-zinc-500">Status</p>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-medium text-emerald-400">Success</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
