from fastapi.testclient import TestClient

from app.main import app
from app.routes import api_endpoints, manual_test
from app.routes import endpoint_summary as endpoint_summary_route
from app.schemas.endpoint_summary import EndpointSummary

# Used without a context manager, so the lifespan (scheduler + MongoDB) never starts.
client = TestClient(app)


def test_health():
    assert client.get("/health").json() == {"status": "healthy"}


def test_openapi_documents_the_api():
    spec = client.get("/openapi.json").json()

    assert spec["info"]["title"] == "API Endpoint Testing"
    assert {"/api-endpoints", "/manual-test", "/scheduler-configs", "/dashboard-stats"} <= set(spec["paths"])


def test_create_endpoint_rejects_an_incomplete_payload():
    response = client.post("/api-endpoints", json={"name": "Missing url and method"})

    assert response.status_code == 422


def test_scheduler_config_rejects_an_unknown_target_type():
    response = client.post(
        "/scheduler-configs", json={"name": "Nightly", "target_type": "WEBHOOK", "target_name": "x"}
    )

    assert response.status_code == 422


def test_manual_test_for_an_unknown_endpoint_returns_404(monkeypatch):
    monkeypatch.setattr(manual_test, "get_all_endpoints", lambda: [])

    response = client.get("/manual-test", params={"name": "ghost"})

    assert response.status_code == 404
    assert response.json()["detail"] == "Endpoint not found"


def test_run_all_returns_one_result_per_endpoint(monkeypatch):
    async def fake_run(endpoint):
        passed = endpoint["name"] != "Billing"
        return {"status_code": 200, "response_time_ms": 42.0, "passed": passed, "message": "ok"}

    monkeypatch.setattr(manual_test, "get_all_endpoints", lambda: [{"name": "Auth"}, {"name": "Billing"}])
    monkeypatch.setattr(manual_test, "run_manual_test", fake_run)

    results = client.get("/manual-test-all").json()

    assert [(r["api_name"], r["passed"]) for r in results] == [("Auth", True), ("Billing", False)]


def test_deleting_an_unknown_endpoint_returns_404(monkeypatch):
    monkeypatch.setattr(api_endpoints, "delete_endpoint", lambda name: False)

    assert client.delete("/api-endpoints/ghost").status_code == 404


def test_endpoint_summary_response_shape(monkeypatch):
    monkeypatch.setattr(
        endpoint_summary_route,
        "get_endpoint_summaries",
        lambda: [EndpointSummary(name="Auth", status="PASS", response_time_ms=87.5, success_rate=99.5,
                                 last_tested=None, last_message="Validation successful")],
    )

    assert client.get("/endpoint-summary").json() == [{
        "name": "Auth",
        "status": "PASS",
        "response_time_ms": 87.5,
        "success_rate": 99.5,
        "last_tested": None,
        "last_message": "Validation successful",
    }]


def test_cors_allows_the_dashboard_origin():
    response = client.options(
        "/health",
        headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"},
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"


def test_cors_rejects_unknown_origins():
    response = client.options(
        "/health",
        headers={"Origin": "https://evil.example", "Access-Control-Request-Method": "GET"},
    )

    assert response.status_code == 400
    assert "access-control-allow-origin" not in response.headers
