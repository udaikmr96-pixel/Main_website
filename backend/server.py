from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
import secrets
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import httpx


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

    # Configure logging early
logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
logger = logging.getLogger(__name__)

    # MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

    # ============================================================
    # GOOGLE APPS SCRIPT
    # Paste your deployed Apps Script Web App URL below
    # ============================================================
GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwAsy2Zp2AnxNm_m3nAfDLrONFXicIDJzAPMUO0gGXF6XcwVEtZ05G0RB0mTuvks20x/exec"
    # ============================================================

    # Admin auth (simple shared-password + signed token kept in-memory)
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', '')
ADMIN_SESSIONS: dict[str, datetime] = {}
SESSION_TTL = timedelta(hours=8)

app = FastAPI(title="Individual Stake API")
api_router = APIRouter(prefix="/api")


    # --------- Models ---------
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


    # --------- Helpers ---------
def _email_html(payload: ContactSubmission) -> str:
        return f"""
        <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background:#0a0a0a; color:#ffffff; padding: 24px; border-radius: 8px;">
        <tr><td>
            <h2 style="margin:0 0 16px; font-weight: 500; color:#ffffff;">New enquiry — Individual Stake</h2>
            <p style="margin:0 0 24px; color:#a1a1aa;">A new contact form submission was received.</p>
            <table cellpadding="6" cellspacing="0" style="border-collapse: collapse; width:100%; background:#111; color:#fff;">
            <tr><td style="color:#a1a1aa;">Name</td><td>{payload.name}</td></tr>
            <tr><td style="color:#a1a1aa;">Email</td><td><a href="mailto:{payload.email}" style="color:#fff;">{payload.email}</a></td></tr>
            <tr><td style="color:#a1a1aa;">Company</td><td>{payload.company or '—'}</td></tr>
            <tr><td style="color:#a1a1aa;">Service</td><td>{payload.service_interest}</td></tr>
            <tr><td style="color:#a1a1aa;">Submitted</td><td>{payload.created_at.isoformat()}</td></tr>
            </table>
            <h3 style="margin: 24px 0 8px; font-weight: 500;">Message</h3>
            <div style="white-space: pre-wrap; background:#111; padding:16px; border-left: 2px solid #ffffff;">{payload.message}</div>
        </td></tr>
        </table>
        """


async def _send_notification_email(submission: ContactSubmission) -> None:
        if not (RESEND_API_KEY and RESEND_FROM_EMAIL and RESEND_TO_EMAIL):
            logger.info("Resend not configured — skipping email.")
            return
        params = {
            "from": f"Individual Stake <{RESEND_FROM_EMAIL}>",
            "to": [RESEND_TO_EMAIL],
            "reply_to": [submission.email],
            "subject": f"New enquiry — {submission.name} ({submission.service_interest})",
            "html": _email_html(submission),
        }
        try:
            result = await asyncio.to_thread(resend.Emails.send, params)
            logger.info("Resend email sent: %s", result.get("id") if isinstance(result, dict) else result)
        except Exception:
            logger.exception("Failed to send Resend notification email")

async def append_to_google_sheet(submission: ContactSubmission):
        if not GOOGLE_APPS_SCRIPT_URL:
            logger.info("Google Sheets URL not configured.")
            return

        payload = {
            "name": submission.name,
            "email": submission.email,
            "company": submission.company,
            "service_interest": submission.service_interest,
            "message": submission.message,
        }

        try:
            async with httpx.AsyncClient(timeout=20) as client:
                response = await client.post(
                    GOOGLE_APPS_SCRIPT_URL,
                    json=payload,
                )
                response.raise_for_status()
                logger.info("Submission written to Google Sheets.")
        except Exception:
            logger.exception("Failed to write submission to Google Sheets")
            raise

def _issue_token() -> tuple[str, datetime]:
        token = secrets.token_urlsafe(32)
        expires = datetime.now(timezone.utc) + SESSION_TTL
        ADMIN_SESSIONS[token] = expires
        return token, expires


async def require_admin(authorization: Optional[str] = Header(default=None)) -> str:
        if not authorization or not authorization.lower().startswith("bearer "):
            raise HTTPException(status_code=401, detail="Missing bearer token")
        token = authorization.split(" ", 1)[1].strip()
        expires = ADMIN_SESSIONS.get(token)
        if not expires or expires < datetime.now(timezone.utc):
            ADMIN_SESSIONS.pop(token, None)
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return token


    # --------- Public Routes ---------
