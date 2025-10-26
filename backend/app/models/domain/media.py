from pydantic import BaseModel
from typing import Optional, List


class Media(BaseModel):
    """Media model."""
    id: str
    name: Optional[str] = None
    type: Optional[str] = None
    broadcastDate: Optional[str] = None
    event: Optional[str] = None
    broadcaster: Optional[str] = None
    duration: Optional[int] = None
    viewership: Optional[int] = None


class Broadcast(Media):
    """Broadcast model (subclass of Media)."""
    liveStatus: Optional[bool] = None
    channels: Optional[List[str]] = []
    languages: Optional[List[str]] = []


class Broadcaster(BaseModel):
    """Broadcaster model."""
    id: str
    name: Optional[str] = None
    country: Optional[str] = None
    foundedYear: Optional[int] = None
    headquarters: Optional[str] = None
    coverage: Optional[str] = None


class MediaList(BaseModel):
    """Response model for list of media."""
    media: List[Media]
    total: int


class BroadcasterList(BaseModel):
    """Response model for list of broadcasters."""
    broadcasters: List[Broadcaster]
    total: int
