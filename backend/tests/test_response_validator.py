import pytest

from app.services.response_validator_service import validate_response


@pytest.mark.parametrize("expected", [None, {}])
def test_passes_when_no_rules_are_defined(expected):
    assert validate_response({"anything": 1}, expected) == {
        "passed": True,
        "message": "No validation rules defined",
    }


@pytest.mark.parametrize(
    "actual, expected",
    [
        ({"id": 42}, {"id": True}),  # presence rule
        ({"status": "ok", "code": 200}, {"status": "ok", "code": 200}),  # exact values
        ({"completed": False, "count": 0}, {"completed": False, "count": 0}),  # falsy values
        ({"meta": {"page": 1}}, {"meta": {"page": 1}}),  # nested objects
    ],
)
def test_passes_when_all_rules_match(actual, expected):
    assert validate_response(actual, expected) == {
        "passed": True,
        "message": "Validation successful",
    }


@pytest.mark.parametrize(
    "actual, expected, message",
    [
        ({"name": "x"}, {"id": True}, "Field 'id' missing"),
        ({"status": "degraded"}, {"status": "ok"}, "Field 'status' mismatch"),
        ({}, {"status": "ok"}, "Field 'status' mismatch"),
        ({"completed": True}, {"completed": False}, "Field 'completed' mismatch"),
        ({"meta": {"page": 2}}, {"meta": {"page": 1}}, "Field 'meta' mismatch"),
    ],
)
def test_fails_with_the_reason(actual, expected, message):
    assert validate_response(actual, expected) == {"passed": False, "message": message}


def test_reports_the_first_failing_rule():
    result = validate_response({"a": 1}, {"a": True, "b": True, "c": "x"})
    assert result["message"] == "Field 'b' missing"
