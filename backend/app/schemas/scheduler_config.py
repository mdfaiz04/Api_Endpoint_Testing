from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

class SchedulerConfig(BaseModel):
    name: str = Field(..., example="Hourly Check")
    enabled: bool = Field(default=True)
    interval_seconds: int = Field(..., example=3600)
    target_type: Literal["API", "GROUP", "REPORT"] = Field(..., example="GROUP")
    target_name: str = Field(..., example="LLM Providers")
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None
    created_at: Optional[datetime] = None

class SchedulerConfigCreate(BaseModel):
    name: str = Field(..., example="Hourly Check")
    enabled: bool = Field(default=True)
    interval_seconds: int = Field(..., example=3600)
    target_type: Literal["API", "GROUP", "REPORT"] = Field(..., example="GROUP")
    target_name: str = Field(..., example="LLM Providers")
