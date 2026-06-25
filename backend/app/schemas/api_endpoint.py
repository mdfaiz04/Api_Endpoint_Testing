from pydantic import BaseModel


class ApiEndpoint(BaseModel):
    name: str
    url: str
    method: str
    headers: dict = {}
    query_params: dict = {}
    request_body: dict = {}
    expected_response: dict = {}
    timeout_seconds: int = 30