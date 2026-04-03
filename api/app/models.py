import uuid
from datetime import date
from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)

    boxes = relationship("Box", back_populates="location")

class Box(Base):
    __tablename__ = "boxes"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String, unique=True, index=True)
    uuid = Column(String, unique=True, default=lambda: str(uuid.uuid4()))
    location_id = Column(Integer, ForeignKey("locations.id"))

    location = relationship("Location", back_populates="boxes")
    items = relationship("Item", back_populates="box")

class Weapon(Base):
    __tablename__ = "weapons"

    id = Column(Integer, primary_key=True, index=True)
    model = Column(String, index=True)
    type = Column(String)  # Pistole, Büchse, etc.
    caliber = Column(String, index=True)
    serial_number = Column(String, unique=True, index=True)
    purchase_date = Column(Date, nullable=True)
    last_cleaned = Column(Date, default=lambda: date.today())
    status = Column(String, default="Bereit")
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=True)

    location = relationship("Location")

class Ammunition(Base):
    __tablename__ = "ammunition"

    id = Column(Integer, primary_key=True, index=True)
    caliber = Column(String, index=True)
    brand = Column(String)
    type = Column(String)  # FMJ, HP, etc.
    quantity = Column(Float, default=0.0)
    batch_number = Column(String, nullable=True)
    location_id = Column(Integer, ForeignKey("locations.id"))

    location = relationship("Location")

class Shelter(Base):
    __tablename__ = "shelters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)  # Festbau, Camp, etc.
    lat = Column(Float)
    lng = Column(Float)
    capacity = Column(Integer, default=1)
    water_source = Column(Boolean, default=False)
    heat_source = Column(Boolean, default=False)
    notes = Column(String, nullable=True)

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String, default="Allgemein", index=True)
    expiry_date = Column(Date, nullable=True)
    quantity = Column(Float, default=0.0)
    unit = Column(String)
    min_quantity = Column(Float, default=0.0)
    on_shopping_list = Column(Boolean, default=False)
    box_id = Column(Integer, ForeignKey("boxes.id"))

    box = relationship("Box", back_populates="items")
