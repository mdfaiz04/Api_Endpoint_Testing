from app.database.mongodb import endpoints_collection, test_logs_collection

if __name__ == "__main__":
    deleted_endpoints = endpoints_collection.delete_many({})
    deleted_logs = test_logs_collection.delete_many({})

    print("Database reset completed.")
    print(f"Endpoints deleted: {deleted_endpoints.deleted_count}")
    print(f"Logs deleted: {deleted_logs.deleted_count}")
