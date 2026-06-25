export interface ApiEndpoint {
  name: string;
  url: string;
  method: string;
  headers?: Record<string, any>;
  query_params?: Record<string, any>;
  request_body?: Record<string, any>;
  expected_response?: Record<string, any>;
  timeout_seconds?: number;
}