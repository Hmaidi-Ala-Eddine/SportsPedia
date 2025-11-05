from pydantic import BaseModel, Field
from typing import Optional, List
from app.models.base import TeamBase


class TeamCreate(BaseModel):
    """Model for creating a new team."""
    id: str = Field(..., description="Unique team identifier")
    team_type: str = Field(..., description="Team type: ProfessionalTeam, NationalTeam, AmateurTeam, YouthTeam, WomenTeam")
    teamName: str
    foundedYear: Optional[int] = None
    primaryColor: Optional[str] = None
    secondaryColor: Optional[str] = None
    squadSize: Optional[int] = None
    budget: Optional[float] = None
    currentRanking: Optional[int] = None
    wins: Optional[int] = None
    losses: Optional[int] = None
    draws: Optional[int] = None
    homeVenue: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    description: Optional[str] = None
    majorAchievements: Optional[str] = None
    estimatedFans: Optional[int] = None
    rivals: Optional[str] = None
    competition: Optional[str] = None


class TeamUpdate(BaseModel):
    """Model for updating a team."""
    teamName: Optional[str] = None
    foundedYear: Optional[int] = None
    primaryColor: Optional[str] = None
    secondaryColor: Optional[str] = None
    squadSize: Optional[int] = None
    budget: Optional[float] = None
    currentRanking: Optional[int] = None
    wins: Optional[int] = None
    losses: Optional[int] = None
    draws: Optional[int] = None
    homeVenue: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    description: Optional[str] = None
    majorAchievements: Optional[str] = None
    estimatedFans: Optional[int] = None
    rivals: Optional[str] = None
    competition: Optional[str] = None


class Team(TeamBase):
    """Team model."""
    team_type: Optional[str] = None
    name: Optional[str] = None
    teamName: Optional[str] = None
    foundedYear: Optional[int] = None
    primaryColor: Optional[str] = None
    secondaryColor: Optional[str] = None
    squadSize: Optional[int] = None
    budget: Optional[float] = None
    currentRanking: Optional[int] = None
    country: Optional[str] = None
    city: Optional[str] = None
    homeStadium: Optional[str] = None
    homeVenue: Optional[str] = None
    teamColors: Optional[str] = None
    league: Optional[str] = None
    wins: Optional[int] = None
    losses: Optional[int] = None
    draws: Optional[int] = None
    championships: Optional[int] = None
    description: Optional[str] = None
    majorAchievements: Optional[str] = None
    estimatedFans: Optional[int] = None
    rivals: Optional[str] = None


class TeamDetail(Team):
    """Detailed team model with related entities."""
    homeStadiumName: Optional[str] = None
    leagueName: Optional[str] = None
    coachName: Optional[str] = None
    rosterSize: Optional[int] = None
    avgPlayerAge: Optional[float] = None


class TeamList(BaseModel):
    """Response model for list of teams."""
    teams: List[Team]
    total: int


class TeamRoster(BaseModel):
    """Team roster with athletes."""
    teamId: str
    teamName: Optional[str] = None
    athletes: List[dict]
    total: int
