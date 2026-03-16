from azure.cosmos import CosmosClient
from .config import settings

_client = None

def get_cosmos_container():
    global _client

    if _client is None:
        _client = CosmosClient(
            settings.COSMOS_ENDPOINT,
            credential=settings.COSMOS_KEY
        )

    database = _client.get_database_client(settings.COSMOS_DATABASE)
    return database.get_container_client(settings.COSMOS_CONTAINER)