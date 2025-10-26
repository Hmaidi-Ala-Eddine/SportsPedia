from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from app.models.base import CompetitionBase


class Competition(CompetitionBase):
    """Competition model."""
    name: Optional[str] = None
    season: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    type: Optional[str] = None
    sport: Optional[str] = None


class League(Competition):
    """League model (subclass of Competition)."""
    country: Optional[str] = None
    numberOfTeams: Optional[int] = None
    currentChampion: Optional[str] = None


class Tournament(Competition):
    """Tournament model (subclass of Competition)."""
    knockoutFormat: Optional[bool] = None
    numberOfRounds: Optional[int] = None
    prizePool: Optional[float] = None


class Match(BaseModel):
    """Match model."""
    id: str
    homeTeam: Optional[str] = None
    awayTeam: Optional[str] = None
    date: Optional[str] = None
    venue: Optional[str] = None
    homeScore: Optional[int] = None
    awayScore: Optional[int] = None
    status: Optional[str] = None
    competition: Optional[str] = None


class CompetitionList(BaseModel):
    """Response model for list of competitions."""
    competitions: List[Competition]
    total: int


class MatchList(BaseModel):
    """Response model for list of matches."""
    matches: List[Match]
    total: int
