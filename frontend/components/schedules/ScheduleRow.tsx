import { useState } from "react";
import { SchedulerConfig, updateSchedulerConfig, deleteSchedulerConfig } from "@/services/scheduler-configs-api";

interface Props {
  schedule: SchedulerConfig;
  onRefresh: () => void;
  onEdit: () => void;
}

export default function ScheduleRow({ schedule, onRefresh, onEdit }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the schedule '${schedule.name}'?`)) return;
    setIsProcessing(true);
    try {
      await deleteSchedulerConfig(schedule.name);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete schedule", error);
      alert("Failed to delete schedule");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggle = async () => {
    setIsProcessing(true);
    try {
      await updateSchedulerConfig(schedule.name, {
        ...schedule,
        enabled: !schedule.enabled
      });
      onRefresh();
    } catch (error) {
      console.error("Failed to toggle schedule", error);
      alert("Failed to toggle schedule");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds} sec`;
    if (seconds % 60 === 0) return `${seconds / 60} min`;
    return `${seconds} sec`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <tr className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-bold text-zinc-900 dark:text-white">{schedule.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-xs text-zinc-500 uppercase font-semibold">{schedule.target_type}</span>
          <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{schedule.target_name}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
          {formatInterval(schedule.interval_seconds)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={handleToggle}
          disabled={isProcessing}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-colors disabled:opacity-50 ${schedule.enabled ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
        >
          <span className="sr-only">Toggle schedule</span>
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${schedule.enabled ? 'translate-x-4' : 'translate-x-0'}`}
          />
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {formatDate(schedule.last_run)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {formatDate(schedule.next_run)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            disabled={isProcessing}
            className="rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 px-3 py-1 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isProcessing}
            className="rounded-lg bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20 px-3 py-1 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
