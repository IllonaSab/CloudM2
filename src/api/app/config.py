from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    BLOB_CONNECTION_STRING: str = os.getenv("BLOB_CONNECTION_STRING")
    BLOB_CONTAINER: str = os.getenv("BLOB_CONTAINER")

    COSMOS_ENDPOINT: str = os.getenv("COSMOS_ENDPOINT")
    COSMOS_KEY: str = os.getenv("COSMOS_KEY")
    COSMOS_DATABASE: str = os.getenv("COSMOS_DATABASE")
    COSMOS_CONTAINER: str = os.getenv("COSMOS_CONTAINER")

settings = Settings()
