from .cosmos import get_cosmos_container
from .blob_service import generate_upload_sas
from .models import JobCreateRequest, JobCreateResponse, Job, job_to_entity, now_iso

def create_job(req: JobCreateRequest) -> JobCreateResponse:
    container = get_cosmos_container()

    entity = job_to_entity(req)
    container.create_item(entity)

    upload_url = generate_upload_sas(entity["id"])

    return JobCreateResponse(
        jobId=entity["id"],
        status=entity["status"],
        createdAt=entity["createdAt"],
        uploadUrl=upload_url,
        category=entity["category"]
    )

def get_job(job_id: str) -> Job:
    container = get_cosmos_container()
    item = container.read_item(item=job_id, partition_key="JOB")
    return Job(**item)

def update_job_status(job_id: str, status: str):
    container = get_cosmos_container()
    item = container.read_item(item=job_id, partition_key="JOB")
    item["status"] = status
    item["updatedAt"] = now_iso()
    container.replace_item(item=job_id, body=item)
    return item
