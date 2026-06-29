from fastapi import APIRouter
from app.services.dashboard_service import get_dashboard_stats, get_recent_activities

router = APIRouter()


@router.get("/dashboard-stats")
async def dashboard_stats():
    return await get_dashboard_stats()

@router.get("/recent-activities")
def recent_activities():
    return get_recent_activities()