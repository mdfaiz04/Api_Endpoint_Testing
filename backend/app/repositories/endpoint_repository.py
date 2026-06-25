from app.database.mongodb import endpoints_collection

def create_endpoint(endpoint):
    """
    Insert a new endpoint into the database.
    """
    # If it's a Pydantic model, convert to dict
    if hasattr(endpoint, "model_dump"):
        data = endpoint.model_dump()
    elif hasattr(endpoint, "dict"):
        data = endpoint.dict()
    else:
        data = dict(endpoint)
        
    endpoints_collection.insert_one(data)


def get_all_endpoints():
    """
    Retrieve all endpoints from the database.
    """
    # Exclude the MongoDB internal _id field from the results
    return list(endpoints_collection.find({}, {"_id": 0}))


def find_endpoint_by_name(name: str):
    """
    Find a single endpoint by its unique name.
    """
    return endpoints_collection.find_one({"name": name}, {"_id": 0})


def delete_endpoint(name: str):
    """
    Delete an endpoint by its unique name.
    Returns True if an endpoint was deleted, False otherwise.
    """
    result = endpoints_collection.delete_one({"name": name})
    return result.deleted_count > 0


def update_endpoint(name: str, endpoint):
    """
    Update an endpoint by its unique name.
    Returns True if an endpoint was found and matched, False otherwise.
    """
    data = endpoint.model_dump()
    result = endpoints_collection.update_one(
        {"name": name},
        {"$set": data}
    )
    return result.matched_count > 0

