from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    

    COSMOS_ENDPOINT: str
    COSMOS_KEY: str
    COSMOS_DATABASE: str = "db-doc"
    COSMOS_CONTAINER: str = "jobs"
    BLOB_CONNECTION_STRING: str
    BLOB_CONTAINER: str
    
model_config = SettingsConfigDict(case_sensitive=False)
settings = Settings()