from typing import List, Optional
from sqlalchemy.orm import Session
from app import models, schemas

# Location CRUD
def get_location(db: Session, location_id: int) -> Optional[models.Location]:
    return db.query(models.Location).filter(models.Location.id == location_id).first()

def get_locations(db: Session, skip: int = 0, limit: int = 100) -> List[models.Location]:
    return db.query(models.Location).offset(skip).limit(limit).all()

def create_location(db: Session, location: schemas.LocationCreate) -> models.Location:
    db_location = models.Location(**location.model_dump())
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location

# Box CRUD
def get_box(db: Session, box_id: int) -> Optional[models.Box]:
    return db.query(models.Box).filter(models.Box.id == box_id).first()

def get_boxes(db: Session, skip: int = 0, limit: int = 100) -> List[models.Box]:
    return db.query(models.Box).offset(skip).limit(limit).all()

def create_box(db: Session, box: schemas.BoxCreate) -> models.Box:
    db_box = models.Box(**box.model_dump())
    db.add(db_box)
    db.commit()
    db.refresh(db_box)
    return db_box

# Item CRUD
def get_items(db: Session, skip: int = 0, limit: int = 100) -> List[models.Item]:
    return db.query(models.Item).offset(skip).limit(limit).all()

def create_item(db: Session, item: schemas.ItemCreate) -> models.Item:
    db_item = models.Item(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def consume_item(db: Session, item_id: int, amount: float, add_to_list: bool) -> Optional[models.Item]:
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if db_item:
        db_item.quantity = float(db_item.quantity - amount)
        if db_item.quantity < 0:
            db_item.quantity = 0.0
        
        if db_item.quantity < db_item.min_quantity and add_to_list:
            db_item.on_shopping_list = True
            
        db.commit()
        db.refresh(db_item)
    return db_item
