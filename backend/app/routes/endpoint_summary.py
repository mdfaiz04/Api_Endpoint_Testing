from fastapi import APIRouter
from app.schemas.endpoint_summary import EndpointSummary
from app.services.endpoint_summary_service import get_endpoint_summaries

router = APIRouter()


@router.get("/endpoint-summary", response_model=list[EndpointSummary])
def endpoint_summary():
    return get_endpoint_summaries()
