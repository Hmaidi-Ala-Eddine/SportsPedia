from pydantic import BaseModel, Field
from typing import Optional, List
from app.models.base import SportBase


class SportCreate(BaseModel):
    """Model for creating a new sport."""
    id: str = Field(..., description="Unique sport identifier")
    sportName: str
    isOlympic: Optional[bool] = None
    originCountry: Optional[str] = None
    globalParticipants: Optional[int] = None


class SportUpdate(BaseModel):
    """Model for updating a sport."""
    sportName: Optional[str] = None
    isOlympic: Optional[bool] = None
    originCountry: Optional[str] = None
    globalParticipants: Optional[int] = None


class Sport(SportBase):
    """Sport discipline model."""
    name: Optional[str] = None
    category: Optional[str] = None
    isOlympic: Optional[bool] = None
    description: Optional[str] = None


class TeamSport(Sport):
    """Team sport model (subclass of SportDiscipline)."""
    teamSize: Optional[int] = None
    substitutesAllowed: Optional[int] = None


class IndividualSport(Sport):
    """Individual sport model (subclass of SportDiscipline)."""
    scoringSystem: Optional[str] = None
    worldRankingExists: Optional[bool] = None


class SportDetail(Sport):
    """Detailed sport model with related entities."""
    numberOfProfessionals: Optional[int] = None
    topLeagues: Optional[List[str]] = []
    equipment: Optional[List[str]] = []
    governingBody: Optional[str] = None


class SportList(BaseModel):
    """Response model for list of sports."""
    sports: List[Sport]
    total: int
