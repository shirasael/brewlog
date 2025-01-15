"""
SQLAlchemy model for coffee brewing records.

This module defines the database schema for storing brew information including
parameters, timing, and optional details.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, func
from app.core.database import Base

class Brew(Base):
    """A database model representing a coffee brewing record.

    This model stores all parameters and measurements related to a single
    coffee brewing session, including the brewing method, measurements,
    and optional details.

    :ivar id: Primary key for the brew record
    :type id: int
    :ivar bean_type: Type/origin of coffee beans used
    :type bean_type: str
    :ivar brew_type: Method of brewing (e.g., V60, Espresso)
    :type brew_type: str
    :ivar water_temp: Water temperature in Celsius
    :type water_temp: float
    :ivar weight_in: Input coffee weight in grams
    :type weight_in: float
    :ivar weight_out: Output coffee weight in grams
    :type weight_out: float
    :ivar brew_time: Total brewing time in "mm:ss" format
    :type brew_time: str
    :ivar bloom_time: Coffee bloom time in seconds (optional)
    :type bloom_time: int or None
    :ivar details: Additional brewing notes (optional)
    :type details: str or None
    :ivar image_url: URL or base64 of brew image (optional)
    :type image_url: str or None
    :ivar created_at: Timestamp of record creation
    :type created_at: datetime
    :ivar updated_at: Timestamp of last update (optional)
    :type updated_at: datetime or None
    """
    __tablename__ = "brews"

    id = Column(Integer, primary_key=True, index=True)
    bean_type = Column(String)
    brew_type = Column(String)
    water_temp = Column(Float)
    weight_in = Column(Float)
    weight_out = Column(Float)
    brew_time = Column(String)  # Format: "mm:ss"
    bloom_time = Column(Integer, nullable=True)  # In seconds
    details = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, nullable=True, onupdate=func.now()) 