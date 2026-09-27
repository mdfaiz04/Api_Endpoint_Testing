import axios from "axios";
import { ApiEndpoint } from "../types/api-endpoint";
import { API_BASE_URL } from "./config";

export async function getEndpoints(): Promise<ApiEndpoint[]> {
  const response = await axios.get(
    `${API_BASE_URL}/api-endpoints`
  );

  return response.data;
}

export async function deleteEndpoint(name: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/api-endpoints/${encodeURIComponent(name)}`);
}

export async function updateEndpoint(name: string, endpoint: ApiEndpoint): Promise<void> {
  await axios.put(`${API_BASE_URL}/api-endpoints/${encodeURIComponent(name)}`, endpoint);
}

export async function createEndpoint(endpoint: ApiEndpoint): Promise<void> {
  await axios.post(`${API_BASE_URL}/api-endpoints`, endpoint);
}
