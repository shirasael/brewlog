"""
Brew API endpoints for managing coffee brewing records.

This module provides REST API endpoints for CRUD operations on brew records,
with support for pagination and error handling.
"""

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
    """Retrieve a paginated list of brew records.

    :param skip: Number of records to skip (offset)
    :type skip: int
    :param limit: Maximum number of records to return
    :type limit: int
    :param db: Database session dependency
    :type db: Session
    :return: List of brew records
    :rtype: List[Brew]
    """
    brews = crud.get_brews(db, skip=skip, limit=limit)
    return brews

@router.post("/brews/", response_model=Brew)
def create_brew(
    brew: BrewCreate,
    db: Session = Depends(get_db)
):
    """Create a new brew record.

    :param brew: Brew data to create
    :type brew: BrewCreate
    :param db: Database session dependency
    :type db: Session
    :return: Created brew record
    :rtype: Brew
    """
    return crud.create_brew(db=db, brew=brew)

@router.get("/brews/{brew_id}", response_model=Brew)
def read_brew(
    brew_id: int,
    db: Session = Depends(get_db)
):
    """Retrieve a specific brew record by ID.

    :param brew_id: ID of the brew to retrieve
    :type brew_id: int
    :param db: Database session dependency
    :type db: Session
    :return: Requested brew record
    :rtype: Brew
    :raises HTTPException: If brew is not found (404)
    """
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
    """Update an existing brew record.

    :param brew_id: ID of the brew to update
    :type brew_id: int
    :param brew: Updated brew data
    :type brew: BrewCreate
    :param db: Database session dependency
    :type db: Session
    :return: Updated brew record
    :rtype: Brew
    :raises HTTPException: If brew is not found (404)
    """
    db_brew = crud.update_brew(db, brew_id=brew_id, brew=brew)
    if db_brew is None:
        raise HTTPException(status_code=404, detail="Brew not found")
    return db_brew

@router.delete("/brews/{brew_id}")
def delete_brew(
    brew_id: int,
    db: Session = Depends(get_db)
):
    """Delete a brew record.

    :param brew_id: ID of the brew to delete
    :type brew_id: int
    :param db: Database session dependency
    :type db: Session
    :return: Success message
    :rtype: dict
    :raises HTTPException: If brew is not found (404)
    """
    success = crud.delete_brew(db, brew_id=brew_id)
    if not success:
        raise HTTPException(status_code=404, detail="Brew not found")
    return {"message": "Brew deleted successfully"} 