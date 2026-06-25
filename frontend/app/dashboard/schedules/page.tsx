"use client";

import Header from "@/components/layout/Header";
import SchedulesTable from "@/components/schedules/SchedulesTable";

export default function SchedulesPage() {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors">
      <aside className="w-[260px] bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col shrink-0 sticky top-0 h-screen transition-colors">
        <div className="h-[70px] border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6 transition-colors">
          <span className="text-lg font-bold text-zinc-900 dark:text-white tracking-wider transition-colors">METAWURKS</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-4 mt-2">Overview</div>
          <a href="/dashboard" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors">
            Dashboard
          </a>
          <a href="/dashboard/api-groups" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors">
            API Groups
          </a>
          <a href="/dashboard/schedules" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-indigo-600 text-white transition-colors">
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

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 flex-1 overflow-y-auto space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight transition-colors">
              Schedules
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 transition-colors">
              Configure and manage automated API testing intervals.
            </p>
          </div>
          
          <div className="w-full">
            <SchedulesTable />
          </div>
        </main>
      </div>
    </div>
  );
}
