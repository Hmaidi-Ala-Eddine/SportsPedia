from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date


class PerformanceCreate(BaseModel):
    """Model for creating a new performance/record."""
    id: str = Field(..., description="Unique performance identifier")
    performanceValue: float
    unit: Optional[str] = None
    recordDate: Optional[date] = None
    recordType: Optional[str] = None
    achievedBy: Optional[str] = None
    recordedIn: Optional[str] = None


class PerformanceUpdate(BaseModel):
    """Model for updating a performance/record."""
    performanceValue: Optional[float] = None
    unit: Optional[str] = None
    recordDate: Optional[date] = None
    recordType: Optional[str] = None
    achievedBy: Optional[str] = None
    recordedIn: Optional[str] = None


class Record(BaseModel):
    """Record model."""
    id: str
    recordType: Optional[str] = None
    value: Optional[str] = None
    athleteId: Optional[str] = None
    athleteName: Optional[str] = None
    date: Optional[str] = None
    sport: Optional[str] = None
    location: Optional[str] = None


class Statistics(BaseModel):
    """Statistics model."""
    id: str
    entityType: Optional[str] = None
    entityId: Optional[str] = None
    season: Optional[str] = None
    stats: Optional[dict] = {}


class Achievement(BaseModel):
    """Achievement model."""
    id: str
    achievementType: Optional[str] = None
    title: Optional[str] = None
    achiever: Optional[str] = None
    date: Optional[str] = None
    competition: Optional[str] = None


class Ranking(BaseModel):
    """Ranking model."""
    rank: int
    entityId: str
    entityName: Optional[str] = None
    points: Optional[float] = None
    category: Optional[str] = None


class RecordList(BaseModel):
    """Response model for list of records."""
    records: List[Record]
    total: int


class RankingList(BaseModel):
    """Response model for list of rankings."""
    rankings: List[Ranking]
    total: int
