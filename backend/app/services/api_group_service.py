from app.repositories import api_group_repository
from app.schemas.api_group import ApiGroupCreate

def get_all_api_groups():
    return api_group_repository.get_all_api_groups()

def get_api_group(name: str):
    return api_group_repository.get_api_group_by_name(name)

def create_api_group(group: ApiGroupCreate):
    existing = api_group_repository.get_api_group_by_name(group.name)
    if existing:
        raise ValueError("API Group with this name already exists")
    api_group_repository.add_api_group(group)
    return True

def update_api_group(name: str, group: ApiGroupCreate):
    return api_group_repository.update_api_group(name, group)

def delete_api_group(name: str):
    return api_group_repository.delete_api_group(name)
