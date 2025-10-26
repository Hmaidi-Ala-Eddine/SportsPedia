from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.domain.performance_service import performance_service

router = APIRouter(prefix="/performance", tags=["Performance"])


@router.get("/records")
async def get_records(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0)
):
    """
    Get all records.
    
    - **limit**: Maximum number of results (1-500)
    - **offset**: Number of results to skip
    """
    try:
        return await performance_service.get_all_records(limit=limit, offset=offset)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/records/athlete/{athlete_id}")
async def get_athlete_records(athlete_id: str):
    """
    Get all records for a specific athlete.
    
    - **athlete_id**: Unique athlete identifier
    """
    try:
        records = await performance_service.get_athlete_records(athlete_id)
        return {"records": records, "total": len(records)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/statistics/{entity_type}/{entity_id}")
async def get_statistics(entity_type: str, entity_id: str):
    """
    Get performance statistics for an entity.
    
    - **entity_type**: Type of entity (e.g., 'Athlete', 'Team')
    - **entity_id**: Unique entity identifier
    """
    try:
        statistics = await performance_service.get_statistics(entity_type=entity_type, entity_id=entity_id)
        return {
            "entityType": entity_type,
            "entityId": entity_id,
            "statistics": statistics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
