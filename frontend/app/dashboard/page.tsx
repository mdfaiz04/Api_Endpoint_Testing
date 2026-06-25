"use client";

import { useState } from "react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import EndpointTable from "@/components/dashboard/table/EndpointTable";
import Header from "@/components/layout/Header";
import StatsCard from "@/components/dashboard/cards/StatsCard";
import SchedulerStatusCard from "@/components/dashboard/right-panel/SchedulerStatusCard";
import ActivityFeedCard from "@/components/dashboard/right-panel/ActivityFeedCard";
import ManualTestingCard from "@/components/dashboard/right-panel/ManualTestingCard";
import ResponseTimeChart from "@/components/dashboard/charts/ResponseTimeChart";
import SuccessRateChart from "@/components/dashboard/charts/SuccessRateChart";
import StatusDistributionChart from "@/components/dashboard/charts/StatusDistributionChart";
import SchedulerConfigCard from "@/components/dashboard/config/SchedulerConfigCard";

export default function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const stats = useDashboardStats(refreshKey);

  if (!stats) {
    return <div className="p-8 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen transition-colors">Loading dashboard...</div>;
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors">
      {/* Sidebar - Placeholder / Wrapper since sidebar is declared complete */}
      <aside className="w-[260px] bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col shrink-0 sticky top-0 h-screen transition-colors">
        <div className="h-[70px] border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6 transition-colors">
          <span className="text-lg font-bold text-zinc-900 dark:text-white tracking-wider transition-colors">METAWURKS</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-4 mt-2">Overview</div>
          <a href="/dashboard" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-indigo-600 text-white transition-colors">
            Dashboard
          </a>
          <a href="/dashboard/api-groups" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors">
            API Groups
          </a>
          <a href="/dashboard/schedules" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors">
            Schedules
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors">
            Endpoints
          </a>
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-4 mt-6">Settings</div>
          <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors">
            Preferences
          </a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Dashboard Body */}
        <main className="p-8 flex-1 overflow-y-auto space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight transition-colors">
              API Health Dashboard
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 transition-colors">
              Real-time monitoring and analytics of registered API services.
            </p>
          </div>

          {/* Stats Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard title="Total APIs" value={stats.total_apis} type="total" />
            <StatsCard title="Passed APIs" value={stats.passed_apis} type="passed" />
            <StatsCard title="Failed APIs" value={stats.failed_apis} type="failed" />
            <StatsCard title="Running Tests" value={stats.running_tests} type="running" />
          </div>

          {/* Table & Right Side Panel Layout */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Endpoint Table */}
            <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xl w-full transition-colors">
              <EndpointTable refreshKey={refreshKey} triggerRefresh={triggerRefresh} />
            </div>

            {/* Right Panel Stack */}
            <div className="flex flex-col gap-6 w-full md:w-auto">
              <SchedulerStatusCard />
              <ActivityFeedCard refreshKey={refreshKey} />
              <ManualTestingCard />
            </div>
          </div>

          {/* Charts Section */}
          <div className="w-full flex flex-col gap-6">
            <ResponseTimeChart />
            <SuccessRateChart />
            <StatusDistributionChart />
          </div>

          {/* Configuration Section */}
          <div className="w-full">
            <SchedulerConfigCard />
          </div>
        </main>
      </div>
    </div>
  );
}