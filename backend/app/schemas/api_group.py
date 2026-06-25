from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ApiGroup(BaseModel):
    name: str = Field(..., example="LLM Providers")
    description: str = Field(..., example="Generative AI providers")
    apis: List[str] = Field(..., example=["OpenAI", "Gemini", "Anthropic"])
    created_at: Optional[datetime] = None

class ApiGroupCreate(BaseModel):
    name: str = Field(..., example="LLM Providers")
    description: str = Field(..., example="Generative AI providers")
    apis: List[str] = Field(..., example=["OpenAI", "Gemini", "Anthropic"])
