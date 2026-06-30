import logging
from apscheduler.schedulers.background import BackgroundScheduler

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

_scheduler = None

def get_scheduler() -> BackgroundScheduler:
    global _scheduler
    if _scheduler is None:
        _scheduler = BackgroundScheduler()
    return _scheduler

def start_scheduler():
    scheduler = get_scheduler()
    if not scheduler.running:
        scheduler.start()
        logger.info("APScheduler started.")
from app.services.scheduler_config_service import get_all_scheduler_configs
from app.services.manual_test_service import run_manual_test
from app.services.api_endpoint_service import get_all_endpoints
from app.services.api_group_service import get_api_group
from app.database.mongodb import scheduler_configs_collection
import asyncio
from datetime import datetime, timedelta
import pytz

def execute_schedule_sync(config: dict):
    logger.info(f"[DEBUG] execute_schedule_sync() invoked for {config.get('name')}")
    try:
        asyncio.run(execute_schedule(config))
    except Exception as e:
        logger.error(f"[DEBUG] Exception in execute_schedule_sync for {config.get('name')}: {e}", exc_info=True)

async def execute_schedule(config: dict):
    name = config.get("name")
    target_type = config.get("target_type")
    target_name = config.get("target_name")
    interval = config.get("interval_seconds", 60)
    
    logger.info(f"Executing schedule: {name}")
    
    if target_type == "REPORT":
        try:
            logger.info(f"[DEBUG] REPORT branch entered for {name}")
            from app.services.health_report_service import generate_health_report
            
            logger.info(f"Executing REPORT schedule: {name}...")
            logger.info(f"[DEBUG] Calling generate_health_report() for {name}")
            generate_health_report()
            
            logger.info(f"Successfully executed health report schedule {name}")
        except Exception as e:
            logger.error(f"Error executing health report schedule {name}: {e}")
    else:
        endpoints_to_run = []
        
        if target_type == "API":
            endpoints_to_run.append(target_name)
        elif target_type == "GROUP":
            try:
                group = get_api_group(target_name)
                if group and "apis" in group:
                    endpoints_to_run.extend(group["apis"])
            except Exception as e:
                logger.error(f"Error loading group {target_name}: {e}")
                
        all_endpoints = get_all_endpoints()
        
        for ep_name in endpoints_to_run:
            try:
                endpoint = next((ep for ep in all_endpoints if ep["name"] == ep_name), None)
                if endpoint:
                    logger.info(f"Executing API test for {ep_name} in schedule {name}")
                    await run_manual_test(endpoint)
                else:
                    logger.warning(f"Endpoint '{ep_name}' not found for schedule '{name}'")
            except Exception as e:
                logger.error(f"Error running test for {ep_name}: {e}")

            
    now = datetime.now(pytz.utc)
    interval_val = config.get("interval_value")
    interval_unit = config.get("interval_unit")
    
    if interval_val and interval_unit:
        delta_kwargs = {interval_unit: interval_val}
        next_run = now + timedelta(**delta_kwargs)
    else:
        interval_seconds = config.get("interval_seconds") or 60
        next_run = now + timedelta(seconds=interval_seconds)
    
    try:
        scheduler_configs_collection.update_one(
            {"name": name},
            {"$set": {
                "last_run": now,
                "next_run": next_run
            }}
        )
    except Exception as e:
        logger.error(f"Error updating scheduler config {name}: {e}")
        
    logger.info(f"Completed schedule: {name}")

def load_scheduler_jobs():
    scheduler = get_scheduler()
    
    logger.info("Scheduler reloading...")
    
    # Remove existing jobs to avoid duplicates
    scheduler.remove_all_jobs()
    
    configs = get_all_scheduler_configs()
    count = 0
    
    for config in configs:
        logger.info(f"Discovered schedule: {config.get('name')}")
        if config.get("enabled"):
            job_id = config.get("name")
            interval_val = config.get("interval_value")
            interval_unit = config.get("interval_unit")
            
            if interval_val and interval_unit:
                trigger_kwargs = {interval_unit: interval_val}
            else:
                interval_seconds = config.get("interval_seconds") or 60
                trigger_kwargs = {"seconds": interval_seconds}
            
            scheduler.add_job(
                func=execute_schedule_sync,
                trigger="interval",
                args=[config],
                id=job_id,
                replace_existing=True,
                **trigger_kwargs
            )
            logger.info(f"Added job: {job_id}")
            count += 1
            
    logger.info(f"Loaded {count} schedules.")
