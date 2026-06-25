"use client";

import { useEffect, useState } from "react";
import { DashboardStats } from "../types/dashboard";
import { getDashboardStats } from "../services/dashboard-api";

export function useDashboardStats(refreshKey: number = 0) {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        // Null protection
        if (!data) {
           setStats({ total_apis: 0, passed_apis: 0, failed_apis: 0, running_tests: 0, success_rate: 0, average_response_time_ms: 0 });
        } else {
           setStats(data);
        }
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
        setStats({ total_apis: 0, passed_apis: 0, failed_apis: 0, running_tests: 0, success_rate: 0, average_response_time_ms: 0 });
      }
    }

    loadStats();
  }, [refreshKey]);

  return stats;
}