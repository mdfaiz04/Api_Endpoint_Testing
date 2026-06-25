from fastapi import APIRouter
from app.services.test_log_service import get_test_logs, get_response_time_history, get_status_history

router = APIRouter()


@router.get("/test-logs")
def test_logs():
    return get_test_logs()

@router.get("/response-time-history/{name}")
def response_time_history(name: str):
    return get_response_time_history(name)

@router.get("/status-history/{name}")
def status_history(name: str):
    return get_status_history(name)