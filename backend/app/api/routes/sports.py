from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.services.domain.sport_service import sport_service
from app.models.domain.sport import SportCreate, SportUpdate

router = APIRouter(prefix="/sports", tags=["Sports"])


@router.get("")
async def get_sports(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0)
):
    """
    Get all sport disciplines.
    
    - **limit**: Maximum number of results (1-500)
    - **offset**: Number of results to skip
    """
    try:
        return await sport_service.get_all_sports(limit=limit, offset=offset)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/team-sports")
async def get_team_sports(
    limit: int = Query(default=100, ge=1, le=500)
):
    """
    Get all team sports.
    
    - **limit**: Maximum number of results (1-500)
    """
    try:
        sports = await sport_service.get_team_sports(limit=limit)
        return {"sports": sports, "total": len(sports)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/individual-sports")
async def get_individual_sports(
    limit: int = Query(default=100, ge=1, le=500)
):
    """
    Get all individual sports.
    
    - **limit**: Maximum number of results (1-500)
    """
    try:
        sports = await sport_service.get_individual_sports(limit=limit)
        return {"sports": sports, "total": len(sports)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{sport_id}")
async def get_sport(sport_id: str):
    """
    Get sport discipline by ID.
    
    - **sport_id**: Unique sport identifier (e.g., 'Football')
    """
    try:
        sport = await sport_service.get_sport_by_id(sport_id)
        if not sport:
            raise HTTPException(status_code=404, detail=f"Sport {sport_id} not found")
        return sport
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_sport(sport: SportCreate):
    """Create a new sport."""
    try:
        return await sport_service.create_sport(sport)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{sport_id}")
async def update_sport(sport_id: str, sport: SportUpdate):
    """Update an existing sport."""
    try:
        updated = await sport_service.update_sport(sport_id, sport)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Sport {sport_id} not found")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{sport_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sport(sport_id: str):
    """Delete a sport."""
    try:
        await sport_service.delete_sport(sport_id)
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
