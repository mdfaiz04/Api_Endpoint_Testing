import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

interface TrendData {
  timestamp: string;
  response_time_ms: number;
}

interface TrendModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiName: string | null;
}

export default function TrendModal({ isOpen, onClose, apiName }: TrendModalProps) {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && apiName) {
      setLoading(true);
      axios.get(`http://127.0.0.1:8000/response-time-history/${encodeURIComponent(apiName)}`)
        .then(res => {
          const formattedData = res.data.map((d: any) => ({
            ...d,
            formattedTime: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setData(formattedData);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, apiName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{apiName} - Response Trend</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
            ✕
          </button>
        </div>
        <div className="p-6 h-[400px] w-full min-w-0">
          {loading ? (
            <div className="flex justify-center items-center h-full text-zinc-500">Loading...</div>
          ) : data.length === 0 ? (
            <div className="flex justify-center items-center h-full text-zinc-500">No test history available.</div>
          ) : (
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.2} />
                  <XAxis dataKey="formattedTime" stroke="#71717a" fontSize={12} tickMargin={10} />
                  <YAxis stroke="#71717a" fontSize={12} tickMargin={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px", color: "#fff" }}
                    itemStyle={{ color: "#818cf8" }}
                    labelStyle={{ color: "#a1a1aa" }}
                  />
                  <Line type="monotone" dataKey="response_time_ms" name="Response Time (ms)" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
