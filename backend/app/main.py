from fastapi import FastAPI
from app.routes.api_endpoints import router as api_router

app = FastAPI(
    title="API Endpoint Testing",
    version="1.0.0"
)

app.include_router(api_router)


@app.get("/")
def root():
    return {
        "message": "API Endpoint Testing Backend Running"
    }