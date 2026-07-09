from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import asyncio
import httpx
import logging
import os
import secrets
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwAsy2Zp2AnxNm_m3nAfDLrONFXicIDJzAPMUO0gGXF6XcwVEtZ05G0RB0mTuvks20x/exec"

ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")
ADMIN_SESSIONS: dict[str, datetime] = {}
SESSION_TTL = timedelta(hours=8)

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "")
RESEND_TO_EMAIL = os.getenv("RESEND_TO_EMAIL", "")

app = FastAPI(title="Individual Stake API")
api_router = APIRouter(prefix="/api")


class ContactSubmissionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    company: Optional[str] = Field(default="", max_length=160)
    service_interest: str = Field(..., min_length=1, max_length=80)
    message: str = Field(..., min_length=1, max_length=4000)


class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: Optional[str] = ""
    service_interest: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AdminLoginRequest(BaseModel):
    password: str


class AdminLoginResponse(BaseModel):
    token: str
    expires_at: datetime


async def append_to_google_sheet(submission: ContactSubmission):
    payload = {
        "name": submission.name,
        "email": submission.email,
        "company": submission.company,
        "service_interest": submission.service_interest,
        "message": submission.message,
    }

    async with httpx.AsyncClient(timeout=20) as c:
        r = await c.post(GOOGLE_APPS_SCRIPT_URL, json=payload)
        r.raise_for_status()


def _issue_token():
    token = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + SESSION_TTL
    ADMIN_SESSIONS[token] = expires
    return token, expires


async def require_admin(authorization: Optional[str] = Header(default=None)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")

    token = authorization.split(" ", 1)[1].strip()
    expires = ADMIN_SESSIONS.get(token)

    if not expires or expires < datetime.now(timezone.utc):
        ADMIN_SESSIONS.pop(token, None)
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return token


@api_router.get("/")
async def root():
    return {"message": "Individual Stake API", "status": "ok"}


@api_router.get("/health")
async def health():
    await db.command("ping")
    return {"status": "ok", "db": "connected"}


@api_router.post("/contact", response_model=ContactSubmission, status_code=201)
async def create_contact(payload: ContactSubmissionCreate):
    submission = ContactSubmission(**payload.model_dump())

    doc = submission.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()

    await db.contact_submissions.insert_one(doc)

    try:
        await append_to_google_sheet(submission)
    except Exception:
        logger.exception("Google Sheets update failed")

    return submission


@api_router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(payload: AdminLoginRequest):
    if not secrets.compare_digest(payload.password, ADMIN_PASSWORD):
        raise HTTPException(status_code=401, detail="Invalid password")
    token, expires = _issue_token()
    return AdminLoginResponse(token=token, expires_at=expires)


@api_router.get("/admin/contact", response_model=List[ContactSubmission])
async def list_contacts(limit: int = 200, _=Depends(require_admin)):
    docs = await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for d in docs:
        if isinstance(d.get("created_at"), str):
            d["created_at"] = datetime.fromisoformat(d["created_at"])
    return docs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()