from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.domain.media_service import media_service

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
