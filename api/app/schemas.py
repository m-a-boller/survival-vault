from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional, List

class ItemBase(BaseModel):
    name: str
    expiry_date: Optional[date] = None
    quantity: float
    unit: str
    min_quantity: float = 0.0
    box_id: int

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    on_shopping_list: bool
    model_config = ConfigDict(from_attributes=True)

class BoxBase(BaseModel):
    number: str
    location_id: int

class BoxCreate(BoxBase):
    pass

class Box(BoxBase):
    id: int
    items: List[Item] = []
    model_config = ConfigDict(from_attributes=True)

class LocationBase(BaseModel):
    name: str
    description: Optional[str] = None

class LocationCreate(LocationBase):
    pass

class Location(LocationBase):
    id: int
    boxes: List[Box] = []
    model_config = ConfigDict(from_attributes=True)
