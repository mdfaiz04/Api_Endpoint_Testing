import asyncio
from datetime import datetime, timedelta

from app.services import dashboard_service, endpoint_summary_service

NOW = datetime(2026, 9, 1, 12, 0, 0)


def test_summary_uses_latest_run_and_historical_success_rate(monkeypatch):
    monkeypatch.setattr(
        endpoint_summary_service, "get_all_endpoints", lambda: [{"name": "Auth"}, {"name": "Search"}]
    )
    monkeypatch.setattr(
        endpoint_summary_service,
        "get_test_logs",
        lambda: [
            {"api_name": "Auth", "passed": True, "response_time_ms": 120.0,
             "tested_at": NOW - timedelta(minutes=10), "message": "Validation successful"},
            {"api_name": "Auth", "passed": False, "response_time_ms": 900.0,
             "tested_at": NOW, "message": "Field 'id' missing"},
            {"api_name": "Auth", "passed": True, "response_time_ms": 110.0,
             "tested_at": NOW - timedelta(minutes=20), "message": "Validation successful"},
        ],
    )

    auth, search = endpoint_summary_service.get_endpoint_summaries()

    assert auth.status == "FAIL"  # the latest run failed
    assert auth.response_time_ms == 900.0
    assert auth.last_message == "Field 'id' missing"
    assert auth.last_tested == NOW
    assert auth.success_rate == 66.67  # 2 of 3 runs passed

    assert search.status == "NOT_TESTED"
    assert search.success_rate == 0
    assert search.last_tested is None


def test_dashboard_stats_use_the_latest_run_per_api(monkeypatch):
    monkeypatch.setattr(
        dashboard_service,
        "get_all_endpoints",
        lambda: [{"name": "Auth"}, {"name": "Search"}, {"name": "Billing"}, {"name": "New"}],
    )
    monkeypatch.setattr(
        dashboard_service,
        "get_test_logs",
        lambda: [
            {"api_name": "Auth", "passed": False, "response_time_ms": 500.0, "tested_at": NOW - timedelta(hours=1)},
            {"api_name": "Auth", "passed": True, "response_time_ms": 100.0, "tested_at": NOW},
            {"api_name": "Search", "passed": True, "response_time_ms": 200.0, "tested_at": NOW},
            {"api_name": "Billing", "passed": False, "response_time_ms": 300.0, "tested_at": NOW},
        ],
    )

    stats = asyncio.run(dashboard_service.get_dashboard_stats())

    assert stats == {
        "total_apis": 4,
        "passed_apis": 2,
        "failed_apis": 1,
        "running_tests": 0,
        "success_rate": 50.0,  # 2 healthy out of 4 registered APIs
        "average_response_time_ms": 200.0,  # (100 + 200 + 300) / 3 latest runs
    }


def test_dashboard_stats_with_no_data(monkeypatch):
    monkeypatch.setattr(dashboard_service, "get_all_endpoints", lambda: [])
    monkeypatch.setattr(dashboard_service, "get_test_logs", lambda: [])

    stats = asyncio.run(dashboard_service.get_dashboard_stats())

    assert stats["total_apis"] == 0
    assert stats["success_rate"] == 0.0
    assert stats["average_response_time_ms"] == 0.0
