from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    COSMOS_ENDPOINT: str
    COSMOS_KEY: str
    COSMOS_DATABASE: str
    COSMOS_CONTAINER: str
    BLOB_CONNECTION_STRING: str
    BLOB_CONTAINER: str

    class Config:
        env_file = ".env"

settings = Settings()