"use client";

import { useEffect, useState } from "react";
import { SchedulerConfig, getSchedulerConfigs } from "@/services/scheduler-configs-api";
import ScheduleRow from "./ScheduleRow";
import ScheduleModal from "./ScheduleModal";
import NotificationUsersSection from "./NotificationUsersSection";

export default function SchedulesTable() {
  const [schedules, setSchedules] = useState<SchedulerConfig[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<SchedulerConfig | null>(null);

  const fetchSchedules = async () => {
    try {
      const data = await getSchedulerConfigs();
      setSchedules(data);
    } catch (error) {
      console.error("Failed to fetch Scheduler Configs", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
    const intervalId = setInterval(fetchSchedules, 10000); // 10 seconds refresh
    return () => clearInterval(intervalId);
  }, []);

  const handleCreate = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (schedule: SchedulerConfig) => {
    setEditData(schedule);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xl transition-colors">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-zinc-200 dark:border-zinc-800 gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Schedules</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage automated test executions</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
            >
              Create Schedule
            </button>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Target</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Interval</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Last Run</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Next Run</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                    No Schedules found. Create one to get started.
                  </td>
                </tr>
              ) : (
                schedules.map((schedule, index) => (
                  <ScheduleRow
                    key={index}
                    schedule={schedule}
                    onRefresh={fetchSchedules}
                    onEdit={() => handleEdit(schedule)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <ScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onRefresh={fetchSchedules}
          editData={editData}
        />
      </div>

      {/* New Notification Users Section */}
      <NotificationUsersSection />
    </>
  );
}
