from fastapi import FastAPI, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Dict, Union, Optional
from datetime import date

from app import crud, models, schemas
from app.database import engine, get_db
from app.reports import generate_inventory_pdf

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Survival Vault API", version="0.4.0")

# Shopping List
@app.get("/shopping-list", response_model=Union[List[schemas.Item], Dict[str, List[schemas.Item]]])
def get_shopping_list(grouped: bool = False, db: Session = Depends(get_db)):
    # Criteria: quantity < min_quantity OR on_shopping_list == True
    items = db.query(models.Item).filter(
        or_(
            models.Item.quantity < models.Item.min_quantity,
            models.Item.on_shopping_list
        )
    ).all()
    
    if grouped:
        result: Dict[str, List[models.Item]] = {}
        for item in items:
            cat = item.category or "Allgemein"
            if cat not in result:
                result[cat] = []
            result[cat].append(item)
        return result
        
    return items

@app.post("/shopping-list/purchase/{item_id}", response_model=schemas.Item)
def purchase_item(item_id: int, amount: Optional[float] = None, db: Session = Depends(get_db)):
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    if amount is not None:
        db_item.quantity += amount
    else:
        # If no amount specified, fill up to min_quantity if still below, otherwise just reset flag
        if db_item.quantity < db_item.min_quantity:
            db_item.quantity = db_item.min_quantity
            
    db_item.on_shopping_list = False
    db.commit()
    db.refresh(db_item)
    return db_item

# Reports
@app.get("/reports/inventory-pdf")
def get_inventory_report(db: Session = Depends(get_db)):
    locations = db.query(models.Location).all()
    pdf_bytes = generate_inventory_pdf(locations)
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=survival_vault_ledger_{date.today().isoformat()}.pdf"}
    )

# Dashboard & Expiry
@app.get("/dashboard/expiry-summary", response_model=List[schemas.Item])
def get_expiry_summary(db: Session = Depends(get_db)):
    # Get top 10 items to rotate (closest expiry date)
    items = db.query(models.Item).filter(models.Item.expiry_date.isnot(None)).order_by(models.Item.expiry_date.asc()).limit(10).all()
    return items

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

@app.get("/boxes/{box_id}/qr-url")
def get_box_qr_url(box_id: int, db: Session = Depends(get_db)):
    db_box = crud.get_box(db, box_id=box_id)
    if not db_box:
        raise HTTPException(status_code=404, detail="Box not found")
    
    # Frontend URL base (can be moved to config later)
    frontend_base = "http://localhost:3000"
    return {"url": f"{frontend_base}/box/{db_box.uuid}"}

@app.get("/boxes/by-uuid/{box_uuid}", response_model=schemas.Box)
def get_box_by_uuid(box_uuid: str, db: Session = Depends(get_db)):
    db_box = db.query(models.Box).filter(models.Box.uuid == box_uuid).first()
    if not db_box:
        raise HTTPException(status_code=404, detail="Box not found")
    return db_box

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
