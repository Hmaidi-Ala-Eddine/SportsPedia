from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.domain.equipment_service import equipment_service

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
