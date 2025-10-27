from pydantic import BaseModel, Field
from typing import Optional, List
from app.models.base import VenueBase


class VenueCreate(BaseModel):
    """Model for creating a new venue."""
    id: str = Field(..., description="Unique venue identifier")
    venueName: str
    capacity: Optional[int] = None
    city: Optional[str] = None
    country: Optional[str] = None
    openedYear: Optional[int] = None
    surfaceType: Optional[str] = None
    isIndoor: Optional[bool] = None


class VenueUpdate(BaseModel):
    """Model for updating a venue."""
    venueName: Optional[str] = None
    capacity: Optional[int] = None
    city: Optional[str] = None
    country: Optional[str] = None
    openedYear: Optional[int] = None
    surfaceType: Optional[str] = None
    isIndoor: Optional[bool] = None


class Venue(VenueBase):
    """Venue model."""
    name: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    capacity: Optional[int] = None
    openedYear: Optional[int] = None
    surface: Optional[str] = None
    roofType: Optional[str] = None


class Stadium(Venue):
    """Stadium model (subclass of Venue)."""
    hasRunningTrack: Optional[bool] = None
    numberOfSeats: Optional[int] = None
    standingCapacity: Optional[int] = None


class VenueDetail(Venue):
    """Detailed venue model with related entities."""
    homeTeams: Optional[List[str]] = []
    upcomingEvents: Optional[List[str]] = []
    totalEventsHosted: Optional[int] = None


class VenueList(BaseModel):
    """Response model for list of venues."""
    venues: List[Venue]
    total: int
