from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions
from datetime import datetime, timedelta
from .config import settings

blob_service = None

def get_blob_service():
    global blob_service
    if blob_service is None:
        blob_service = BlobServiceClient.from_connection_string(settings.blob_connection_string)
    return blob_service

def generate_upload_sas(blob_name: str):
    service = get_blob_service()
    account_key = service.credential.account_key

    sas_token = generate_blob_sas(
        account_name=service.account_name,
        container_name=settings.blob_container,
        blob_name=blob_name,
        account_key=account_key,
        permission=BlobSasPermissions(write=True, create=True),
        expiry=datetime.utcnow() + timedelta(minutes=15)
    )

    return f"https://{service.account_name}.blob.core.windows.net/{settings.blob_container}/{blob_name}?{sas_token}"