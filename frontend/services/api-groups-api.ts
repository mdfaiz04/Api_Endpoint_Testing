import axios from "axios";

export interface ApiGroup {
  name: string;
  description: string;
  apis: string[];
  created_at?: string;
}

const API_BASE_URL = "http://localhost:8000";

export const getApiGroups = async (): Promise<ApiGroup[]> => {
  const response = await axios.get(`${API_BASE_URL}/api-groups`);
  return response.data;
};

export const createApiGroup = async (group: ApiGroup): Promise<void> => {
  await axios.post(`${API_BASE_URL}/api-groups`, group);
};

export const updateApiGroup = async (name: string, group: ApiGroup): Promise<void> => {
  await axios.put(`${API_BASE_URL}/api-groups/${encodeURIComponent(name)}`, group);
};

export const deleteApiGroup = async (name: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/api-groups/${encodeURIComponent(name)}`);
};
