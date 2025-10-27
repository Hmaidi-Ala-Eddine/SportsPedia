from pydantic import BaseModel, Field
from typing import Optional, List


class SponsorshipCreate(BaseModel):
    """Model for creating a new sponsorship."""
    id: str = Field(..., description="Unique sponsorship identifier")
    sponsorName: str
    dealValue: Optional[float] = None
    contractDuration: Optional[int] = None
    industry: Optional[str] = None
    sponsors: Optional[str] = None
    endorses: Optional[str] = None


class SponsorshipUpdate(BaseModel):
    """Model for updating a sponsorship."""
    sponsorName: Optional[str] = None
    dealValue: Optional[float] = None
    contractDuration: Optional[int] = None
    industry: Optional[str] = None
    sponsors: Optional[str] = None
    endorses: Optional[str] = None


class Sponsorship(BaseModel):
    """Sponsorship model."""
    id: str
    sponsorId: Optional[str] = None
    sponsorName: Optional[str] = None
    sponsee: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    amount: Optional[float] = None
    type: Optional[str] = None


class Endorsement(Sponsorship):
    """Endorsement model (subclass of Sponsorship)."""
    athleteId: Optional[str] = None
    productCategory: Optional[str] = None


class TeamSponsorship(Sponsorship):
    """Team sponsorship model."""
    teamId: Optional[str] = None
    sponsorshipCategory: Optional[str] = None  # Main, Kit, Sleeve, etc.
    visibility: Optional[str] = None


class Sponsor(BaseModel):
    """Sponsor/Company model."""
    id: str
    companyName: Optional[str] = None
    industry: Optional[str] = None
    country: Optional[str] = None
    founded: Optional[int] = None
    totalSportsInvestment: Optional[float] = None


class SponsorshipList(BaseModel):
    """Response model for list of sponsorships."""
    sponsorships: List[Sponsorship]
    total: int
