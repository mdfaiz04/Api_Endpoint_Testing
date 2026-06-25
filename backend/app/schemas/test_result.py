from pydantic import BaseModel

class TestResult(BaseModel):
    status_code: int
    response_time_ms: float
    healthy: bool