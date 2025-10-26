from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime


class SPARQLResponse(BaseModel):
    """Base response model for SPARQL queries."""
    success: bool = True
    message: Optional[str] = None
    count: int = 0


class PersonBase(BaseModel):
    """Base model for Person class."""
    id: str
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    birthDate: Optional[date] = None
    nationality: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    gender: Optional[str] = None


class TeamBase(BaseModel):
    """Base model for Team class."""
    id: str
    teamName: Optional[str] = None
    foundedYear: Optional[int] = None
    primaryColor: Optional[str] = None
    secondaryColor: Optional[str] = None
    squadSize: Optional[int] = None
    budget: Optional[float] = None


class CompetitionBase(BaseModel):
    """Base model for Competition class."""
    id: str
    competitionName: Optional[str] = None
    startDate: Optional[date] = None
    endDate: Optional[date] = None
    numberOfTeams: Optional[int] = None
    season: Optional[str] = None


class VenueBase(BaseModel):
    """Base model for Venue class."""
    id: str
    venueName: Optional[str] = None
    capacity: Optional[int] = None
    city: Optional[str] = None
    country: Optional[str] = None
    openedYear: Optional[int] = None
    surfaceType: Optional[str] = None
    isIndoor: Optional[bool] = None


class SportBase(BaseModel):
    """Base model for SportDiscipline class."""
    id: str
    sportName: Optional[str] = None
    isOlympic: Optional[bool] = None
    originCountry: Optional[str] = None
    globalParticipants: Optional[int] = None