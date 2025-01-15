from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.brew import Brew
from app.schemas.brew import BrewCreate

def get_brew(db: Session, brew_id: int) -> Optional[Brew]:
    return db.query(Brew).filter(Brew.id == brew_id).first()

def get_brews(db: Session, skip: int = 0, limit: int = 100) -> List[Brew]:
    return db.query(Brew).order_by(Brew.created_at.desc()).offset(skip).limit(limit).all()

def create_brew(db: Session, brew: BrewCreate) -> Brew:
    db_brew = Brew(**brew.model_dump())
    db.add(db_brew)
    db.commit()
    db.refresh(db_brew)
    return db_brew

def delete_brew(db: Session, brew_id: int) -> bool:
    brew = db.query(Brew).filter(Brew.id == brew_id).first()
    if brew:
        db.delete(brew)
        db.commit()
        return True
    return False

def update_brew(db: Session, brew_id: int, brew: BrewCreate) -> Optional[Brew]:
    db_brew = db.query(Brew).filter(Brew.id == brew_id).first()
    if db_brew:
        for key, value in brew.model_dump().items():
            setattr(db_brew, key, value)
        db.commit()
        db.refresh(db_brew)
        return db_brew
    return None 