from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.api_group import ApiGroup, ApiGroupCreate
from app.services import api_group_service

router = APIRouter()

@router.get("/api-groups", response_model=List[ApiGroup])
def get_api_groups():
    return api_group_service.get_all_api_groups()

@router.post("/api-groups")
def create_api_group(group: ApiGroupCreate):
    try:
        api_group_service.create_api_group(group)
        return {"message": "API Group created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/api-groups/{name}")
def update_api_group(name: str, group: ApiGroupCreate):
    updated = api_group_service.update_api_group(name, group)
    if not updated:
        raise HTTPException(status_code=404, detail="API Group not found")
    return {"message": "API Group updated successfully"}

@router.delete("/api-groups/{name}")
def delete_api_group(name: str):
    deleted = api_group_service.delete_api_group(name)
    if not deleted:
        raise HTTPException(status_code=404, detail="API Group not found")
    return {"message": "API Group deleted successfully"}
