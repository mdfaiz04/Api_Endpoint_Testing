from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_apis: int
    passed_apis: int
    failed_apis: int
    running_tests: int
    success_rate: float
    average_response_time_ms: float