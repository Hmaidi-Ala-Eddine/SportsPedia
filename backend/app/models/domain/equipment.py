from pydantic import BaseModel, Field
from typing import Optional, List


class EquipmentCreate(BaseModel):
    """Model for creating new equipment."""
    id: str = Field(..., description="Unique equipment identifier")
    equipmentName: str
    brand: Optional[str] = None
    model: Optional[str] = None
    price: Optional[float] = None
    color: Optional[str] = None
    size: Optional[str] = None
    material: Optional[str] = None
    requiredFor: Optional[str] = None


class EquipmentUpdate(BaseModel):
    """Model for updating equipment."""
    equipmentName: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    price: Optional[float] = None
    color: Optional[str] = None
    size: Optional[str] = None
    material: Optional[str] = None
    requiredFor: Optional[str] = None


class Equipment(BaseModel):
    """Equipment model."""
    id: str
    name: Optional[str] = None
    sport: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    manufacturer: Optional[str] = None
    isRequired: Optional[bool] = None


class Ball(Equipment):
    """Ball model (subclass of Equipment)."""
    weight: Optional[float] = None
    circumference: Optional[float] = None
    material: Optional[str] = None


class ProtectiveGear(Equipment):
    """Protective gear model (subclass of Equipment)."""
    protectionArea: Optional[str] = None
    certificationStandard: Optional[str] = None


class EquipmentList(BaseModel):
    """Response model for list of equipment."""
    equipment: List[Equipment]
    total: int
