from app.database.mongodb import api_groups_collection
from app.schemas.api_group import ApiGroupCreate
from datetime import datetime
import pytz

def get_all_api_groups():
    cursor = api_groups_collection.find({}, {"_id": 0})
    return list(cursor)

def get_api_group_by_name(name: str):
    return api_groups_collection.find_one({"name": name}, {"_id": 0})

def add_api_group(group: ApiGroupCreate):
    group_dict = group.model_dump()
    group_dict["created_at"] = datetime.now(pytz.utc)
    api_groups_collection.insert_one(group_dict)
    return True

def update_api_group(name: str, group: ApiGroupCreate):
    result = api_groups_collection.update_one(
        {"name": name},
        {"$set": group.model_dump()}
    )
    return result.matched_count > 0

def delete_api_group(name: str):
    result = api_groups_collection.delete_one({"name": name})
    return result.deleted_count > 0
