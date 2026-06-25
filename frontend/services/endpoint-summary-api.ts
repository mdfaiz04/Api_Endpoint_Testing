import axios from "axios";
import { EndpointSummary } from "../types/endpoint-summary";

const API_BASE_URL = "http://localhost:8000";

export async function getEndpointSummaries(): Promise<EndpointSummary[]> {
  const response = await axios.get(
    `${API_BASE_URL}/endpoint-summary`
  );

  return response.data;
}
