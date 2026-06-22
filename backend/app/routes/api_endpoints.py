from fastapi import APIRouter
from app.schemas.api_endpoint import ApiEndpoint
from app.services.api_endpoint_service import (
    create_endpoint,
    get_all_endpoints,
)

router = APIRouter()


@router.post("/api-endpoints")
def add_endpoint(endpoint: ApiEndpoint):
    return create_endpoint(endpoint)


@router.get("/api-endpoints")
def list_endpoints():
    return get_all_endpoints()