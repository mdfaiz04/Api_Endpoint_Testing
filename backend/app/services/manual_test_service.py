import time
import httpx
from datetime import datetime
from app.services.test_log_service import add_test_log
from app.services.response_validator_service import validate_response


async def run_manual_test(endpoint: dict):
    start = time.time()

    async with httpx.AsyncClient() as client:
        if endpoint.get("method", "GET").upper() == "POST":
            response = await client.post(
                endpoint["url"],
                headers=endpoint.get("headers"),
                params=endpoint.get("query_params"),
                json=endpoint.get("request_body"),
                timeout=endpoint.get("timeout_seconds", 10.0)
            )
        else:
            response = await client.get(
                endpoint["url"],
                headers=endpoint.get("headers"),
                params=endpoint.get("query_params"),
                timeout=endpoint.get("timeout_seconds", 10.0)
            )

    end = time.time()
    response_time_ms = round((end - start) * 1000, 2)

    try:
        response_json = response.json()
    except Exception:
        response_json = {}

    validation_result = validate_response(
        actual_response=response_json,
        expected_response=endpoint.get("expected_response")
    )

    add_test_log({
        "api_name": endpoint["name"],
        "status_code": response.status_code,
        "response_time_ms": response_time_ms,
        "passed": validation_result["passed"],
        "message": validation_result["message"],
        "actual_response": response_json,
        "tested_at": datetime.now()
    })

    return {
        "status_code": response.status_code,
        "response_time_ms": response_time_ms,
        "passed": validation_result["passed"],
        "message": validation_result["message"],
        "actual_response": response_json
    }