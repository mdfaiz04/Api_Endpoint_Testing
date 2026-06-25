from pydantic import BaseModel
from datetime import datetime


class TestLog(BaseModel):
    api_name: str
    status_code: int
    response_time_ms: float
    passed: bool
    message: str
    actual_response: dict
    tested_at: datetime