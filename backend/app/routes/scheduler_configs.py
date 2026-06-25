from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.scheduler_config import SchedulerConfig, SchedulerConfigCreate
from app.services import scheduler_config_service

router = APIRouter()

@router.get("/scheduler-configs", response_model=List[SchedulerConfig])
def get_scheduler_configs():
    return scheduler_config_service.get_all_scheduler_configs()

@router.post("/scheduler-configs")
def create_scheduler_config(config: SchedulerConfigCreate):
    try:
        scheduler_config_service.create_scheduler_config(config)
        return {"message": "Scheduler Config created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/scheduler-configs/{name}")
def update_scheduler_config(name: str, config: SchedulerConfigCreate):
    updated = scheduler_config_service.update_scheduler_config(name, config)
    if not updated:
        raise HTTPException(status_code=404, detail="Scheduler Config not found")
    return {"message": "Scheduler Config updated successfully"}

@router.delete("/scheduler-configs/{name}")
def delete_scheduler_config(name: str):
    deleted = scheduler_config_service.delete_scheduler_config(name)
    if not deleted:
        raise HTTPException(status_code=404, detail="Scheduler Config not found")
    return {"message": "Scheduler Config deleted successfully"}
