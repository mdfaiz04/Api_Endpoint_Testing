// Base URL of the FastAPI backend. Set NEXT_PUBLIC_API_BASE_URL to point the dashboard elsewhere.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8000";
