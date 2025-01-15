"""Application configuration management.

This module handles application settings using Pydantic's BaseSettings,
supporting both environment variables and .env file configuration.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Application configuration settings.
    
    Manages configuration for database connections and API versioning.
    Values can be overridden by environment variables.
    
    :ivar DATABASE_URL: SQLite database connection URL
    :type DATABASE_URL: str
    :ivar SQLALCHEMY_DATABASE_URL: SQLAlchemy-specific database URL
    :type SQLALCHEMY_DATABASE_URL: str
    :ivar API_V1_STR: API version prefix for routes
    :type API_V1_STR: str
    """
    DATABASE_URL: str = "sqlite:///sql_app.db"
    SQLALCHEMY_DATABASE_URL: str = DATABASE_URL
    API_V1_STR: str = "/api/v1"

    model_config = {"env_file": ".env"}

@lru_cache()
def get_settings() -> Settings:
    """Create and cache application settings.
    
    Uses lru_cache to prevent multiple reads of environment variables
    or .env file.
    
    :return: Application settings instance
    :rtype: Settings
    """
    return Settings()

#: Cached instance of application settings
settings = get_settings() 