from pydantic import BaseModel, Field
from typing import Optional, List


class OrganizationCreate(BaseModel):
    """Model for creating a new organization."""
    id: str = Field(..., description="Unique organization identifier")
    organization_type: str = Field(..., description="Organization type: Federation, Club, League_Org, SportsAgency, AntiDoping")
    organizationName: str
    establishedYear: Optional[int] = None
    headquarters: Optional[str] = None
    president: Optional[str] = None
    memberCount: Optional[int] = None
    description: Optional[str] = None
    jurisdiction: Optional[str] = None
    annualRevenue: Optional[float] = None
    organizes: Optional[str] = None
    manages: Optional[str] = None
    foundingMembers: Optional[str] = None
    broadcastCountries: Optional[int] = None
    salaryCap: Optional[float] = None
    ownershipModel: Optional[str] = None
    homeStadium: Optional[str] = None
    philosophy: Optional[str] = None
    sportsManaged: Optional[str] = None
    servicesOffered: Optional[str] = None
    notableClients: Optional[str] = None


class OrganizationUpdate(BaseModel):
    """Model for updating an organization."""
    organizationName: Optional[str] = None
    establishedYear: Optional[int] = None
    headquarters: Optional[str] = None
    president: Optional[str] = None
    memberCount: Optional[int] = None
    description: Optional[str] = None
    jurisdiction: Optional[str] = None
    annualRevenue: Optional[float] = None
    organizes: Optional[str] = None
    manages: Optional[str] = None
    broadcastCountries: Optional[int] = None
    ownershipModel: Optional[str] = None
    sportsManaged: Optional[str] = None
    servicesOffered: Optional[str] = None


class Organization(BaseModel):
    """Organization model."""
    id: str
    organization_type: Optional[str] = None
    name: Optional[str] = None
    organizationName: Optional[str] = None
    foundedYear: Optional[int] = None
    establishedYear: Optional[int] = None
    headquarters: Optional[str] = None
    type: Optional[str] = None
    president: Optional[str] = None
    members: Optional[int] = None
    memberCount: Optional[int] = None
    description: Optional[str] = None
    jurisdiction: Optional[str] = None
    annualRevenue: Optional[float] = None
    organizes: Optional[str] = None
    manages: Optional[str] = None
    foundingMembers: Optional[str] = None
    broadcastCountries: Optional[int] = None
    salaryCap: Optional[float] = None
    ownershipModel: Optional[str] = None
    homeStadium: Optional[str] = None
    philosophy: Optional[str] = None
    sportsManaged: Optional[str] = None
    servicesOffered: Optional[str] = None
    notableClients: Optional[str] = None


class Federation(Organization):
    """Federation model (subclass of Organization)."""
    sport: Optional[str] = None
    affiliatedNationalBodies: Optional[int] = None
    internationalRecognition: Optional[bool] = None


class SportsLeagueOrg(Organization):
    """Sports League Organization model."""
    numberOfTeams: Optional[int] = None
    currentSeason: Optional[str] = None
    commissioner: Optional[str] = None


class OrganizationDetail(Organization):
    """Detailed organization model with related entities."""
    governedSports: Optional[List[str]] = []
    organizedCompetitions: Optional[List[str]] = []


class OrganizationList(BaseModel):
    """Response model for list of organizations."""
    organizations: List[Organization]
    total: int
