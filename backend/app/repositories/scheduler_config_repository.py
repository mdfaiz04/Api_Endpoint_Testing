from app.database.mongodb import scheduler_configs_collection
from app.schemas.scheduler_config import SchedulerConfigCreate
from datetime import datetime
import pytz

def get_all_scheduler_configs():
    cursor = scheduler_configs_collection.find({}, {"_id": 0})
    return list(cursor)

def get_scheduler_config_by_name(name: str):
    return scheduler_configs_collection.find_one({"name": name}, {"_id": 0})

def add_scheduler_config(config: SchedulerConfigCreate):
    config_dict = config.model_dump()
    config_dict["created_at"] = datetime.now(pytz.utc)
    scheduler_configs_collection.insert_one(config_dict)
    return True

def update_scheduler_config(name: str, config: SchedulerConfigCreate):
    result = scheduler_configs_collection.update_one(
        {"name": name},
        {"$set": config.model_dump()}
    )
    return result.matched_count > 0

def delete_scheduler_config(name: str):
    result = scheduler_configs_collection.delete_one({"name": name})
    return result.deleted_count > 0
