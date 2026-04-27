from fastapi import APIRouter
from .models import JobCreateRequest, JobCreateResponse, Job
from .services_job import create_job, get_job, update_job_status

router = APIRouter()

@router.post("/jobs", response_model=JobCreateResponse)
def create_job_endpoint(req: JobCreateRequest):
    return create_job(req)

@router.get("/jobs/{job_id}", response_model=Job)
def get_job_endpoint(job_id: str):
    return get_job(job_id)

@router.patch("/jobs/{job_id}/status")
def update_job_status_endpoint(job_id: str, status: str):
    return update_job_status(job_id, status)
