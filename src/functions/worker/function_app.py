import azure.functions as func
import logging
from azure.cosmos import CosmosClient
import os
from datetime import datetime, timezone

app = func.FunctionApp()

def now_iso():
    return datetime.now(timezone.utc).isoformat()

@app.blob_trigger(arg_name="myblob", path="doc-storage/{name}",
                  connection="BLOB_CONNECTION_STRING")
def WorkerFile(myblob: func.InputStream):
    logging.info(f"Processing blob: {myblob.name}, Size: {myblob.length} bytes")

    job_id = myblob.name.split("/")[-1]
    blob_bytes = myblob.read()
    blob_size = len(blob_bytes)

    cosmos_client = CosmosClient(
        url=os.environ["COSMOS_ENDPOINT"],
        credential=os.environ["COSMOS_KEY"]
    )
    db = cosmos_client.get_database_client(os.environ["COSMOS_DATABASE"])
    container = db.get_container_client(os.environ["COSMOS_CONTAINER"])

    try:
        job = container.read_item(item=job_id, partition_key="JOB")

        file_name = (job.get("fileName") or "").lower()
        content_type = (job.get("contentType") or "").lower()

        if "pdf" in content_type or file_name.endswith(".pdf"):
            category = "pdf"
        elif content_type.startswith("image/"):
            category = "image"
        elif content_type.startswith("text/"):
            category = "text"
        else:
            category = "binary"

        job["category"] = category
        job["resultSummary"] = f"{category}:{blob_size} bytes"
        job["status"] = "DONE"
        job["error"] = None
        job["updatedAt"] = now_iso()

        container.replace_item(job_id, job)
        logging.info(f"Job {job_id} updated to DONE")

    except Exception as e:
        logging.error(f"Error processing job {job_id}: {e}")
        try:
            job["status"] = "ERROR"
            job["error"] = str(e)
            job["updatedAt"] = now_iso()
            container.replace_item(job_id, job)
        except:
            pass