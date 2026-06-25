from fastapi import APIRouter, HTTPException
from app.schemas.api_endpoint import ApiEndpoint
from app.services.api_endpoint_service import (
    create_endpoint,
    get_all_endpoints,
    delete_endpoint,
    update_endpoint,
)

router = APIRouter()


@router.post("/api-endpoints")
def add_endpoint(endpoint: ApiEndpoint):
    return create_endpoint(endpoint)


@router.get("/api-endpoints")
def list_endpoints():
    return get_all_endpoints()


@router.delete("/api-endpoints/{name}")
def remove_endpoint(name: str):
    success = delete_endpoint(name)
    if not success:
        raise HTTPException(status_code=404, detail="Endpoint not found")
    return {"message": "Endpoint deleted successfully"}


@router.put("/api-endpoints/{name}")
def modify_endpoint(name: str, endpoint: ApiEndpoint):
    success = update_endpoint(name, endpoint)
    if not success:
        raise HTTPException(status_code=404, detail="Endpoint not found")
    return {"message": "Endpoint updated successfully"}
