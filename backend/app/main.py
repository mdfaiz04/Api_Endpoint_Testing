from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.services.scheduler_engine import start_scheduler, load_scheduler_jobs
from fastapi.middleware.cors import CORSMiddleware

from app.routes import api_endpoints
from app.routes import manual_test
from app.routes import test_logs
from app.routes import dashboard
from app.routes import endpoint_summary
from app.routes import api_groups
from app.routes import scheduler_configs
from app.routes import notification_recipients


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    load_scheduler_jobs()
    yield

app = FastAPI(
    title="API Endpoint Testing",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "API Endpoint Testing"}


@app.get("/health")
def health():
    return {"status": "healthy"}


# Register routes
app.include_router(api_endpoints.router)
app.include_router(manual_test.router)
app.include_router(test_logs.router)
app.include_router(dashboard.router)
app.include_router(endpoint_summary.router)
app.include_router(api_groups.router)
app.include_router(scheduler_configs.router)
app.include_router(notification_recipients.router)