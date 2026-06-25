from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class EndpointSummary(BaseModel):
    name: str
    status: str
    response_time_ms: float
    success_rate: float
    last_tested: Optional[datetime]
    last_message: Optional[str] = None
