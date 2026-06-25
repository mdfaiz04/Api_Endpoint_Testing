from fastapi import APIRouter, HTTPException
from app.services.manual_test_service import run_manual_test
from app.services.api_endpoint_service import get_all_endpoints
from app.services.endpoint_summary_service import get_endpoint_summaries

router = APIRouter()


@router.get("/manual-test")
async def manual_test(name: str):
    endpoints = get_all_endpoints()

    endpoint = next(
        (ep for ep in endpoints if ep["name"] == name),
        None
    )

    if not endpoint:
        raise HTTPException(
            status_code=404,
            detail="Endpoint not found"
        )

    return await run_manual_test(endpoint)


@router.get("/manual-test-all")
async def manual_test_all():
    endpoints = get_all_endpoints()
    results = []

    for endpoint in endpoints:
        result = await run_manual_test(endpoint)
        results.append({
            "api_name": endpoint["name"],
            "status_code": result["status_code"],
            "response_time_ms": result["response_time_ms"],
            "passed": result["passed"],
            "message": result["message"]
        })

    return results


@router.get("/manual-test-failed")
async def manual_test_failed():
    endpoints = get_all_endpoints()
    summaries = get_endpoint_summaries()
    
    # Identify which endpoints currently have status FAIL
    failed_names = {s.name for s in summaries if s.status == "FAIL"}
    
    results = []
    for endpoint in endpoints:
        if endpoint["name"] in failed_names:
            result = await run_manual_test(endpoint)
            results.append({
                "api_name": endpoint["name"],
                "status_code": result["status_code"],
                "response_time_ms": result["response_time_ms"],
                "passed": result["passed"],
                "message": result["message"]
            })

    return results