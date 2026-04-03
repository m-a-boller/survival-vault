from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from . import crud, models, schemas
from .database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Survival Vault API", version="0.1.1")

# Locations
@app.post("/locations/", response_model=schemas.Location)
def create_location(location: schemas.LocationCreate, db: Session = Depends(get_db)):
    return crud.create_location(db=db, location=location)

@app.get("/locations/", response_model=List[schemas.Location])
def read_locations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    locations = crud.get_locations(db, skip=skip, limit=limit)
    return locations

# Boxes
@app.post("/boxes/", response_model=schemas.Box)
def create_box(box: schemas.BoxCreate, db: Session = Depends(get_db)):
    return crud.create_box(db=db, box=box)

@app.get("/boxes/", response_model=List[schemas.Box])
def read_boxes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    boxes = crud.get_boxes(db, skip=skip, limit=limit)
    return boxes

# Items
@app.post("/items/", response_model=schemas.Item)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    return crud.create_item(db=db, item=item)

@app.get("/items/", response_model=List[schemas.Item])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_items(db, skip=skip, limit=limit)
    return items

@app.post("/items/{item_id}/consume", response_model=schemas.Item)
def consume_item(item_id: int, amount: float, add_to_list: bool = True, db: Session = Depends(get_db)):
    db_item = crud.consume_item(db, item_id=item_id, amount=amount, add_to_list=add_to_list)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item

@app.get("/")
async def root():
    return {"message": "Welcome to Survival Vault API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
