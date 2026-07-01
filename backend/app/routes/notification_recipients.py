from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.notification_recipient import (
    NotificationRecipientCreate,
    NotificationRecipientUpdate,
    NotificationRecipientResponse
)
from app.services import notification_recipient_service

router = APIRouter(
    prefix="/api/v1/notification-recipients",
    tags=["Notification Recipients"]
)

@router.post("/", response_model=NotificationRecipientResponse, status_code=status.HTTP_201_CREATED)
def create_recipient(recipient: NotificationRecipientCreate):
    try:
        return notification_recipient_service.create_recipient(recipient)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[NotificationRecipientResponse])
def get_all_recipients():
    return notification_recipient_service.get_all_recipients()

@router.get("/{recipient_id}", response_model=NotificationRecipientResponse)
def get_recipient_by_id(recipient_id: str):
    try:
        return notification_recipient_service.get_recipient_by_id(recipient_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{recipient_id}", response_model=NotificationRecipientResponse)
def update_recipient(recipient_id: str, recipient: NotificationRecipientUpdate):
    try:
        return notification_recipient_service.update_recipient(recipient_id, recipient)
    except ValueError as e:
        if "already exists" in str(e):
            raise HTTPException(status_code=400, detail=str(e))
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{recipient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipient(recipient_id: str):
    try:
        notification_recipient_service.delete_recipient(recipient_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
