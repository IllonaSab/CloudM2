from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    cosmos_endpoint: str
    cosmos_key: str
    cosmos_database: str = "db-doc"
    cosmos_container: str = "jobs"
    blob_connection_string: str
    blob_container: str

settings = Settings()