@api_router.get("/")
async def root():
        return {"message": "Individual Stake API", "status": "ok"}


@api_router.get("/health")
async def health():
        try:
            await db.command("ping")
            return {"status": "ok", "db": "connected"}
        except Exception as e:
            raise HTTPException(status_code=503, detail=f"db unreachable: {e}")


@api_router.post("/contact", response_model=ContactSubmission, status_code=201)
async def create_contact(payload: ContactSubmissionCreate):
        submission = ContactSubmission(**payload.model_dump())
        doc = submission.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        try:
            await db.contact_submissions.insert_one(doc)
        except Exception as e:
            logger.exception("Failed to persist contact submission")
            raise HTTPException(status_code=500, detail="Could not save submission") from e
        # Fire-and-forget email (awaited but errors swallowed inside helper).
try:
await append_to_google_sheet(submission)
except Exception as e:
raise HTTPException(status_code=502, detail="Google Sheets CRM update failed") from e
return submission


@api_router.get("/services")
async def list_services():
        return {
            "services": [
                {
                    "id": "design-hosting",
                    "title": "Website Design & Hosting",
                    "summary": "Custom websites engineered for clarity, speed and conversion — paired with managed hosting that scales.",
                    "deliverables": [
                        "Brand-aligned UI/UX design",
                        "Hand-coded responsive builds",
                        "Managed hosting & deployments",
                        "Analytics, SEO & performance audits",
                    ],
                },
                {
                    "id": "workflow-automation",
                    "title": "Workflow Automation",
                    "summary": "Connect tools, eliminate busywork and unlock leverage with automations that pay for themselves.",
                    "deliverables": [
                        "Process discovery & mapping",
                        "Custom API & no-code integrations",
                        "AI-assisted document & data flows",
                        "Monitoring, logging & handoff docs",
                    ],
                },
                {
                    "id": "linguistic-services",
                    "title": "Linguistic Services",
                    "summary": "Translation, localization and bilingual copywriting that reads native — not machine.",
                    "deliverables": [
                        "Human translation & proofreading",
                        "Website & app localization",
                        "Multilingual SEO copy",
                        "Subtitling & transcription",
                    ],
                },
            ]
        }


@api_router.get("/languages")
async def list_languages():
        return {
            "languages": [
                "Hindi", "English", "Spanish", "French", "German",
                "Portuguese", "Arabic", "Mandarin", "Japanese",
            ],
            "highlight": "Hindi",
        }


    # --------- Admin Routes ---------
@api_router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(payload: AdminLoginRequest):
        if not ADMIN_PASSWORD:
            raise HTTPException(status_code=503, detail="Admin password not configured")
        # constant-time compare
        if not secrets.compare_digest(payload.password, ADMIN_PASSWORD):
            raise HTTPException(status_code=401, detail="Invalid password")
        token, expires = _issue_token()
        return AdminLoginResponse(token=token, expires_at=expires)


@api_router.post("/admin/logout")
async def admin_logout(_token: str = Depends(require_admin)):
        ADMIN_SESSIONS.pop(_token, None)
        return {"status": "ok"}


@api_router.get("/admin/me")
async def admin_me(_token: str = Depends(require_admin)):
        return {"authenticated": True}


@api_router.get("/admin/contact", response_model=List[ContactSubmission])
async def list_contacts_admin(limit: int = 200, _token: str = Depends(require_admin)):
        docs = await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
        for d in docs:
            if isinstance(d.get('created_at'), str):
                d['created_at'] = datetime.fromisoformat(d['created_at'])
        return docs


@api_router.delete("/admin/contact/{submission_id}")
async def delete_contact(submission_id: str, _token: str = Depends(require_admin)):
        result = await db.contact_submissions.delete_one({"id": submission_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Submission not found")
        return {"status": "deleted", "id": submission_id}


    # Mount router and middleware
app.include_router(api_router)
app.add_middleware(
        CORSMiddleware,
        allow_credentials=True,
        allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.on_event("shutdown")
async def shutdown_db_client():
        client.close()