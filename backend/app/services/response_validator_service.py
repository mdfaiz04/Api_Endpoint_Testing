def validate_response(actual_response: dict, expected_response: dict) -> dict:
    if not expected_response:
        return {
            "passed": True,
            "message": "No validation rules defined"
        }
    
    for key, expected_value in expected_response.items():
        if expected_value is True:
            if key not in actual_response:
                return {
                    "passed": False,
                    "message": f"Field '{key}' missing"
                }
        else:
            if key not in actual_response or actual_response[key] != expected_value:
                return {
                    "passed": False,
                    "message": f"Field '{key}' mismatch"
                }
                
    return {
        "passed": True,
        "message": "Validation successful"
    }
