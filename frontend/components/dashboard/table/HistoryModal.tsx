import { useEffect, useState } from "react";
import axios from "axios";

interface HistoryData {
  timestamp: string;
  passed: boolean;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiName: string | null;
}

export default function HistoryModal({ isOpen, onClose, apiName }: HistoryModalProps) {
  const [data, setData] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && apiName) {
      setLoading(true);
      axios.get(`http://127.0.0.1:8000/status-history/${encodeURIComponent(apiName)}`)
        .then(res => {
          // The backend returns it sorted ascending. We want newest first (descending).
          const sortedDesc = res.data.reverse();
          setData(sortedDesc);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, apiName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{apiName} - Status History</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8 text-zinc-500">Loading...</div>
          ) : data.length === 0 ? (
            <div className="flex justify-center items-center py-8 text-zinc-500">No history available.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="pb-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Time</th>
                  <th className="pb-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, i) => {
                  const date = new Date(entry.timestamp);
                  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800/50 last:border-0">
                      <td className="py-3 text-sm text-zinc-700 dark:text-zinc-300">
                        {date.toLocaleDateString()} {timeString}
                      </td>
                      <td className="py-3 text-right">
                        {entry.passed ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                            PASS
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                            FAIL
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
