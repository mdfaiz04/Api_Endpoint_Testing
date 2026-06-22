from pydantic import BaseModel


class ApiEndpoint(BaseModel):
    name: str
    url: str
    method: str