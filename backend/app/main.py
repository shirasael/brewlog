from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import brews
from app.core.config import settings
from app.core.database import engine
from app.models import brew as brew_model

# Create database tables
brew_model.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Coffee Brewing API",
    description="API for tracking coffee brewing parameters",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(brews.router, prefix=settings.API_V1_STR) 