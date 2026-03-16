from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    cosmos_endpoint: str
    cosmos_key: str
    cosmos_database: str
    cosmos_container: str

    blob_connection_string: str
    blob_container: str

    class Config:
        env_file = ".env"


settings = Settings()