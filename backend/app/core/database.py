"""Database configuration and session management.

This module provides SQLAlchemy database configuration, including:
    - Database engine setup
    - Session management
    - Base class for models
    - Database dependency for FastAPI
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

#: SQLAlchemy declarative base class for models
Base = declarative_base()

#: Database engine instance configured with application settings
engine = create_engine(settings.SQLALCHEMY_DATABASE_URL)

#: Session factory for creating new database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Database dependency callable for FastAPI.
    
    Creates a new database session for each request and ensures
    proper cleanup after the request is complete.
    
    :yield: Database session
    :rtype: Session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 