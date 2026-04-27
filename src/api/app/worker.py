import time
from .blob_service import get_blob_service
from .config import settings
from .cosmos import get_cosmos_container
from .models import now_iso

def worker_loop():
    container = get_cosmos_container()
    blob_service = get_blob_service()
    blob_container = blob_service.get_container_client(settings.BLOB_CONTAINER)

    while True:
        items = list(container.query_items(
            query="SELECT * FROM c WHERE c.status='CREATED'",
            enable_cross_partition_query=True
        ))

        for job in items:
            print("Processing job:", job["id"])

            try:
                blob_bytes = blob_container.download_blob(job["id"]).readall()
                file_name = (job.get("fileName") or "").lower()
                content_type = (job.get("contentType") or "").lower()
                blob_size = len(blob_bytes)

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
            except Exception as exc:
                job["status"] = "ERROR"
                job["error"] = str(exc)
            finally:
                job["updatedAt"] = now_iso()
                container.replace_item(job["id"], job)

        time.sleep(5)
