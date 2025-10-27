from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.services.domain.competition_service import competition_service
from app.models.domain.competition import CompetitionCreate, CompetitionUpdate

router = APIRouter(prefix="/competitions", tags=["Competitions"])


@router.get("")
async def get_competitions(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0)
):
    """
    Get all competitions.
    
    - **limit**: Maximum number of results (1-500)
    - **offset**: Number of results to skip
    """
    try:
        return await competition_service.get_all_competitions(limit=limit, offset=offset)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/leagues")
async def get_leagues(
    limit: int = Query(default=100, ge=1, le=500)
):
    """
    Get all leagues.
    
    - **limit**: Maximum number of results (1-500)
    """
    try:
        leagues = await competition_service.get_leagues(limit=limit)
        return {"leagues": leagues, "total": len(leagues)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/matches")
async def get_matches(
    limit: int = Query(default=100, ge=1, le=500),
    competition_id: Optional[str] = Query(default=None)
):
    """
    Get matches, optionally filtered by competition.
    
    - **limit**: Maximum number of results (1-500)
    - **competition_id**: Optional competition filter
    """
    try:
        matches = await competition_service.get_matches(limit=limit, competition_id=competition_id)
        return {"matches": matches, "total": len(matches)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_competition(competition: CompetitionCreate):
    """Create a new competition."""
    try:
        return await competition_service.create_competition(competition)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{competition_id}")
async def update_competition(competition_id: str, competition: CompetitionUpdate):
    """Update an existing competition."""
    try:
        updated = await competition_service.update_competition(competition_id, competition)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Competition {competition_id} not found")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{competition_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_competition(competition_id: str):
    """Delete a competition."""
    try:
        await competition_service.delete_competition(competition_id)
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
