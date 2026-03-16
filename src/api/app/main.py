from fastapi import FastAPI
from azure.storage.blob import BlobServiceClient
from .config import settings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Doc processing API",
    description="API de génération de documents",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # pour dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app = FastAPI()

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