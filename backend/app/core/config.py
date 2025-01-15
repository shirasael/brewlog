from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///sql_app.db"
    SQLALCHEMY_DATABASE_URL: str = DATABASE_URL
    API_V1_STR: str = "/api/v1"

    model_config = {"env_file": ".env"}

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings() 