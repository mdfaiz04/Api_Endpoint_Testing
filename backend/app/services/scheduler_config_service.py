from app.repositories import scheduler_config_repository
from app.schemas.scheduler_config import SchedulerConfigCreate

def get_all_scheduler_configs():
    return scheduler_config_repository.get_all_scheduler_configs()

def get_scheduler_config(name: str):
    return scheduler_config_repository.get_scheduler_config_by_name(name)

def create_scheduler_config(config: SchedulerConfigCreate):
    existing = scheduler_config_repository.get_scheduler_config_by_name(config.name)
    if existing:
        raise ValueError("Scheduler Configuration with this name already exists")
    scheduler_config_repository.add_scheduler_config(config)
    return True

def update_scheduler_config(name: str, config: SchedulerConfigCreate):
    return scheduler_config_repository.update_scheduler_config(name, config)

def delete_scheduler_config(name: str):
    return scheduler_config_repository.delete_scheduler_config(name)
