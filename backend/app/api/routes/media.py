from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.services.domain.media_service import media_service
from app.models.domain.media import MediaCreate, MediaUpdate

router = APIRouter(prefix="/media", tags=["Media"])


@router.get("")
async def get_media(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0)
):
    """
    Get all media.
    
    - **limit**: Maximum number of results (1-500)
    - **offset**: Number of results to skip
    """
    try:
        return await media_service.get_all_media(limit=limit, offset=offset)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_media(media: MediaCreate):
    """Create new media."""
    try:
        return await media_service.create_media(media)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{media_id}")
async def update_media(media_id: str, media: MediaUpdate):
    """Update existing media."""
    try:
        updated = await media_service.update_media(media_id, media)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Media {media_id} not found")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_media(media_id: str):
    """Delete media."""
    try:
        await media_service.delete_media(media_id)
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/broadcasters")
async def get_broadcasters(
    limit: int = Query(default=100, ge=1, le=500)
):
    """
    Get all broadcasters.
    
    - **limit**: Maximum number of results (1-500)
    """
    try:
        broadcasters = await media_service.get_broadcasters(limit=limit)
        return {"broadcasters": broadcasters, "total": len(broadcasters)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_media(media: MediaCreate):
    """Create new media."""
    try:
        return await media_service.create_media(media)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{media_id}")
async def update_media(media_id: str, media: MediaUpdate):
    """Update existing media."""
    try:
        updated = await media_service.update_media(media_id, media)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Media {media_id} not found")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_media(media_id: str):
    """Delete media."""
    try:
        await media_service.delete_media(media_id)
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
