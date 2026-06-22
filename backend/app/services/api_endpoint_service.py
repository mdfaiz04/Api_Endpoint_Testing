from app.schemas.api_endpoint import ApiEndpoint

api_endpoints = []


def create_endpoint(endpoint: ApiEndpoint):
    api_endpoints.append(endpoint)
    return endpoint


def get_all_endpoints():
    return api_endpoints