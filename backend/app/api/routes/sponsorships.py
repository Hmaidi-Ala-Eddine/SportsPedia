from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.services.domain.sponsorship_service import sponsorship_service
from app.models.domain.sponsorship import SponsorshipCreate, SponsorshipUpdate

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


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_sponsorship(sponsorship: SponsorshipCreate):
    """Create a new sponsorship."""
    try:
        return await sponsorship_service.create_sponsorship(sponsorship)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{sponsorship_id}")
async def update_sponsorship(sponsorship_id: str, sponsorship: SponsorshipUpdate):
    """Update an existing sponsorship."""
    try:
        updated = await sponsorship_service.update_sponsorship(sponsorship_id, sponsorship)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Sponsorship {sponsorship_id} not found")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{sponsorship_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sponsorship(sponsorship_id: str):
    """Delete a sponsorship."""
    try:
        await sponsorship_service.delete_sponsorship(sponsorship_id)
        return None
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


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_sponsorship(sponsorship: SponsorshipCreate):
    """Create a new sponsorship."""
    try:
        return await sponsorship_service.create_sponsorship(sponsorship)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{sponsorship_id}")
async def update_sponsorship(sponsorship_id: str, sponsorship: SponsorshipUpdate):
    """Update an existing sponsorship."""
    try:
        updated = await sponsorship_service.update_sponsorship(sponsorship_id, sponsorship)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Sponsorship {sponsorship_id} not found")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{sponsorship_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sponsorship(sponsorship_id: str):
    """Delete a sponsorship."""
    try:
        await sponsorship_service.delete_sponsorship(sponsorship_id)
        return None
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


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_sponsorship(sponsorship: SponsorshipCreate):
    """Create a new sponsorship."""
    try:
        return await sponsorship_service.create_sponsorship(sponsorship)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{sponsorship_id}")
async def update_sponsorship(sponsorship_id: str, sponsorship: SponsorshipUpdate):
    """Update an existing sponsorship."""
    try:
        updated = await sponsorship_service.update_sponsorship(sponsorship_id, sponsorship)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Sponsorship {sponsorship_id} not found")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{sponsorship_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sponsorship(sponsorship_id: str):
    """Delete a sponsorship."""
    try:
        await sponsorship_service.delete_sponsorship(sponsorship_id)
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
