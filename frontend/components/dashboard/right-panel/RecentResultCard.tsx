"use client";

import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaPlayCircle } from "react-icons/fa";

export interface LastExecutionResult {
  timestamp: string;
  totalTested: number;
  passed: number;
  failed: number;
  executionTime: number; // in seconds
  status: "Success" | "Completed with Failures" | "Execution Failed";
}

interface Props {
  result: LastExecutionResult | null;
}

export default function RecentResultCard({ result }: Props) {
  return (
    <div className="w-full md:w-[350px] shrink-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl space-y-4 transition-colors">
      <div className="flex items-center gap-2">
        <FaPlayCircle className="text-indigo-500" size={16} />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight transition-colors">
          Recent Result
        </h3>
      </div>

      {!result ? (
        <div className="flex flex-col items-center justify-center py-6 text-zinc-500 dark:text-zinc-400">
          <p className="text-sm">No manual executions this session.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500 font-medium">Last Execution</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{result.timestamp}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg text-center border border-zinc-100 dark:border-zinc-700/50">
              <p className="text-xs text-zinc-500 font-medium mb-1">Tested</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{result.totalTested}</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-lg text-center border border-emerald-100 dark:border-emerald-800/30">
              <p className="text-xs text-emerald-600 dark:text-emerald-500 font-medium mb-1">Passed</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{result.passed}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg text-center border border-red-100 dark:border-red-800/30">
              <p className="text-xs text-red-600 dark:text-red-500 font-medium mb-1">Failed</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">{result.failed}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 transition-colors">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 font-medium">Execution Time</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{result.executionTime.toFixed(2)} sec</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 font-medium">Status</span>
              <div className="flex items-center gap-1.5">
                {result.status === "Success" ? (
                  <FaCheckCircle className="text-emerald-500" size={14} />
                ) : result.status === "Completed with Failures" ? (
                  <FaExclamationTriangle className="text-amber-500" size={14} />
                ) : (
                  <FaTimesCircle className="text-red-500" size={14} />
                )}
                <span className={`font-bold ${
                  result.status === "Success" ? "text-emerald-600 dark:text-emerald-400" :
                  result.status === "Completed with Failures" ? "text-amber-600 dark:text-amber-400" :
                  "text-red-600 dark:text-red-400"
                }`}>
                  {result.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
