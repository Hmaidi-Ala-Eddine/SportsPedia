from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.domain.sponsorship_service import sponsorship_service

router = APIRouter(prefix="/sponsorships", tags=["Sponsorships"])


@router.get("")
async def get_sponsorships(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0)
):
    """
    Get all sponsorships.
    
    - **limit**: Maximum number of results (1-500)
    - **offset**: Number of results to skip
    """
    try:
        return await sponsorship_service.get_all_sponsorships(limit=limit, offset=offset)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/team/{team_id}")
async def get_team_sponsors(team_id: str):
    """
    Get all sponsors for a specific team.
    
    - **team_id**: Unique team identifier
    """
    try:
        sponsorships = await sponsorship_service.get_team_sponsors(team_id)
        return {"sponsorships": sponsorships, "total": len(sponsorships)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/athlete/{athlete_id}")
async def get_athlete_endorsements(athlete_id: str):
    """
    Get all endorsements for a specific athlete.
    
    - **athlete_id**: Unique athlete identifier
    """
    try:
        endorsements = await sponsorship_service.get_athlete_endorsements(athlete_id)
        return {"endorsements": endorsements, "total": len(endorsements)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
