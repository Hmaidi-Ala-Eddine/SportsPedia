from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.models.domain.person import (
    Athlete, AthleteList, AthleteCreate, AthleteUpdate
)
from app.services.domain.person_service import person_service

router = APIRouter(prefix="/persons", tags=["Persons"])


# ============ ATHLETE CRUD ENDPOINTS ============

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


@router.post("/athletes", response_model=Athlete, status_code=status.HTTP_201_CREATED)
async def create_athlete(athlete: AthleteCreate):
    """
    Create a new athlete.
    
    - **id**: Unique athlete identifier
    - **firstName**: First name
    - **lastName**: Last name
    - **Additional fields**: nationality, position, jerseyNumber, etc.
    """
    try:
        return await person_service.create_athlete(athlete)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/athletes/{athlete_id}", response_model=Athlete)
async def update_athlete(athlete_id: str, athlete: AthleteUpdate):
    """
    Update an existing athlete.
    
    - **athlete_id**: Unique athlete identifier
    - **Request body**: Fields to update
    """
    try:
        updated = await person_service.update_athlete(athlete_id, athlete)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Athlete {athlete_id} not found")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/athletes/{athlete_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_athlete(athlete_id: str):
    """
    Delete an athlete.
    
    - **athlete_id**: Unique athlete identifier
    """
    try:
        success = await person_service.delete_athlete(athlete_id)
        if not success:
            raise HTTPException(status_code=404, detail=f"Athlete {athlete_id} not found")
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))