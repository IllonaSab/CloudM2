from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Dict, Any
import uuid

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

class JobCreateRequest(BaseModel):
    fileName: str = Field(..., min_length=1)
    contentType: str = Field(default="application/octet-stream")

class JobCreateResponse(BaseModel):
    jobId: str
    status: str
    createdAt: str
    uploadUrl: str
    category: str

class Job(BaseModel):
    id: str
    pk: str
    status: str
    category: str
    fileName: str
    contentType: str
    createdAt: str
    updatedAt: str
    resultSummary: str | None
    error: str | None

def job_to_entity(req: JobCreateRequest) -> Dict[str, Any]:
    job_id = str(uuid.uuid4())
    ts = now_iso()
    return {
        "id": job_id,
        "pk": "JOB",
        "status": "CREATED",
        "category": "",
        "fileName": req.fileName,
        "contentType": req.contentType,
        "createdAt": ts,
        "updatedAt": ts,
        "resultSummary": None,
        "error": None
    }
