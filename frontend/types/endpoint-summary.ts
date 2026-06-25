export interface EndpointSummary {
  name: string;
  status: string;
  response_time_ms: number;
  success_rate: number;
  last_tested: string | null;
  last_message?: string;
}
