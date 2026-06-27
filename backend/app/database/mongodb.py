from pymongo import MongoClient

# MongoDB connection setup
client = MongoClient("mongodb://localhost:27017")
db = client["api_endpoint_testing"]

# Collections
endpoints_collection = db["endpoints"]
test_logs_collection = db["test_logs"]
api_groups_collection = db["api_groups"]
scheduler_configs_collection = db["scheduler_configs"]
alert_states_collection = db["alert_states"]
notification_recipients_collection = db["notification_recipients"]
