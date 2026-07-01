"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaExchangeAlt, FaPlus, FaTimesCircle } from "react-icons/fa";
import { getSchedulerConfigs, SchedulerConfig } from "@/services/scheduler-configs-api";
import { getNotificationRecipients, NotificationRecipient } from "@/services/notification-recipients-api";

export default function SchedulerStatusCard() {
  const router = useRouter();
  
  const [schedules, setSchedules] = useState<SchedulerConfig[]>([]);
  const [users, setUsers] = useState<NotificationRecipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(false);
        const [schedulesData, usersData] = await Promise.all([
          getSchedulerConfigs(),
          getNotificationRecipients()
        ]);
        setSchedules(schedulesData);
        setUsers(usersData);
      } catch (err) {
        console.error("Failed to load scheduler info:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleNavigate = () => {
    router.push("/dashboard/schedules");
  };

  if (isLoading) {
    return (
      <div className="w-full md:w-[350px] shrink-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl space-y-6 transition-colors animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
        </div>
        <div className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        <div className="h-10 w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        <div className="h-10 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full md:w-[350px] shrink-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl space-y-6 transition-colors">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <FaCalendarAlt className="text-red-500" size={16} />
            Scheduler Status
          </h3>
        </div>
        <div className="py-4 flex flex-col items-center justify-center text-center text-zinc-500">
          <FaExclamationCircle size={24} className="text-red-400 mb-2" />
          <p className="text-sm font-medium">Unable to load scheduler information.</p>
        </div>
        <button onClick={handleNavigate} className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-medium text-xs py-2.5 px-4 rounded-lg border border-zinc-200 hover:border-zinc-300 dark:border-zinc-700/50 dark:hover:border-zinc-650 transition-all shadow-sm">
          <FaExchangeAlt size={12} className="text-zinc-400" />
          Manage Scheduler
        </button>
      </div>
    );
  }

  const activeSchedules = schedules.filter(s => s.enabled);
  const isRunning = activeSchedules.length > 0;
  
  const uniqueApis = new Set(schedules.map(s => s.target_name));
  const activeUsers = users.filter(u => u.is_active).length;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const allLastRuns = schedules.map(s => s.last_run ? new Date(s.last_run).getTime() : 0).filter(t => t > 0);
  const allNextRuns = schedules.map(s => s.next_run ? new Date(s.next_run).getTime() : 0).filter(t => t > 0);

  const lastRunTime = allLastRuns.length > 0 ? new Date(Math.max(...allLastRuns)).toISOString() : undefined;
  const nextRunTime = allNextRuns.length > 0 ? new Date(Math.min(...allNextRuns)).toISOString() : undefined;

  return (
    <div className="w-full md:w-[350px] shrink-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl space-y-6 transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2 transition-colors">
          <FaCalendarAlt className="text-blue-500" size={16} />
          Scheduler Status
        </h3>
        {isRunning ? (
          <span className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Running
          </span>
        ) : (
          <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400"></span>
            Stopped
          </span>
        )}
      </div>

      {schedules.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center text-zinc-500">
          <p className="text-sm font-medium">No schedules configured.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 border-y border-zinc-200 dark:border-zinc-800 py-4 text-xs transition-colors">
            <div className="space-y-1">
              <p className="text-zinc-500 font-medium">Active</p>
              <p className="text-zinc-900 dark:text-white font-semibold flex items-center gap-1">
                {activeSchedules.length}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-zinc-500 font-medium">Monitoring</p>
              <p className="text-zinc-900 dark:text-white font-semibold transition-colors">{uniqueApis.size} APIs</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-zinc-500 font-medium">Users</p>
              <p className="text-zinc-900 dark:text-white font-semibold">{activeUsers}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <p className="text-zinc-500 font-medium uppercase tracking-wider">Last Run</p>
              <p className="text-zinc-700 dark:text-zinc-300 font-medium">{formatDate(lastRunTime)}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-zinc-500 font-medium uppercase tracking-wider">Next Run</p>
              <p className="text-zinc-700 dark:text-zinc-300 font-medium">{formatDate(nextRunTime)}</p>
            </div>
          </div>
        </>
      )}

      {schedules.length === 0 ? (
        <button onClick={handleNavigate} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs py-2.5 px-4 rounded-lg transition-all shadow-sm">
          <FaPlus size={12} />
          Create First Schedule
        </button>
      ) : (
        <button onClick={handleNavigate} className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-medium text-xs py-2.5 px-4 rounded-lg border border-zinc-200 hover:border-zinc-300 dark:border-zinc-700/50 dark:hover:border-zinc-650 transition-all cursor-pointer shadow-sm">
          <FaExchangeAlt size={12} className="text-zinc-400" />
          Manage Scheduler
        </button>
      )}
    </div>
  );
}
