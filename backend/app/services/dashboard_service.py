from app.services.api_endpoint_service import get_all_endpoints
from app.services.test_log_service import get_test_logs
from app.repositories import test_log_repository


async def get_dashboard_stats():
    api_endpoints = get_all_endpoints()
    test_logs = get_test_logs()
    total_apis = len(api_endpoints)

    latest_logs = {}
    for log in test_logs:
        api_name = log["api_name"]
        if api_name not in latest_logs or log["tested_at"] > latest_logs[api_name]["tested_at"]:
            latest_logs[api_name] = log

    passed_apis = 0
    failed_apis = 0
    avg_response_time = 0.0
    success_rate = 0.0

    if latest_logs:
        passed_apis = sum(1 for log in latest_logs.values() if log.get("passed"))
        failed_apis = sum(1 for log in latest_logs.values() if not log.get("passed"))

        avg_response_time = round(
            sum(log["response_time_ms"] for log in latest_logs.values()) / len(latest_logs),
            2
        )

    if total_apis > 0:
        success_rate = round((passed_apis / total_apis) * 100, 2)

    return {
        "total_apis": total_apis,
        "passed_apis": passed_apis,
        "failed_apis": failed_apis,
        "running_tests": 0,
        "success_rate": success_rate,
        "average_response_time_ms": avg_response_time
    }

def get_recent_activities():
    return test_log_repository.get_recent_activities(5)
