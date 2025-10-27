from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.services.domain.equipment_service import equipment_service
from app.models.domain.equipment import EquipmentCreate, EquipmentUpdate

router = APIRouter(prefix="/equipment", tags=["Equipment"])


@router.get("")
async def get_equipment(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0)
):
    """
    Get all equipment.
    
    - **limit**: Maximum number of results (1-500)
    - **offset**: Number of results to skip
    """
    try:
        return await equipment_service.get_all_equipment(limit=limit, offset=offset)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sport/{sport_id}")
async def get_equipment_by_sport(
    sport_id: str,
    limit: int = Query(default=100, ge=1, le=500)
):
    """
    Get equipment used in a specific sport.
    
    - **sport_id**: Unique sport identifier
    - **limit**: Maximum number of results (1-500)
    """
    try:
        equipment = await equipment_service.get_equipment_by_sport(sport_id=sport_id, limit=limit)
        return {"equipment": equipment, "total": len(equipment)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_equipment(equipment: EquipmentCreate):
    """Create new equipment."""
    try:
        return await equipment_service.create_equipment(equipment)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{equipment_id}")
async def update_equipment(equipment_id: str, equipment: EquipmentUpdate):
    """Update existing equipment."""
    try:
        updated = await equipment_service.update_equipment(equipment_id, equipment)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Equipment {equipment_id} not found")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{equipment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_equipment(equipment_id: str):
    """Delete equipment."""
    try:
        await equipment_service.delete_equipment(equipment_id)
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
