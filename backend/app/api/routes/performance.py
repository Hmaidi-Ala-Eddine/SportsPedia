from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.services.domain.performance_service import performance_service
from app.models.domain.performance import PerformanceCreate, PerformanceUpdate

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


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_performance(performance: PerformanceCreate):
    """Create a new performance/record."""
    try:
        return await performance_service.create_performance(performance)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{performance_id}")
async def update_performance(performance_id: str, performance: PerformanceUpdate):
    """Update an existing performance/record."""
    try:
        updated = await performance_service.update_performance(performance_id, performance)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Performance {performance_id} not found")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{performance_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_performance(performance_id: str):
    """Delete a performance/record."""
    try:
        await performance_service.delete_performance(performance_id)
        return None
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


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_performance(performance: PerformanceCreate):
    """Create a new performance/record."""
    try:
        return await performance_service.create_performance(performance)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{performance_id}")
async def update_performance(performance_id: str, performance: PerformanceUpdate):
    """Update an existing performance/record."""
    try:
        updated = await performance_service.update_performance(performance_id, performance)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Performance {performance_id} not found")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{performance_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_performance(performance_id: str):
    """Delete a performance/record."""
    try:
        await performance_service.delete_performance(performance_id)
        return None
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


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_performance(performance: PerformanceCreate):
    """Create a new performance/record."""
    try:
        return await performance_service.create_performance(performance)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{performance_id}")
async def update_performance(performance_id: str, performance: PerformanceUpdate):
    """Update an existing performance/record."""
    try:
        updated = await performance_service.update_performance(performance_id, performance)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Performance {performance_id} not found")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{performance_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_performance(performance_id: str):
    """Delete a performance/record."""
    try:
        await performance_service.delete_performance(performance_id)
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
