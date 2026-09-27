import pytest

from app.schemas.endpoint_summary import EndpointSummary
from app.services import health_report_service


def summary(name, status, response_time_ms=100.0, message=None):
    return EndpointSummary(
        name=name,
        status=status,
        response_time_ms=response_time_ms,
        success_rate=100.0,
        last_tested=None,
        last_message=message,
    )


@pytest.fixture
def report(monkeypatch):
    state = {"summaries": [], "users": [], "sent": []}
    monkeypatch.setattr(health_report_service, "get_endpoint_summaries", lambda: state["summaries"])
    monkeypatch.setattr(health_report_service, "get_active_notification_users", lambda: state["users"])
    monkeypatch.setattr(
        health_report_service,
        "send_email_via_resend",
        lambda to_address, subject, html_content: state["sent"].append(to_address),
    )
    return state


def test_report_aggregates_endpoint_health(report):
    report["summaries"] = [
        summary("Auth", "PASS", 100.0),
        summary("Search", "PASS", 300.0),
        summary("Billing", "FAIL", 200.0, "Field 'status' mismatch"),
        summary("Legacy", "NOT_TESTED", 0.0),
    ]

    subject, html = health_report_service.generate_health_report()

    assert subject == "📊 API Health Report: 2/4 Systems Operational"
    assert "200.00 ms" in html  # average latency ignores endpoints that were never tested
    assert "Billing" in html
    assert "Field 'status' mismatch" in html


def test_all_healthy_report(report):
    report["summaries"] = [summary("Auth", "PASS"), summary("Search", "PASS")]

    subject, html = health_report_service.generate_health_report()

    assert subject == "📊 API Health Report: 2/2 Systems Operational"
    assert "All Monitored APIs are Operational!" in html


@pytest.mark.parametrize(
    "statuses, color",
    [
        (["PASS", "PASS"], "#28a745"),  # all operational -> green
        (["PASS", "FAIL"], "#ffc107"),  # partial outage -> amber
        (["FAIL", "FAIL"], "#dc3545"),  # full outage -> red
    ],
)
def test_header_color_reflects_severity(report, statuses, color):
    report["summaries"] = [summary(f"api-{i}", status) for i, status in enumerate(statuses)]

    _, html = health_report_service.generate_health_report()

    assert f"background-color: {color}" in html


def test_report_is_sent_to_each_active_recipient(report):
    report["summaries"] = [summary("Auth", "PASS")]
    report["users"] = [
        {"name": "Ops", "email": "ops@example.com"},
        {"name": "CTO", "email": "cto@example.com"},
        {"name": "No email on file"},
    ]

    health_report_service.generate_health_report()

    assert report["sent"] == ["ops@example.com", "cto@example.com"]
