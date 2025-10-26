from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from app.models.base import PersonBase


class Athlete(PersonBase):
    """Athlete model with sports-specific fields."""
    jerseyNumber: Optional[int] = None
    position: Optional[str] = None
    marketValue: Optional[float] = None
    salary: Optional[float] = None
    goalsScored: Optional[int] = None
    assists: Optional[int] = None
    matchesPlayed: Optional[int] = None
    yellowCards: Optional[int] = None
    redCards: Optional[int] = None
    isCaptain: Optional[bool] = None
    team: Optional[str] = None
    sport: Optional[str] = None


class AthleteDetail(Athlete):
    """Detailed athlete model with related entities."""
    teamName: Optional[str] = None
    sportName: Optional[str] = None
    coach: Optional[str] = None
    competitions: Optional[List[str]] = []


class AthleteList(BaseModel):
    """Response model for list of athletes."""
    athletes: List[Athlete]
    total: int


class Coach(PersonBase):
    """Coach model."""
    coachingLicense: Optional[str] = None
    yearsExperience: Optional[int] = None
    winPercentage: Optional[float] = None
    titlesWon: Optional[int] = None
    team: Optional[str] = None


class Referee(PersonBase):
    """Referee model."""
    certificateLevel: Optional[str] = None
    matchesRefereed: Optional[int] = None