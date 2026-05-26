from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Lumen Works API")

# Create a router with the /api prefix
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


# --------- Routes ---------
@api_router.get("/")
async def root():
    return {"message": "Lumen Works API", "status": "ok"}


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
    return submission


@api_router.get("/contact", response_model=List[ContactSubmission])
async def list_contacts(limit: int = 100):
    docs = await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs


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
            "English", "Spanish", "French", "German",
            "Portuguese", "Arabic", "Mandarin", "Japanese",
        ]
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
