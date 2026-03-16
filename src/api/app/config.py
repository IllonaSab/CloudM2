from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=False)

    cosmos_endpoint: str
    cosmos_key: str
    cosmos_database: str = "db-doc"
    cosmos_container: str = "jobs"
    blob_connection_string: str
    blob_container: str

settings = Settings()