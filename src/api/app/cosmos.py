from azure.cosmos import CosmosClient
from .config import settings

cosmos_client = None
cosmos_container = None

def get_cosmos_container():
    global cosmos_client, cosmos_container

    if cosmos_client is None:
        cosmos_client = CosmosClient(
            url=settings.COSMOS_ENDPOINT,
            credential=settings.COSMOS_KEY
        )

    if cosmos_container is None:
        db = cosmos_client.get_database_client(settings.COSMOS_DATABASE)
        cosmos_container = db.get_container_client(settings.COSMOS_CONTAINER)

    return cosmos_container
