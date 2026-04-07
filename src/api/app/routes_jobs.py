from fastapi import APIRouter, HTTPException
from azure.cosmos.exceptions import CosmosHttpResponseError
from .cosmos import get_cosmos_container
from .models import JobCreateRequest, job_to_entity
from .blob_service import generate_upload_sas

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.post("", status_code=201)
def create_job(req: JobCreateRequest):
    container = get_cosmos_container()
    entity = job_to_entity(req)

    try:
        container.create_item(body=entity)
    except CosmosHttpResponseError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Cosmos error: {getattr(e, 'message', str(e))}"
        )

    blob_path = f"input/{entity['id']}/{req.fileName}"
    upload_url = generate_upload_sas(blob_path)

    # ✅ IMPORTANT : dict brut
    return {
        "jobId": entity["id"],
        "status": entity["status"],
        "createdAt": entity["createdAt"],
        "uploadUrl": upload_url
    }


@router.get("/{job_id}")
def get_job(job_id: str):
    container = get_cosmos_container()

    try:
        item = container.read_item(item=job_id, partition_key="JOB")
        return item
    except CosmosHttpResponseError as e:
        if getattr(e, "status_code", None) == 404:
            raise HTTPException(status_code=404, detail="Job not found")

        raise HTTPException(
            status_code=500,
            detail=f"Cosmos error: {getattr(e, 'message', str(e))}"
        )
    
@router.put("/jobs/{job_id}/status")
def update_status(job_id: str, new_status: str):
    container = get_cosmos_container()
    item = container.read_item(item=job_id, partition_key="JOB")
    item["status"] = new_status
    container.upsert_item(item)
    return item