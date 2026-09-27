import asyncio
import json

import httpx
import pytest

from app.services import manual_test_service


@pytest.fixture
def recorded(monkeypatch):
    """Capture persisted logs and alert hand-offs instead of touching MongoDB or Resend."""
    calls = {"logs": [], "alerts": []}
    monkeypatch.setattr(manual_test_service, "add_test_log", calls["logs"].append)
    monkeypatch.setattr(
        manual_test_service,
        "process_test_result_for_notification",
        lambda **kwargs: calls["alerts"].append(kwargs),
    )
    return calls


def use_transport(monkeypatch, handler):
    """Route every httpx.AsyncClient the service creates through a mock transport."""
    real_client = httpx.AsyncClient
    monkeypatch.setattr(
        manual_test_service.httpx,
        "AsyncClient",
        lambda *args, **kwargs: real_client(*args, transport=httpx.MockTransport(handler), **kwargs),
    )


def endpoint(**overrides):
    config = {
        "name": "Users API",
        "url": "https://api.example.com/users/1",
        "method": "GET",
        "headers": {"Authorization": "Bearer token"},
        "query_params": {"verbose": "1"},
        "request_body": {},
        "expected_response": {"id": True},
        "timeout_seconds": 5,
    }
    config.update(overrides)
    return config


def run(config):
    return asyncio.run(manual_test_service.run_manual_test(config))


def test_passing_request_is_logged_without_an_alert(monkeypatch, recorded):
    def handler(request):
        assert request.method == "GET"
        assert request.headers["Authorization"] == "Bearer token"
        assert request.url.params["verbose"] == "1"
        return httpx.Response(200, json={"id": 1, "name": "Ada"})

    use_transport(monkeypatch, handler)
    result = run(endpoint())

    assert result["passed"] is True
    assert result["status_code"] == 200
    assert result["actual_response"] == {"id": 1, "name": "Ada"}
    assert result["response_time_ms"] >= 0
    assert recorded["alerts"] == []
    assert [log["api_name"] for log in recorded["logs"]] == ["Users API"]
    assert recorded["logs"][0]["passed"] is True


def test_post_request_sends_the_json_body(monkeypatch, recorded):
    def handler(request):
        assert request.method == "POST"
        assert json.loads(request.content) == {"title": "hello"}
        return httpx.Response(201, json={"id": 101})

    use_transport(monkeypatch, handler)
    result = run(endpoint(method="post", request_body={"title": "hello"}))

    assert result["passed"] is True
    assert result["status_code"] == 201


def test_failed_validation_triggers_an_alert(monkeypatch, recorded):
    use_transport(monkeypatch, lambda request: httpx.Response(200, json={"error": "not found"}))

    result = run(endpoint())

    assert result["passed"] is False
    assert result["message"] == "Field 'id' missing"
    assert len(recorded["alerts"]) == 1
    assert recorded["alerts"][0]["response_status_code"] == 200
    assert recorded["alerts"][0]["validation_result"]["message"] == "Field 'id' missing"
    assert recorded["logs"][0]["passed"] is False


def test_non_json_response_is_validated_as_an_empty_body(monkeypatch, recorded):
    use_transport(monkeypatch, lambda request: httpx.Response(503, text="Service Unavailable"))

    result = run(endpoint())

    assert result["status_code"] == 503
    assert result["actual_response"] == {}
    assert result["passed"] is False


def test_unreachable_endpoint_is_recorded_as_a_failure(monkeypatch, recorded):
    def handler(request):
        raise httpx.ConnectError("connection refused", request=request)

    use_transport(monkeypatch, handler)
    result = run(endpoint())

    assert result["passed"] is False
    assert result["status_code"] == 0
    assert result["message"] == "Request failed: ConnectError"
    assert len(recorded["alerts"]) == 1
    assert recorded["logs"][0]["status_code"] == 0


def test_timeout_is_recorded_as_a_failure(monkeypatch, recorded):
    def handler(request):
        raise httpx.ReadTimeout("timed out", request=request)

    use_transport(monkeypatch, handler)
    result = run(endpoint())

    assert result["passed"] is False
    assert result["message"] == "Request timed out"
    assert len(recorded["logs"]) == 1
