import axios from "axios";
import { EndpointSummary } from "../types/endpoint-summary";
import { API_BASE_URL } from "./config";

export async function getEndpointSummaries(): Promise<EndpointSummary[]> {
  const response = await axios.get(
    `${API_BASE_URL}/endpoint-summary`
  );

  return response.data;
}
