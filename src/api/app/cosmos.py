from azure.cosmos import CosmosClient
from .config import settings

_client = None
_container = None


def get_cosmos_container():
    global _client, _container

    if _container is None:
        _client = CosmosClient(
            settings.cosmos_endpoint,
            credential=settings.cosmos_key
        )

        database = _client.get_database_client(settings.cosmos_database)
        _container = database.get_container_client(settings.cosmos_container)

    return _container