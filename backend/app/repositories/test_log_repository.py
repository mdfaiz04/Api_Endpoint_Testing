from app.database.mongodb import test_logs_collection

def add_test_log(log):
    """
    Insert a test log entry into the database.
    """
    # If it's a Pydantic model, convert to dict
    if hasattr(log, "model_dump"):
        data = log.model_dump()
    elif hasattr(log, "dict"):
        data = log.dict()
    else:
        data = dict(log)
        
    test_logs_collection.insert_one(data)


def get_all_test_logs():
    """
    Retrieve all test logs from the database.
    """
    # Exclude the MongoDB internal _id field from the results
    return list(test_logs_collection.find({}, {"_id": 0}))

def get_response_time_history(name: str):
    """
    Retrieve the most recent test logs for the specified API, limited to 20, sorted ascending by timestamp.
    """
    cursor = test_logs_collection.find(
        {"api_name": name},
        {"_id": 0, "tested_at": 1, "response_time_ms": 1}
    ).sort("tested_at", -1).limit(20)
    
    logs = list(cursor)
    logs.sort(key=lambda x: x["tested_at"])
    
    return [
        {
            "timestamp": log["tested_at"].isoformat() if hasattr(log["tested_at"], "isoformat") else str(log["tested_at"]),
            "response_time_ms": log["response_time_ms"]
        }
        for log in logs
    ]

def get_status_history(name: str):
    """
    Retrieve the latest 20 test logs for the specified API, sorted ascending by timestamp.
    Returns timestamp and passed status.
    """
    cursor = test_logs_collection.find(
        {"api_name": name},
        {"_id": 0, "tested_at": 1, "passed": 1}
    ).sort("tested_at", -1).limit(20)
    
    logs = list(cursor)
    logs.sort(key=lambda x: x["tested_at"])
    
    return [
        {
            "timestamp": log["tested_at"].isoformat() if hasattr(log["tested_at"], "isoformat") else str(log["tested_at"]),
            "passed": log["passed"]
        }
        for log in logs
    ]

def get_recent_activities(limit: int = 5):
    """
    Retrieve the most recent activities with enriched structure.
    """
    cursor = test_logs_collection.find(
        {},
        {"_id": 0, "api_name": 1, "passed": 1, "response_time_ms": 1, "status_code": 1, "message": 1, "tested_at": 1}
    ).sort("tested_at", -1).limit(limit)
    
    activities = []
    for log in cursor:
        activities.append({
            "api_name": log.get("api_name"),
            "passed": log.get("passed"),
            "response_time_ms": log.get("response_time_ms"),
            "status_code": log.get("status_code"),
            "message": log.get("message"),
            "tested_at": log["tested_at"].isoformat() if hasattr(log["tested_at"], "isoformat") else str(log["tested_at"])
        })
    return activities
