from pydantic import BaseModel
from typing import Optional, List
from app.models.base import SportBase


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
