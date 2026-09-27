from pymongo import MongoClient
from app.core.config import MONGO_URI, DATABASE_NAME

# MongoDB connection setup
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

# Collections
endpoints_collection = db["endpoints"]
test_logs_collection = db["test_logs"]
api_groups_collection = db["api_groups"]
scheduler_configs_collection = db["scheduler_configs"]
alert_states_collection = db["alert_states"]
notification_recipients_collection = db["notification_recipients"]
