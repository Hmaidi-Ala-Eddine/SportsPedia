from pydantic import BaseModel
from typing import Optional, List


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
