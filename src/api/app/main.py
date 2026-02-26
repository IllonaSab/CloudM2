from fastapi import FastAPI
from azure.storage.blob import BlobServiceClient
from .config import settings

app = FastAPI(
    title="Doc processing API",
    description="API de génération de documents",
    version="1.0.0"
)

@app.on_event("startup")
def startup_event():
    if not settings.blob_connection_string:
        raise ValueError("BLOB_CONNECTION_STRING not set")

    app.state.blob_service = BlobServiceClient.from_connection_string(
        settings.blob_connection_string
    )

app.include_router(jobs_router)


@app.get("/health")
def health():
    return {"status": "ok"}