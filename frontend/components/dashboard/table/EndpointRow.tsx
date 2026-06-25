import { useState } from "react";
import { EndpointSummary } from "@/types/endpoint-summary";
import { deleteEndpoint } from "@/services/endpoints-api";
import axios from "axios";

interface Props {
  summary: EndpointSummary;
  onRefresh?: () => void;
  onEdit?: () => void;
  onTrend?: () => void;
  onHistory?: () => void;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "PASS":
      return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400">PASS</span>;
    case "FAIL":
      return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/15 text-red-400">FAIL</span>;
    case "NOT_TESTED":
      return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-700 text-zinc-300">NOT_TESTED</span>;
    default:
      return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-700 text-zinc-300">{status || "UNKNOWN"}</span>;
  }
}

function formatLastTested(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  return date.toLocaleString();
}

export default function EndpointRow({ summary, onRefresh, onEdit, onTrend, onHistory }: Props) {
  const [isTesting, setIsTesting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTest = async () => {
    try {
      setIsTesting(true);
      await axios.get(`http://127.0.0.1:8000/manual-test?name=${encodeURIComponent(summary.name)}`);
      alert("Test completed");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Test failed", error);
      alert("Test failed");
    } finally {
      setIsTesting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the endpoint '${summary.name}'?`)) {
      try {
        setIsDeleting(true);
        await deleteEndpoint(summary.name);
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error("Delete failed", error);
        alert("Delete failed");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <tr className="border-b border-zinc-200 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
      <td className="p-3">
        <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{summary.name}</p>
      </td>
      <td className="p-3">
        {getStatusBadge(summary.status)}
      </td>
      <td className="p-3 text-sm text-zinc-600 dark:text-zinc-300 font-medium transition-colors">
        {summary.response_time_ms} <span className="text-xs text-zinc-400 dark:text-zinc-500">ms</span>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-700 dark:text-zinc-300 font-bold transition-colors">{summary.success_rate}%</span>
          <div className="w-16 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden transition-colors">
            <div 
              className={`h-full rounded-full ${summary.success_rate >= 95 ? 'bg-emerald-500' : summary.success_rate >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${summary.success_rate}%` }}
            />
          </div>
        </div>
      </td>
      <td className="p-3 text-xs text-zinc-500 dark:text-zinc-400 font-medium transition-colors">
        {formatLastTested(summary.last_tested)}
      </td>
      <td className="p-3 text-xs text-zinc-600 dark:text-zinc-300 transition-colors truncate max-w-[200px]" title={summary.last_message || "-"}>
        {summary.last_message || "-"}
      </td>
      <td className="p-3 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={handleTest}
            disabled={isTesting || isDeleting}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTesting ? "Testing..." : "▶ Test"}
          </button>
          <button
            onClick={onTrend}
            disabled={isTesting || isDeleting}
            className="rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 px-3 py-1 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Trend
          </button>
          <button
            onClick={onHistory}
            disabled={isTesting || isDeleting}
            className="rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 px-3 py-1 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            History
          </button>
          <button
            onClick={onEdit}
            disabled={isTesting || isDeleting}
            className="rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 px-3 py-1 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isTesting || isDeleting}
            className="rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 px-3 py-1 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}