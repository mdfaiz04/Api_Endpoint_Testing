from app.database.mongodb import notification_recipients_collection
from bson import ObjectId
from datetime import datetime, timezone

def create_recipient(data: dict):
    data["created_at"] = datetime.now(timezone.utc)
    data["updated_at"] = data["created_at"]
    result = notification_recipients_collection.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return data

def get_all_recipients():
    recipients = list(notification_recipients_collection.find())
    for r in recipients:
        r["_id"] = str(r["_id"])
    return recipients

def get_active_notification_users():
    recipients = list(notification_recipients_collection.find({"is_active": True}))
    for r in recipients:
        r["_id"] = str(r["_id"])
    return recipients

def get_recipient_by_id(recipient_id: str):
    recipient = notification_recipients_collection.find_one({"_id": ObjectId(recipient_id)})
    if recipient:
        recipient["_id"] = str(recipient["_id"])
    return recipient

def get_recipient_by_email(email: str):
    recipient = notification_recipients_collection.find_one({"email": email})
    if recipient:
        recipient["_id"] = str(recipient["_id"])
    return recipient

def update_recipient(recipient_id: str, data: dict):
    data["updated_at"] = datetime.now(timezone.utc)
    notification_recipients_collection.update_one(
        {"_id": ObjectId(recipient_id)},
        {"$set": data}
    )
    return get_recipient_by_id(recipient_id)

def delete_recipient(recipient_id: str):
    notification_recipients_collection.delete_one({"_id": ObjectId(recipient_id)})
