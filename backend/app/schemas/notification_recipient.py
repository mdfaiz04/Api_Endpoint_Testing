from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class NotificationRecipientBase(BaseModel):
    name: str = Field(..., example="DevOps Team")
    email: str = Field(..., example="devops@example.com")
    is_active: bool = Field(default=True)

class NotificationRecipientCreate(NotificationRecipientBase):
    pass

class NotificationRecipientUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None

class NotificationRecipientResponse(NotificationRecipientBase):
    id: str = Field(..., alias="_id")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        populate_by_name = True
