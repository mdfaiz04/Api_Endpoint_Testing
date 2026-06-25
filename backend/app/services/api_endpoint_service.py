from app.schemas.api_endpoint import ApiEndpoint
from app.repositories import endpoint_repository


def create_endpoint(endpoint: ApiEndpoint):
    endpoint_repository.create_endpoint(endpoint)
    return endpoint


def get_all_endpoints():
    return endpoint_repository.get_all_endpoints()


def delete_endpoint(name: str):
    return endpoint_repository.delete_endpoint(name)


def update_endpoint(name: str, endpoint: ApiEndpoint):
    return endpoint_repository.update_endpoint(name, endpoint)
