"use client";

import { useEffect, useState } from "react";
import { FaHistory, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";

interface RecentActivity {
  api_name: string;
  passed: boolean;
  response_time_ms: number;
  status_code: number;
  message: string;
  tested_at: string;
}

interface Props {
  refreshKey?: number;
  batchLogs?: any[];
}

export default function ActivityFeedCard({ refreshKey = 0, batchLogs = [] }: Props) {
  const [logs, setLogs] = useState<RecentActivity[]>([]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/recent-activities");
        setLogs(response.data);
      } catch (error) {
        console.error("Failed to fetch logs", error);
      }
    }
    fetchLogs();
  }, [refreshKey]);

  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const getStatus = (log: RecentActivity) => {
    if (!log.passed) return "FAILURE";
    if (log.response_time_ms > 1000) return "WARNING";
    return "SUCCESS";
  };

  const renderIcon = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={14} />;
      case "WARNING":
        return <FaExclamationTriangle className="text-amber-500 shrink-0 mt-0.5" size={14} />;
      case "FAILURE":
        return <FaTimesCircle className="text-red-500 shrink-0 mt-0.5" size={14} />;
      default:
        return null;
    }
  };

  // Combine batch logs and normal logs
  const combinedLogs = [...batchLogs, ...logs];

  return (
    <div className="w-full md:w-[350px] shrink-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl space-y-4 transition-colors">
      {/* Title */}
      <div className="flex items-center gap-2">
        <FaHistory className="text-indigo-500" size={16} />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight transition-colors">
          Recent Activity
        </h3>
      </div>

      {/* Activity List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {combinedLogs.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No recent activity</p>
        ) : (
          combinedLogs.map((log, idx) => {
            if (log.isBatch) {
              return (
                <div 
                  key={`batch-${idx}`} 
                  className="flex gap-3 items-start p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/30 transition-colors border border-zinc-100 dark:border-zinc-800 group"
                >
                  {log.failed === 0 ? (
                    <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                  ) : (
                    <FaExclamationTriangle className="text-amber-500 shrink-0 mt-0.5" size={14} />
                  )}
                  <div className="space-y-1.5 w-full">
                    <p className={`text-sm font-bold leading-tight ${log.failed === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {log.failed === 0 ? 'Manual test completed' : 'Manual test completed with failures'}
                    </p>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5">
                      <p>{log.totalTested} APIs tested</p>
                      <p>{log.passed} Passed</p>
                      <p>{log.failed} Failed</p>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-medium pt-1">
                      {timeAgo(log.timestamp)}
                    </p>
                  </div>
                </div>
              );
            }

            const status = getStatus(log);
            return (
              <div 
                key={`log-${idx}`} 
                className="flex gap-3 items-start p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 group"
              >
                {renderIcon(status)}
                <div className="space-y-1.5 w-full">
                  <p className={`text-sm font-bold leading-tight ${
                    status === 'SUCCESS' ? 'text-emerald-600 dark:text-emerald-400' :
                    status === 'WARNING' ? 'text-amber-600 dark:text-amber-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {log.api_name} {status === 'SUCCESS' ? 'test completed successfully' : status === 'WARNING' ? 'API warning' : 'test failed'}
                  </p>
                  
                  {status === 'FAILURE' ? (
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                      {log.message}
                    </p>
                  ) : (
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5">
                      <p>Response time: {log.response_time_ms >= 1000 ? `${(log.response_time_ms / 1000).toFixed(2)} sec` : `${log.response_time_ms} ms`}</p>
                      <p>Status code: {log.status_code}</p>
                    </div>
                  )}
                  
                  <p className="text-[10px] text-zinc-400 font-medium pt-1">
                    {timeAgo(log.tested_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
