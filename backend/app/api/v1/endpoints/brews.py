from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.crud import brew as crud
from app.schemas.brew import Brew, BrewCreate
from app.core.database import get_db

router = APIRouter()

@router.get("/brews/", response_model=List[Brew])
def read_brews(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db)
):
    """Get all brews with pagination"""
    brews = crud.get_brews(db, skip=skip, limit=limit)
    return brews

@router.post("/brews/", response_model=Brew)
def create_brew(
    brew: BrewCreate,
    db: Session = Depends(get_db)
):
    """Create a new brew"""
    return crud.create_brew(db=db, brew=brew)

@router.get("/brews/{brew_id}", response_model=Brew)
def read_brew(
    brew_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific brew by ID"""
    db_brew = crud.get_brew(db, brew_id=brew_id)
    if db_brew is None:
        raise HTTPException(status_code=404, detail="Brew not found")
    return db_brew

@router.put("/brews/{brew_id}", response_model=Brew)
def update_brew(
    brew_id: int,
    brew: BrewCreate,
    db: Session = Depends(get_db)
):
    """Update a brew"""
    db_brew = crud.update_brew(db, brew_id=brew_id, brew=brew)
    if db_brew is None:
        raise HTTPException(status_code=404, detail="Brew not found")
    return db_brew

@router.delete("/brews/{brew_id}")
def delete_brew(
    brew_id: int,
    db: Session = Depends(get_db)
):
    """Delete a brew"""
    success = crud.delete_brew(db, brew_id=brew_id)
    if not success:
        raise HTTPException(status_code=404, detail="Brew not found")
    return {"message": "Brew deleted successfully"} 