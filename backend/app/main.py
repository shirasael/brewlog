"""FastAPI application entry point for the BrewLog API.

This module initializes and configures the FastAPI application, including:
    - Database initialization
    - CORS configuration
    - API route registration

The application provides a RESTful API for managing coffee brewing records.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints import brews
from app.core.config import settings
from app.core.database import engine
from app.models import brew as brew_model

# Initialize database tables if they don't exist
brew_model.Base.metadata.create_all(bind=engine)

# Initialize FastAPI application with metadata
app = FastAPI(
    title="Coffee Brewing API",
    description="API for tracking coffee brewing parameters and recipes",
    version="1.0.0",
)

# Configure CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend default port
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Register API routes with version prefix
app.include_router(brews.router, prefix=settings.API_V1_STR)
