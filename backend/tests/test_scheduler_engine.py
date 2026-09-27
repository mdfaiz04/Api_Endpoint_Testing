import asyncio
from datetime import timedelta

import pytest
from apscheduler.schedulers.background import BackgroundScheduler

from app.services import health_report_service, scheduler_engine


class FakeCollection:
    def __init__(self):
        self.updates = []

    def update_one(self, query, update):
        self.updates.append((query, update))


@pytest.fixture
def scheduler(monkeypatch):
    fresh = BackgroundScheduler()  # never started, so jobs stay pending and nothing runs
    monkeypatch.setattr(scheduler_engine, "_scheduler", fresh)
    return fresh


@pytest.fixture
def collection(monkeypatch):
    fake = FakeCollection()
    monkeypatch.setattr(scheduler_engine, "scheduler_configs_collection", fake)
    return fake


def test_only_enabled_schedules_are_registered(monkeypatch, scheduler):
    monkeypatch.setattr(
        scheduler_engine,
        "get_all_scheduler_configs",
        lambda: [
            {"name": "Every 30s", "enabled": True, "interval_seconds": 30,
             "target_type": "API", "target_name": "Auth"},
            {"name": "Every 2h", "enabled": True, "interval_value": 2, "interval_unit": "hours",
             "target_type": "GROUP", "target_name": "Core"},
            {"name": "Paused", "enabled": False, "interval_seconds": 60,
             "target_type": "API", "target_name": "Auth"},
            {"name": "Default interval", "enabled": True,
             "target_type": "REPORT", "target_name": "Automated Health Report"},
        ],
    )

    scheduler_engine.load_scheduler_jobs()

    assert {job.id: job.trigger.interval for job in scheduler.get_jobs()} == {
        "Every 30s": timedelta(seconds=30),
        "Every 2h": timedelta(hours=2),
        "Default interval": timedelta(seconds=60),
    }


def test_reload_replaces_previously_registered_jobs(monkeypatch, scheduler):
    configs = [{"name": "A", "enabled": True, "interval_seconds": 15, "target_type": "API", "target_name": "x"}]
    monkeypatch.setattr(scheduler_engine, "get_all_scheduler_configs", lambda: configs)
    scheduler_engine.load_scheduler_jobs()

    configs[0] = {"name": "B", "enabled": True, "interval_seconds": 15, "target_type": "API", "target_name": "x"}
    scheduler_engine.load_scheduler_jobs()

    assert [job.id for job in scheduler.get_jobs()] == ["B"]


def test_group_schedule_tests_each_member_and_records_the_next_run(monkeypatch, collection):
    tested = []

    async def fake_run(endpoint):
        tested.append(endpoint["name"])

    monkeypatch.setattr(scheduler_engine, "run_manual_test", fake_run)
    monkeypatch.setattr(scheduler_engine, "get_api_group", lambda name: {"apis": ["Auth", "Search", "Deleted"]})
    monkeypatch.setattr(
        scheduler_engine, "get_all_endpoints", lambda: [{"name": "Auth"}, {"name": "Search"}, {"name": "Other"}]
    )

    config = {"name": "Core every 5m", "target_type": "GROUP", "target_name": "Core",
              "interval_value": 5, "interval_unit": "minutes"}
    asyncio.run(scheduler_engine.execute_schedule(config))

    assert tested == ["Auth", "Search"]  # members that no longer exist are skipped
    [(query, update)] = collection.updates
    assert query == {"name": "Core every 5m"}
    assert update["$set"]["next_run"] - update["$set"]["last_run"] == timedelta(minutes=5)


def test_one_failing_endpoint_does_not_stop_the_schedule(monkeypatch, collection):
    tested = []

    async def flaky_run(endpoint):
        tested.append(endpoint["name"])
        if endpoint["name"] == "Auth":
            raise RuntimeError("boom")

    monkeypatch.setattr(scheduler_engine, "run_manual_test", flaky_run)
    monkeypatch.setattr(scheduler_engine, "get_api_group", lambda name: {"apis": ["Auth", "Search"]})
    monkeypatch.setattr(scheduler_engine, "get_all_endpoints", lambda: [{"name": "Auth"}, {"name": "Search"}])

    asyncio.run(scheduler_engine.execute_schedule(
        {"name": "Core", "target_type": "GROUP", "target_name": "Core", "interval_seconds": 60}
    ))

    assert tested == ["Auth", "Search"]
    assert len(collection.updates) == 1


def test_report_schedule_generates_the_health_report(monkeypatch, collection):
    calls = []
    monkeypatch.setattr(health_report_service, "generate_health_report", lambda: calls.append("report"))

    asyncio.run(scheduler_engine.execute_schedule(
        {"name": "Daily report", "target_type": "REPORT", "target_name": "Automated Health Report",
         "interval_value": 1, "interval_unit": "days"}
    ))

    assert calls == ["report"]
    assert len(collection.updates) == 1
