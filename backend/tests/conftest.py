import os

# Tests never talk to a real database or email provider: every repository and Resend call
# is monkeypatched. These settings are a safety net in case something slips through.
os.environ["MONGO_URI"] = "mongodb://127.0.0.1:27017/?serverSelectionTimeoutMS=500"
os.environ["DATABASE_NAME"] = "api_endpoint_testing_test"
os.environ["RESEND_API_KEY"] = ""
