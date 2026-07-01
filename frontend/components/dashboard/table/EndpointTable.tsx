"use client";

import { useEffect, useState } from "react";
import { EndpointSummary } from "@/types/endpoint-summary";
import { getEndpointSummaries } from "@/services/endpoint-summary-api";
import { getEndpoints, updateEndpoint } from "@/services/endpoints-api";
import { ApiEndpoint } from "@/types/api-endpoint";
import { ToastData } from "@/app/dashboard/page";
import EndpointRow from "./EndpointRow";
import EndpointModal from "./EndpointModal";
import TrendModal from "./TrendModal";
import HistoryModal from "./HistoryModal";
import axios from "axios";

interface Props {
  refreshKey?: number;
  triggerRefresh?: () => void;
  showNotification?: (data: ToastData) => void;
  addBatchActivityLog?: (log: any) => void;
}

type FilterType = "ALL" | "PASS" | "FAIL";

export default function EndpointTable({ 
  refreshKey = 0, 
  triggerRefresh, 
  showNotification,
  addBatchActivityLog
}: Props) {
  const [summaries, setSummaries] = useState<EndpointSummary[]>([]);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [isRunningFailed, setIsRunningFailed] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTrendModalOpen, setIsTrendModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [trendApiName, setTrendApiName] = useState<string | null>(null);
  const [historyApiName, setHistoryApiName] = useState<string | null>(null);
  const [editData, setEditData] = useState<ApiEndpoint | null>(null);
  const [editingSummaryName, setEditingSummaryName] = useState<string | null>(null);

  const loadSummaries = async () => {
    try {
      const data = await getEndpointSummaries();
      setSummaries(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadSummaries();
  }, [refreshKey]);

  const processBatchResults = (results: any[], duration: number) => {
    const totalTested = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = totalTested - passed;
    const isSuccess = failed === 0;

    if (addBatchActivityLog) addBatchActivityLog({
      isBatch: true,
      timestamp: new Date().toISOString(),
      totalTested,
      passed,
      failed
    });

    if (showNotification) {
      showNotification({
        title: "Test execution completed",
        lines: [
          `${totalTested} APIs tested`,
          `${passed} Passed`,
          `${failed} Failed`,
          `Duration: ${duration.toFixed(2)} seconds`
        ],
        type: isSuccess ? "success" : "partial"
      });
    }
  };

  const handleBatchError = () => {
    if (showNotification) {
      showNotification({
        title: "Unable to execute tests",
        lines: ["Please try again."],
        type: "failure"
      });
    }
  };

  const handleRunAll = async () => {
    try {
      setIsRunningAll(true);
      const start = performance.now();
      const response = await axios.get("http://127.0.0.1:8000/manual-test-all");
      const end = performance.now();
      
      processBatchResults(response.data, (end - start) / 1000);
      
      if (triggerRefresh) triggerRefresh();
    } catch (error) {
      console.error("Run all failed", error);
      handleBatchError();
    } finally {
      setIsRunningAll(false);
    }
  };

  const handleRunFailed = async () => {
    try {
      setIsRunningFailed(true);
      const start = performance.now();
      const response = await axios.get("http://127.0.0.1:8000/manual-test-failed");
      const end = performance.now();

      processBatchResults(response.data, (end - start) / 1000);

      if (triggerRefresh) triggerRefresh();
    } catch (error) {
      console.error("Run failed tests failed", error);
      handleBatchError();
    } finally {
      setIsRunningFailed(false);
    }
  };

  const handleEditClick = async (summary: EndpointSummary) => {
    try {
      const endpoints = await getEndpoints();
      const endpointDetails = endpoints.find(e => e.name === summary.name);
      if (endpointDetails) {
        setEditData(endpointDetails);
        setEditingSummaryName(summary.name);
        setIsEditModalOpen(true);
      } else {
        if (showNotification) {
          showNotification({
            title: "Endpoint details not found",
            lines: [],
            type: "failure"
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch endpoint details", error);
      if (showNotification) {
        showNotification({
          title: "Failed to fetch details",
          lines: [],
          type: "failure"
        });
      }
    }
  };

  const handleSaveEdit = async (endpoint: ApiEndpoint) => {
    if (editingSummaryName) {
      await updateEndpoint(editingSummaryName, endpoint);
      if (triggerRefresh) triggerRefresh();
    }
  };

  const handleTrendClick = (summary: EndpointSummary) => {
    setTrendApiName(summary.name);
    setIsTrendModalOpen(true);
  };

  const handleHistoryClick = (summary: EndpointSummary) => {
    setHistoryApiName(summary.name);
    setIsHistoryModalOpen(true);
  };

  const filteredSummaries = summaries.filter(summary => {
    if (filter === "ALL") return true;
    return summary.status === filter;
  });

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-lg w-full transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight transition-colors">
            API Endpoints <span className="text-sm font-normal text-zinc-500 dark:text-zinc-500 ml-2">({filteredSummaries.length} Total)</span>
          </h2>
          <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg">
            <button 
              onClick={() => setFilter("ALL")} 
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${filter === "ALL" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("PASS")} 
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${filter === "PASS" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
            >
              Passed
            </button>
            <button 
              onClick={() => setFilter("FAIL")} 
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${filter === "FAIL" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
            >
              Failed
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRunFailed}
            disabled={isRunningAll || isRunningFailed}
            className="rounded-lg bg-red-600 hover:bg-red-500 text-white px-4 py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunningFailed ? "Running..." : "▶ Run Failed"}
          </button>
          <button
            onClick={handleRunAll}
            disabled={isRunningAll || isRunningFailed}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunningAll ? "Running..." : "▶ Run All"}
          </button>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800 transition-colors">
            <th className="p-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider transition-colors">API Name</th>
            <th className="p-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider transition-colors">Status</th>
            <th className="p-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider transition-colors">Response Time</th>
            <th className="p-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider transition-colors">Success Rate</th>
            <th className="p-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider transition-colors">Last Tested</th>
            <th className="p-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider transition-colors">Last Message</th>
            <th className="p-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider transition-colors text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredSummaries.map((summary, index) => (
            <EndpointRow
              key={index}
              summary={summary}
              onRefresh={triggerRefresh}
              showNotification={showNotification}
              onEdit={() => handleEditClick(summary)}
              onTrend={() => handleTrendClick(summary)}
              onHistory={() => handleHistoryClick(summary)}
            />
          ))}
        </tbody>
      </table>

      {isEditModalOpen && (
        <EndpointModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
          initialData={editData}
          title="Edit Endpoint"
        />
      )}

      <TrendModal
        isOpen={isTrendModalOpen}
        onClose={() => setIsTrendModalOpen(false)}
        apiName={trendApiName}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        apiName={historyApiName}
      />
    </div>
  );
}