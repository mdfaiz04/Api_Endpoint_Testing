import axios from "axios";
import { DashboardStats } from "../types/dashboard";
import { API_BASE_URL } from "./config";

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await axios.get(
    `${API_BASE_URL}/dashboard-stats`
  );

  return response.data;
}

