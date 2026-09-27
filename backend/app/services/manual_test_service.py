import time
import httpx
from datetime import datetime
from app.services.test_log_service import add_test_log
from app.services.response_validator_service import validate_response
from app.services.notification_service import process_test_result_for_notification


def describe_request_error(error: httpx.HTTPError) -> str:
    if isinstance(error, httpx.TimeoutException):
        return "Request timed out"
    return f"Request failed: {type(error).__name__}"


async def run_manual_test(endpoint: dict):
    start = time.time()
    response = None
    request_error = None

    try:
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
    except httpx.HTTPError as e:
        # Unreachable endpoint (DNS failure, refused connection, timeout) counts as a failed test
        request_error = e

    end = time.time()
    response_time_ms = round((end - start) * 1000, 2)

    if response is None:
        status_code = 0
        response_json = {}
        validation_result = {
            "passed": False,
            "message": describe_request_error(request_error)
        }
    else:
        status_code = response.status_code
        try:
            response_json = response.json()
        except Exception:
            response_json = {}

        validation_result = validate_response(
            actual_response=response_json,
            expected_response=endpoint.get("expected_response")
        )

    if not validation_result.get("passed"):
        try:
            process_test_result_for_notification(
                endpoint=endpoint,
                validation_result=validation_result,
                response_time_ms=response_time_ms,
                response_status_code=status_code
            )
        except Exception as e:
            import logging
            logging.getLogger(__name__).error(f"Error in notification service: {e}")

    add_test_log({
        "api_name": endpoint["name"],
        "status_code": status_code,
        "response_time_ms": response_time_ms,
        "passed": validation_result["passed"],
        "message": validation_result["message"],
        "actual_response": response_json,
        "tested_at": datetime.now()
    })

    return {
        "status_code": status_code,
        "response_time_ms": response_time_ms,
        "passed": validation_result["passed"],
        "message": validation_result["message"],
        "actual_response": response_json
    }
