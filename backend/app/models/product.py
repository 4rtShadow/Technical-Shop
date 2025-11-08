from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class ProductCategory(str, enum.Enum):
    LAPTOPS = "laptops"
    SMARTPHONES = "smartphones"
    TABLETS = "tablets"
    HEADPHONES = "headphones"
    CAMERAS = "cameras"
    ACCESSORIES = "accessories"
    GAMING = "gaming"
    AUDIO = "audio"
    OTHER = "other"

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    category = Column(Enum(ProductCategory), nullable=False)
    image_url = Column(String, nullable=True)
    stock_quantity = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    cart_items = relationship("CartItem", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")

