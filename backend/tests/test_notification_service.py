from datetime import datetime, timedelta, timezone

import pytest

from app.services import notification_service

ENDPOINT = {"name": "Payments API", "url": "https://pay.example.com/health", "method": "get"}
FAILED = {"passed": False, "message": "Field 'status' mismatch"}


@pytest.fixture
def alerting(monkeypatch):
    state = {
        "alert_state": None,
        "users": [{"name": "On-call", "email": "oncall@example.com"}],
        "send_result": {"id": "email_123"},
        "sent": [],
        "recorded": [],
    }

    def fake_send(to_address, subject, html_content):
        state["sent"].append({"to": to_address, "subject": subject, "html": html_content})
        return state["send_result"]

    monkeypatch.setattr(notification_service, "get_alert_state", lambda api_name: state["alert_state"])
    monkeypatch.setattr(notification_service, "get_active_notification_users", lambda: state["users"])
    monkeypatch.setattr(
        notification_service,
        "update_last_alert_sent",
        lambda api_name, timestamp: state["recorded"].append((api_name, timestamp)),
    )
    monkeypatch.setattr(notification_service, "send_email_via_resend", fake_send)
    return state


def notify(result=FAILED):
    notification_service.process_test_result_for_notification(
        endpoint=ENDPOINT,
        validation_result=result,
        response_time_ms=123.4,
        response_status_code=502,
    )


def test_passing_result_sends_nothing(alerting):
    notify({"passed": True, "message": "Validation successful"})

    assert alerting["sent"] == []
    assert alerting["recorded"] == []


def test_first_failure_alerts_every_active_recipient(alerting):
    alerting["users"] = [
        {"name": "On-call", "email": "oncall@example.com"},
        {"name": "Team lead", "email": "lead@example.com"},
        {"name": "No email on file"},
    ]

    notify()

    assert [mail["to"] for mail in alerting["sent"]] == ["oncall@example.com", "lead@example.com"]
    assert alerting["sent"][0]["subject"] == "🚨 API Alert: Payments API FAILED"
    assert [api_name for api_name, _ in alerting["recorded"]] == ["Payments API"]


def test_alert_is_suppressed_during_the_cooldown(alerting):
    alerting["alert_state"] = {"last_alert_sent_at": datetime.now(timezone.utc) - timedelta(minutes=5)}

    notify()

    assert alerting["sent"] == []


def test_alert_fires_again_once_the_cooldown_expires(alerting):
    cooldown = notification_service.DEFAULT_ALERT_COOLDOWN_MINUTES
    alerting["alert_state"] = {
        "last_alert_sent_at": datetime.now(timezone.utc) - timedelta(minutes=cooldown + 1)
    }

    notify()

    assert len(alerting["sent"]) == 1


def test_naive_timestamps_from_mongo_are_treated_as_utc(alerting):
    recent_naive = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(minutes=1)
    alerting["alert_state"] = {"last_alert_sent_at": recent_naive}

    notify()

    assert alerting["sent"] == []


def test_no_active_recipients_means_no_alert(alerting):
    alerting["users"] = []

    notify()

    assert alerting["sent"] == []
    assert alerting["recorded"] == []


def test_cooldown_does_not_start_when_every_send_fails(alerting):
    alerting["send_result"] = None

    notify()

    assert len(alerting["sent"]) == 1
    assert alerting["recorded"] == []


def test_failure_email_contains_the_incident_details():
    html = notification_service.build_failure_email_html(
        endpoint=ENDPOINT, validation_result=FAILED, response_time_ms=123.4, response_status_code=502
    )

    for fragment in (
        "Payments API",
        "https://pay.example.com/health",
        "GET",
        "502",
        "123.4 ms",
        "Field 'status' mismatch",
    ):
        assert fragment in html


def test_failure_email_shows_no_response_for_unreachable_endpoints():
    html = notification_service.build_failure_email_html(
        endpoint=ENDPOINT, validation_result=FAILED, response_time_ms=10.0, response_status_code=0
    )

    assert "No response" in html
