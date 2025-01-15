from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class BrewBase(BaseModel):
    bean_type: str
    brew_type: str
    water_temp: float = Field(..., gt=0)
    weight_in: float = Field(..., gt=0)
    weight_out: float = Field(..., gt=0)
    brew_time: str  # Format: "mm:ss"
    bloom_time: Optional[int] = Field(None, ge=0)  # In seconds
    details: Optional[str] = None
    image_url: Optional[str] = None


class BrewCreate(BrewBase):
    pass


class Brew(BrewBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
