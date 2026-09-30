from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import list_routes, user_routes

ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]

app = FastAPI(title="Research Tracker API")

app = FastAPI(
    title="Research Tracker API",
    description="An API to track and manage items in a list.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

app.include_router(list_routes.router)
app.include_router(user_routes.router)