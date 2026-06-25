import axios from "axios";

export interface SchedulerConfig {
  name: string;
  enabled: boolean;
  interval_seconds: number;
  target_type: "API" | "GROUP";
  target_name: string;
  last_run?: string;
  next_run?: string;
  created_at?: string;
}

const API_BASE_URL = "http://localhost:8000";

export const getSchedulerConfigs = async (): Promise<SchedulerConfig[]> => {
  const response = await axios.get(`${API_BASE_URL}/scheduler-configs`);
  return response.data;
};

export const createSchedulerConfig = async (config: SchedulerConfig): Promise<void> => {
  await axios.post(`${API_BASE_URL}/scheduler-configs`, config);
};

export const updateSchedulerConfig = async (name: string, config: SchedulerConfig): Promise<void> => {
  await axios.put(`${API_BASE_URL}/scheduler-configs/${encodeURIComponent(name)}`, config);
};

export const deleteSchedulerConfig = async (name: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/scheduler-configs/${encodeURIComponent(name)}`);
};
