from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app import database as db
from app.routers import admin, jobs, applications, review

app = FastAPI(
    title="AI Powered Resume Checker & Reviewer API",
    description="Backend for the Automated Resume Relevance Check System.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    db.create_tables()


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


app.include_router(admin.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(review.router)
