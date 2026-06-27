"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaLayerGroup, FaExclamationCircle, FaArrowRight, FaPlus } from "react-icons/fa";
import { getApiGroups, ApiGroup } from "@/services/api-groups-api";
import { getEndpoints } from "@/services/endpoints-api";

export default function ApiGroupsSummaryCard({ refreshKey }: { refreshKey?: number }) {
  const router = useRouter();
  
  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [totalApis, setTotalApis] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(false);
        const [groupsData, endpointsData] = await Promise.all([
          getApiGroups(),
          getEndpoints()
        ]);
        setGroups(groupsData);
        setTotalApis(endpointsData.length);
      } catch (err) {
        console.error("Failed to load API Groups info:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [refreshKey]);

  const handleNavigate = () => {
    router.push("/dashboard/api-groups");
  };

  if (isLoading) {
    return (
      <div className="w-full md:w-[350px] shrink-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl space-y-6 transition-colors animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>
        <div className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        <div className="h-10 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full md:w-[350px] shrink-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl space-y-6 transition-colors">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <FaLayerGroup className="text-red-500" size={16} />
            API Groups
          </h3>
        </div>
        <div className="py-4 flex flex-col items-center justify-center text-center text-zinc-500">
          <FaExclamationCircle size={24} className="text-red-400 mb-2" />
          <p className="text-sm font-medium">Unable to load API Groups.</p>
        </div>
        <button onClick={handleNavigate} className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-medium text-xs py-2.5 px-4 rounded-lg border border-zinc-200 hover:border-zinc-300 dark:border-zinc-700/50 dark:hover:border-zinc-650 transition-all shadow-sm">
          <FaArrowRight size={12} className="text-zinc-400" />
          Manage Groups
        </button>
      </div>
    );
  }

  // Calculate stats
  const totalGroups = groups.length;
  const groupedApisSet = new Set<string>();
  groups.forEach(g => {
    g.apis.forEach(api => groupedApisSet.add(api));
  });
  const groupedApisCount = groupedApisSet.size;
  const ungroupedApisCount = Math.max(0, totalApis - groupedApisCount);

  return (
    <div className="w-full md:w-[350px] shrink-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl space-y-6 transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2 transition-colors">
          <FaLayerGroup className="text-indigo-500" size={16} />
          API Groups
        </h3>
      </div>

      {totalGroups === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center text-zinc-500">
          <p className="text-sm font-medium text-zinc-900 dark:text-white">No API Groups created.</p>
          <p className="text-xs mt-1">Organize APIs into logical collections.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 border-y border-zinc-200 dark:border-zinc-800 py-4 text-xs transition-colors">
          <div className="space-y-1">
            <p className="text-zinc-500 font-medium">Groups</p>
            <p className="text-zinc-900 dark:text-white font-semibold flex items-center gap-1">
              {totalGroups}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-zinc-500 font-medium">Grouped APIs</p>
            <p className="text-zinc-900 dark:text-white font-semibold transition-colors">{groupedApisCount}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-zinc-500 font-medium">Ungrouped APIs</p>
            <p className="text-zinc-900 dark:text-white font-semibold">{ungroupedApisCount}</p>
          </div>
        </div>
      )}

      {totalGroups === 0 ? (
        <button onClick={handleNavigate} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs py-2.5 px-4 rounded-lg transition-all shadow-sm">
          <FaPlus size={12} />
          Create First Group
        </button>
      ) : (
        <button onClick={handleNavigate} className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-medium text-xs py-2.5 px-4 rounded-lg border border-zinc-200 hover:border-zinc-300 dark:border-zinc-700/50 dark:hover:border-zinc-650 transition-all cursor-pointer shadow-sm">
          <FaArrowRight size={12} className="text-zinc-400" />
          Manage Groups
        </button>
      )}
    </div>
  );
}
