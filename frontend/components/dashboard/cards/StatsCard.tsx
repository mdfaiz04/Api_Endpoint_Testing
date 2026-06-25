import { FaCubes, FaCheckCircle, FaTimesCircle, FaPlay } from "react-icons/fa";

interface StatsCardProps {
  title: string;
  value: string | number;
  type?: "total" | "passed" | "failed" | "running";
}

export default function StatsCard({
  title,
  value,
  type = "total",
}: StatsCardProps) {
  const getIcon = () => {
    switch (type) {
      case "total": return <FaCubes className="text-indigo-500" size={24} />;
      case "passed": return <FaCheckCircle className="text-emerald-500" size={24} />;
      case "failed": return <FaTimesCircle className="text-red-500" size={24} />;
      case "running": return <FaPlay className="text-blue-500" size={20} />;
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-lg bg-white dark:bg-zinc-900 flex flex-col gap-4 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
      <div className="flex items-center justify-between">
        <h2 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium tracking-wide transition-colors">{title}</h2>
        <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors">
          {getIcon()}
        </div>
      </div>
      <div className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight transition-colors">
        {value}
      </div>
    </div>
  );
}