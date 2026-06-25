from app.services.api_endpoint_service import get_all_endpoints
from app.services.test_log_service import get_test_logs
from app.schemas.endpoint_summary import EndpointSummary


def get_endpoint_summaries() -> list[EndpointSummary]:
    api_endpoints = get_all_endpoints()
    test_logs = get_test_logs()
    summaries = []

    for endpoint in api_endpoints:
        name = endpoint["name"]

        # Filter test logs for this endpoint
        logs = [log for log in test_logs if log["api_name"] == name]

        if len(logs) == 0:
            summaries.append(EndpointSummary(
                name=name,
                status="NOT_TESTED",
                response_time_ms=0,
                success_rate=0,
                last_tested=None,
                last_message=None,
            ))
            continue

        # Sort by tested_at descending to get the latest log
        sorted_logs = sorted(logs, key=lambda l: l["tested_at"], reverse=True)
        latest_log = sorted_logs[0]

        # Status: PASS if latest test passed=True, FAIL if False
        status = "PASS" if latest_log.get("passed") else "FAIL"

        # Response time: from the latest test
        response_time_ms = latest_log["response_time_ms"]

        # Last tested: latest tested_at
        last_tested = latest_log["tested_at"]

        # Last message: from the latest test
        last_message = latest_log.get("message")

        # Success rate: successful_tests / total_tests * 100
        successful_tests = sum(1 for log in logs if log.get("passed"))
        total_tests = len(logs)
        success_rate = round(successful_tests / total_tests * 100, 2)

        summaries.append(EndpointSummary(
            name=name,
            status=status,
            response_time_ms=response_time_ms,
            success_rate=success_rate,
            last_tested=last_tested,
            last_message=last_message,
        ))

    return summaries
