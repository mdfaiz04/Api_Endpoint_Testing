import axios from "axios";
import { DashboardStats } from "../types/dashboard";

const API_BASE_URL = "http://localhost:8000";

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await axios.get(
    `${API_BASE_URL}/dashboard-stats`
  );

  return response.data;
}


export async function getStatusDistribution(): Promise<{healthy: number, warning: number, down: number, unknown: number}> {
  const response = await axios.get(
    `${API_BASE_URL}/status-distribution`
  );

  return response.data;
}
