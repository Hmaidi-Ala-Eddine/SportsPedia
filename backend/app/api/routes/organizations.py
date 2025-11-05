from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.services.domain.organization_service import organization_service
from app.models.domain.organization import OrganizationCreate, OrganizationUpdate

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


@router.get("/{organization_id}")
async def get_organization(organization_id: str):
    """
    Get organization by ID.
    
    - **organization_id**: Unique organization identifier
    """
    try:
        organization = await organization_service.get_organization_by_id(organization_id)
        if not organization:
            raise HTTPException(status_code=404, detail=f"Organization {organization_id} not found")
        return organization
    except HTTPException:
        raise
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


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_organization(organization: OrganizationCreate):
    """Create a new organization."""
    try:
        return await organization_service.create_organization(organization)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{organization_id}")
async def update_organization(organization_id: str, organization: OrganizationUpdate):
    """Update an existing organization."""
    try:
        updated = await organization_service.update_organization(organization_id, organization)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Organization {organization_id} not found")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{organization_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_organization(organization_id: str):
    """Delete an organization."""
    try:
        await organization_service.delete_organization(organization_id)
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
