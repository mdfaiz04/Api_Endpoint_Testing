"use client";

import { useState } from "react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import EndpointTable from "@/components/dashboard/table/EndpointTable";
import Header from "@/components/layout/Header";
import StatsCard from "@/components/dashboard/cards/StatsCard";
import SchedulerStatusCard from "@/components/dashboard/right-panel/SchedulerStatusCard";
import ActivityFeedCard from "@/components/dashboard/right-panel/ActivityFeedCard";
import ApiGroupsSummaryCard from "@/components/dashboard/right-panel/ApiGroupsSummaryCard";
import RecentResultCard, { LastExecutionResult } from "@/components/dashboard/right-panel/RecentResultCard";
import StatusDistributionChart from "@/components/dashboard/charts/StatusDistributionChart";
import EndpointModal from "@/components/dashboard/table/EndpointModal";
import { ApiEndpoint } from "@/types/api-endpoint";
import { createEndpoint } from "@/services/endpoints-api";

export interface ToastData {
  title: string;
  lines: string[];
  type: "success" | "partial" | "failure";
}

export default function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [lastExecutionResult, setLastExecutionResult] = useState<LastExecutionResult | null>(null);
  const [batchActivityLogs, setBatchActivityLogs] = useState<any[]>([]);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const showNotification = (data: ToastData) => {
    setToast(data);
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleSaveApi = async (endpoint: ApiEndpoint) => {
    try {
      await createEndpoint(endpoint);
      showNotification({
        title: "API added successfully.",
        lines: [],
        type: "success"
      });
      triggerRefresh();
    } catch (error: any) {
      let msg = "Failed to add API.";
      if (error.response?.data?.detail) {
        msg = Array.isArray(error.response.data.detail) 
          ? error.response.data.detail.map((e: any) => e.msg).join(", ") 
          : error.response.data.detail;
      } else if (error.message) {
        msg = error.message;
      }
      showNotification({
        title: msg,
        lines: [],
        type: "failure"
      });
      throw new Error(msg); // Let EndpointModal catch it to keep modal open
    }
  };

  const stats = useDashboardStats(refreshKey);

  if (!stats) {
    return <div className="p-8 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen transition-colors">Loading dashboard...</div>;
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-8 z-[100] w-72 rounded-xl shadow-2xl transition-all transform overflow-hidden ${
          toast.type === 'success' ? 'bg-white dark:bg-zinc-800 border border-emerald-500/30' :
          toast.type === 'partial' ? 'bg-white dark:bg-zinc-800 border border-amber-500/30' :
          'bg-white dark:bg-zinc-800 border border-red-500/30'
        }`}>
          <div className={`px-4 py-3 border-b ${
            toast.type === 'success' ? 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30' :
            toast.type === 'partial' ? 'bg-amber-50/50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30' :
            'bg-red-50/50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30'
          } flex justify-between items-start`}>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">{toast.type === 'success' ? '✓' : toast.type === 'partial' ? '⚠' : '❌'}</span>
              <p className={`font-bold text-sm ${
                toast.type === 'success' ? 'text-emerald-700 dark:text-emerald-400' :
                toast.type === 'partial' ? 'text-amber-700 dark:text-amber-400' :
                'text-red-700 dark:text-red-400'
              }`}>{toast.title}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">×</button>
          </div>
          {toast.lines.length > 0 && (
            <div className="px-4 py-3 space-y-1 bg-white dark:bg-zinc-900 text-sm text-zinc-600 dark:text-zinc-300">
              {toast.lines.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          )}
        </div>
      )}

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight transition-colors">
                API Health Dashboard
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 transition-colors">
                Real-time monitoring and analytics of registered API services.
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
            >
              + Add API
            </button>
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
              <EndpointTable 
                refreshKey={refreshKey} 
                triggerRefresh={triggerRefresh} 
                showNotification={showNotification}
                setLastExecutionResult={setLastExecutionResult}
                addBatchActivityLog={(log) => setBatchActivityLogs(prev => [log, ...prev])}
              />
            </div>

            {/* Right Panel Stack */}
            <div className="flex flex-col gap-6 w-full md:w-auto">
              <RecentResultCard result={lastExecutionResult} />
              <SchedulerStatusCard />
              <ActivityFeedCard refreshKey={refreshKey} batchLogs={batchActivityLogs} />
              <ApiGroupsSummaryCard refreshKey={refreshKey} />
            </div>
          </div>

          {/* Charts Section */}
          <div className="w-full flex gap-6">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <StatusDistributionChart refreshKey={refreshKey} />
            </div>
          </div>
        </main>
      </div>

      <EndpointModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveApi}
        initialData={null}
        title="Add API"
      />
    </div>
  );
}