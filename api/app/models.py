import uuid
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
