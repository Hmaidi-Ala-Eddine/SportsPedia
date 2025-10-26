from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models.domain.person import Athlete, AthleteList
from app.services.domain.person_service import person_service

router = APIRouter(prefix="/persons", tags=["Persons"])


@router.get("/athletes", response_model=AthleteList)
async def get_athletes(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0)
):
    """
    Get all athletes.
    
    - **limit**: Maximum number of results (1-500)
    - **offset**: Number of results to skip
    """
    try:
        return await person_service.get_all_athletes(limit=limit, offset=offset)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/athletes/{athlete_id}", response_model=Athlete)
async def get_athlete(athlete_id: str):
    """
    Get athlete by ID.
    
    - **athlete_id**: Unique athlete identifier (e.g., 'LionelMessi')
    """
    try:
        athlete = await person_service.get_athlete_by_id(athlete_id)
        if not athlete:
            raise HTTPException(status_code=404, detail=f"Athlete {athlete_id} not found")
        return athlete
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))