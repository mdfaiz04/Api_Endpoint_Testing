from datetime import datetime
from app.database.mongodb import alert_states_collection

def get_alert_state(api_name: str) -> dict:
    """
    Retrieves the current alert state for the given API name.
    """
    return alert_states_collection.find_one({"api_name": api_name}, {"_id": 0})

def update_last_alert_sent(api_name: str, timestamp: datetime):
    """
    Updates or inserts the last alert sent timestamp for the given API.
    Upsert guarantees we never create duplicate api_name entries.
    """
    alert_states_collection.update_one(
        {"api_name": api_name},
        {"$set": {"last_alert_sent_at": timestamp}},
        upsert=True
    )
