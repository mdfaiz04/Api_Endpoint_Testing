export interface DashboardStats {
  total_apis: number;
  passed_apis: number;
  failed_apis: number;
  running_tests: number;
  success_rate: number;
  average_response_time_ms: number;
}