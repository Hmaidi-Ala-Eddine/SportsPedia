from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.services.domain.venue_service import venue_service
from app.models.domain.venue import VenueCreate, VenueUpdate

router = APIRouter(prefix="/venues", tags=["Venues"])


@router.get("")
async def get_venues(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0)
):
    """
    Get all venues.
    
    - **limit**: Maximum number of results (1-500)
    - **offset**: Number of results to skip
    """
    try:
        return await venue_service.get_all_venues(limit=limit, offset=offset)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stadiums")
async def get_stadiums(
    limit: int = Query(default=100, ge=1, le=500)
):
    """
    Get all stadiums.
    
    - **limit**: Maximum number of results (1-500)
    """
    try:
        stadiums = await venue_service.get_stadiums(limit=limit)
        return {"stadiums": stadiums, "total": len(stadiums)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{venue_id}")
async def get_venue(venue_id: str):
    """
    Get venue by ID.
    
    - **venue_id**: Unique venue identifier (e.g., 'CampNou')
    """
    try:
        venue = await venue_service.get_venue_by_id(venue_id)
        if not venue:
            raise HTTPException(status_code=404, detail=f"Venue {venue_id} not found")
        return venue
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_venue(venue: VenueCreate):
    """Create a new venue."""
    try:
        return await venue_service.create_venue(venue)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{venue_id}")
async def update_venue(venue_id: str, venue: VenueUpdate):
    """Update an existing venue."""
    try:
        updated = await venue_service.update_venue(venue_id, venue)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Venue {venue_id} not found")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{venue_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_venue(venue_id: str):
    """Delete a venue."""
    try:
        await venue_service.delete_venue(venue_id)
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
