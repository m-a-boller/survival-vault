from pydantic import BaseModel, ConfigDict, computed_field
from datetime import date, datetime, timedelta
from typing import Optional, List, Literal

class ItemBase(BaseModel):
    name: str
    category: str = "Allgemein"
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
    
    @computed_field
    @property
    def expiry_status(self) -> Literal["CRITICAL", "WARNING", "HEALTHY"]:
        if not self.expiry_date:
            return "HEALTHY"
        
        now = date.today()
        if self.expiry_date <= now + timedelta(days=30):
            return "CRITICAL"
        if self.expiry_date <= now + timedelta(days=90):
            return "WARNING"
        return "HEALTHY"

    @computed_field
    @property
    def amount_to_buy(self) -> float:
        return max(0.0, self.min_quantity - self.quantity)

    model_config = ConfigDict(from_attributes=True)

class BoxBase(BaseModel):
    number: str
    location_id: int

class BoxCreate(BoxBase):
    pass

class Box(BoxBase):
    id: int
    uuid: str
    items: List[Item] = []
    model_config = ConfigDict(from_attributes=True)

class LocationBase(BaseModel):
    name: str
    description: Optional[str] = None

class LocationCreate(LocationBase):
    pass

class WeaponBase(BaseModel):
    model: str
    type: str
    caliber: str
    serial_number: str
    purchase_date: Optional[date] = None
    last_cleaned: Optional[date] = None
    status: str = "Bereit"
    location_id: Optional[int] = None

class WeaponCreate(WeaponBase):
    pass

class Weapon(WeaponBase):
    id: int
    
    @computed_field
    @property
    def days_since_cleaning(self) -> int:
        if not self.last_cleaned:
            return 0
        return (date.today() - self.last_cleaned).days

    model_config = ConfigDict(from_attributes=True)

class AmmunitionBase(BaseModel):
    caliber: str
    brand: str
    type: str
    quantity: float
    batch_number: Optional[str] = None
    location_id: int

class AmmunitionCreate(AmmunitionBase):
    pass

class Ammunition(AmmunitionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class ArsenalStats(BaseModel):
    caliber: str
    total_quantity: float
    is_critical: bool

class Location(LocationBase):
    id: int
    boxes: List[Box] = []
    model_config = ConfigDict(from_attributes=True)
