from sqlalchemy import Column, Integer, String, Float, DateTime, func
from app.core.database import Base

class Brew(Base):
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