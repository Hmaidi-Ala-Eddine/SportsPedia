from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from app.models.base import PersonBase


# ============ ATHLETE MODELS ============

class AthleteCreate(BaseModel):
    """Model for creating a new athlete."""
    id: str = Field(..., description="Unique athlete identifier")
    firstName: str
    lastName: str
    birthDate: Optional[date] = None
    nationality: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    gender: Optional[str] = None
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
    contractStart: Optional[date] = None
    contractEnd: Optional[date] = None
    team: Optional[str] = None
    sport: Optional[str] = None


class AthleteUpdate(BaseModel):
    """Model for updating an athlete."""
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    birthDate: Optional[date] = None
    nationality: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    gender: Optional[str] = None
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
    contractStart: Optional[date] = None
    contractEnd: Optional[date] = None
    team: Optional[str] = None
    sport: Optional[str] = None


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
    contractStart: Optional[date] = None
    contractEnd: Optional[date] = None


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


# ============ COACH MODELS ============

class CoachCreate(BaseModel):
    """Model for creating a new coach."""
    id: str = Field(..., description="Unique coach identifier")
    firstName: str
    lastName: str
    birthDate: Optional[date] = None
    nationality: Optional[str] = None
    coachingLicense: Optional[str] = None
    yearsExperience: Optional[int] = None
    winPercentage: Optional[float] = None
    titlesWon: Optional[int] = None
    team: Optional[str] = None


class CoachUpdate(BaseModel):
    """Model for updating a coach."""
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    birthDate: Optional[date] = None
    nationality: Optional[str] = None
    coachingLicense: Optional[str] = None
    yearsExperience: Optional[int] = None
    winPercentage: Optional[float] = None
    titlesWon: Optional[int] = None
    team: Optional[str] = None


class Coach(PersonBase):
    """Coach model."""
    coachingLicense: Optional[str] = None
    yearsExperience: Optional[int] = None
    winPercentage: Optional[float] = None
    titlesWon: Optional[int] = None
    team: Optional[str] = None


class CoachList(BaseModel):
    """Response model for list of coaches."""
    coaches: List[Coach]
    total: int


# ============ REFEREE MODELS ============

class RefereeCreate(BaseModel):
    """Model for creating a new referee."""
    id: str = Field(..., description="Unique referee identifier")
    firstName: str
    lastName: str
    birthDate: Optional[date] = None
    nationality: Optional[str] = None
    certificateLevel: Optional[str] = None
    matchesRefereed: Optional[int] = None


class RefereeUpdate(BaseModel):
    """Model for updating a referee."""
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    birthDate: Optional[date] = None
    nationality: Optional[str] = None
    certificateLevel: Optional[str] = None
    matchesRefereed: Optional[int] = None


class Referee(PersonBase):
    """Referee model."""
    certificateLevel: Optional[str] = None
    matchesRefereed: Optional[int] = None


class RefereeList(BaseModel):
    """Response model for list of referees."""
    referees: List[Referee]
    total: int