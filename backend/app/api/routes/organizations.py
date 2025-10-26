from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.domain.organization_service import organization_service

router = APIRouter(prefix="/organizations", tags=["Organizations"])


@router.get("")
async def get_organizations(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0)
):
    """
    Get all organizations.
    
    - **limit**: Maximum number of results (1-500)
    - **offset**: Number of results to skip
    """
    try:
        return await organization_service.get_all_organizations(limit=limit, offset=offset)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/federations")
async def get_federations(
    limit: int = Query(default=100, ge=1, le=500)
):
    """
    Get all federations (governing bodies).
    
    - **limit**: Maximum number of results (1-500)
    """
    try:
        federations = await organization_service.get_federations(limit=limit)
        return {"federations": federations, "total": len(federations)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
