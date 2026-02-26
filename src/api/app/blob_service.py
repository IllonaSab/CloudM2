from azure.storage.blob import (
    BlobServiceClient,
    generate_blob_sas,
    BlobSasPermissions
)
from datetime import datetime, timedelta
from .config import settings


def generate_upload_sas(blob_name: str):

    if not settings.blob_connection_string:
        raise ValueError("BLOB_CONNECTION_STRING is not set")

    blob_service = BlobServiceClient.from_connection_string(
        settings.blob_connection_string
    )

    account_key = blob_service.credential.account_key

    sas_token = generate_blob_sas(
        account_name=blob_service.account_name,
        container_name=settings.blob_container,
        blob_name=blob_name,
        account_key=account_key,
        permission=BlobSasPermissions(write=True, create=True),
        expiry=datetime.utcnow() + timedelta(minutes=15)
    )

    return (
        f"https://{blob_service.account_name}.blob.core.windows.net/"
        f"{settings.blob_container}/{blob_name}?{sas_token}"
    )