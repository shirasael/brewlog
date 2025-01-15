"""Database CRUD operations for brew records.

This module provides database operations for creating, reading,
updating, and deleting brew records using SQLAlchemy ORM.
"""

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.brew import Brew
from app.schemas.brew import BrewCreate

def get_brew(db: Session, brew_id: int) -> Optional[Brew]:
    """Retrieve a single brew record by ID.
    
    :param db: Database session
    :type db: Session
    :param brew_id: ID of the brew to retrieve
    :type brew_id: int
    :return: Found brew record or None
    :rtype: Optional[Brew]
    """
    return db.query(Brew).filter(Brew.id == brew_id).first()

def get_brews(db: Session, skip: int = 0, limit: int = 100) -> List[Brew]:
    """Retrieve a list of brew records with pagination.
    
    Results are ordered by creation date in descending order.
    
    :param db: Database session
    :type db: Session
    :param skip: Number of records to skip
    :type skip: int
    :param limit: Maximum number of records to return
    :type limit: int
    :return: List of brew records
    :rtype: List[Brew]
    """
    return db.query(Brew).order_by(Brew.created_at.desc()).offset(skip).limit(limit).all()

def create_brew(db: Session, brew: BrewCreate) -> Brew:
    """Create a new brew record.
    
    :param db: Database session
    :type db: Session
    :param brew: Brew data to create
    :type brew: BrewCreate
    :return: Created brew record
    :rtype: Brew
    """
    db_brew = Brew(**brew.model_dump())
    db.add(db_brew)
    db.commit()
    db.refresh(db_brew)
    return db_brew

def delete_brew(db: Session, brew_id: int) -> bool:
    """Delete a brew record by ID.
    
    :param db: Database session
    :type db: Session
    :param brew_id: ID of the brew to delete
    :type brew_id: int
    :return: True if brew was deleted, False if not found
    :rtype: bool
    """
    brew = db.query(Brew).filter(Brew.id == brew_id).first()
    if brew:
        db.delete(brew)
        db.commit()
        return True
    return False

def update_brew(db: Session, brew_id: int, brew: BrewCreate) -> Optional[Brew]:
    """Update an existing brew record.
    
    :param db: Database session
    :type db: Session
    :param brew_id: ID of the brew to update
    :type brew_id: int
    :param brew: Updated brew data
    :type brew: BrewCreate
    :return: Updated brew record or None if not found
    :rtype: Optional[Brew]
    """
    db_brew = db.query(Brew).filter(Brew.id == brew_id).first()
    if db_brew:
        for key, value in brew.model_dump().items():
            setattr(db_brew, key, value)
        db.commit()
        db.refresh(db_brew)
        return db_brew
    return None 