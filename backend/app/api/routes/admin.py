"""
Admin API Routes - CRUD operations for RDF data
Requires admin authentication
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import Dict
from app.services.rdf_crud_service import rdf_crud_service
from app.utils.auth import get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["Admin"])


def require_admin(current_user: User = Depends(get_current_active_user)):
    """Verify user is admin."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


# ==================== ATHLETE CRUD ====================

@router.post("/athletes", dependencies=[Depends(require_admin)])
async def create_athlete(data: Dict):
    """Create a new athlete."""
    try:
        athlete_id = rdf_crud_service.create_athlete(data)
        return {"success": True, "id": athlete_id, "message": "Athlete created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/athletes/{athlete_id}", dependencies=[Depends(require_admin)])
async def update_athlete(athlete_id: str, data: Dict):
    """Update an existing athlete."""
    try:
        rdf_crud_service.update_athlete(athlete_id, data)
        return {"success": True, "message": "Athlete updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/athletes/{athlete_id}", dependencies=[Depends(require_admin)])
async def delete_athlete(athlete_id: str):
    """Delete an athlete."""
    try:
        rdf_crud_service.delete_athlete(athlete_id)
        return {"success": True, "message": "Athlete deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== COACH CRUD ====================

@router.post("/coaches", dependencies=[Depends(require_admin)])
async def create_coach(data: Dict):
    """Create a new coach."""
    try:
        coach_id = rdf_crud_service.create_coach(data)
        return {"success": True, "id": coach_id, "message": "Coach created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/coaches/{coach_id}", dependencies=[Depends(require_admin)])
async def update_coach(coach_id: str, data: Dict):
    """Update an existing coach."""
    try:
        rdf_crud_service.update_coach(coach_id, data)
        return {"success": True, "message": "Coach updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/coaches/{coach_id}", dependencies=[Depends(require_admin)])
async def delete_coach(coach_id: str):
    """Delete a coach."""
    try:
        rdf_crud_service.delete_coach(coach_id)
        return {"success": True, "message": "Coach deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== ACHIEVEMENT CRUD ====================

@router.post("/achievements", dependencies=[Depends(require_admin)])
async def create_achievement(data: Dict):
    """Create a new achievement."""
    try:
        achievement_id = rdf_crud_service.create_achievement(data)
        return {"success": True, "id": achievement_id, "message": "Achievement created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/achievements/{achievement_id}", dependencies=[Depends(require_admin)])
async def update_achievement(achievement_id: str, data: Dict):
    """Update an existing achievement."""
    try:
        rdf_crud_service.update_achievement(achievement_id, data)
        return {"success": True, "message": "Achievement updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/achievements/{achievement_id}", dependencies=[Depends(require_admin)])
async def delete_achievement(achievement_id: str):
    """Delete an achievement."""
    try:
        rdf_crud_service.delete_achievement(achievement_id)
        return {"success": True, "message": "Achievement deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== RECORD CRUD ====================

@router.post("/records", dependencies=[Depends(require_admin)])
async def create_record(data: Dict):
    """Create a new record."""
    try:
        record_id = rdf_crud_service.create_record(data)
        return {"success": True, "id": record_id, "message": "Record created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/records/{record_id}", dependencies=[Depends(require_admin)])
async def update_record(record_id: str, data: Dict):
    """Update an existing record."""
    try:
        rdf_crud_service.update_record(record_id, data)
        return {"success": True, "message": "Record updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/records/{record_id}", dependencies=[Depends(require_admin)])
async def delete_record(record_id: str):
    """Delete a record."""
    try:
        rdf_crud_service.delete_record(record_id)
        return {"success": True, "message": "Record deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== REFEREE CRUD ====================

@router.post("/referees", dependencies=[Depends(require_admin)])
async def create_referee(data: Dict):
    """Create a new referee."""
    try:
        referee_id = rdf_crud_service.create_referee(data)
        return {"success": True, "id": referee_id, "message": "Referee created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/referees/{referee_id}", dependencies=[Depends(require_admin)])
async def update_referee(referee_id: str, data: Dict):
    """Update an existing referee."""
    try:
        rdf_crud_service.update_referee(referee_id, data)
        return {"success": True, "message": "Referee updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/referees/{referee_id}", dependencies=[Depends(require_admin)])
async def delete_referee(referee_id: str):
    """Delete a referee."""
    try:
        rdf_crud_service.delete_referee(referee_id)
        return {"success": True, "message": "Referee deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== TEAM CRUD ====================

@router.post("/teams", dependencies=[Depends(require_admin)])
async def create_team(data: Dict):
    """Create a new team."""
    try:
        team_id = rdf_crud_service.create_team(data)
        return {"success": True, "id": team_id, "message": "Team created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/teams/{team_id}", dependencies=[Depends(require_admin)])
async def update_team(team_id: str, data: Dict):
    """Update an existing team."""
    try:
        rdf_crud_service.update_team(team_id, data)
        return {"success": True, "message": "Team updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/teams/{team_id}", dependencies=[Depends(require_admin)])
async def delete_team(team_id: str):
    """Delete a team."""
    try:
        rdf_crud_service.delete_team(team_id)
        return {"success": True, "message": "Team deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== COMPETITION CRUD ====================

@router.post("/competitions", dependencies=[Depends(require_admin)])
async def create_competition(data: Dict):
    """Create a new competition."""
    try:
        competition_id = rdf_crud_service.create_competition(data)
        return {"success": True, "id": competition_id, "message": "Competition created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/competitions/{competition_id}", dependencies=[Depends(require_admin)])
async def update_competition(competition_id: str, data: Dict):
    """Update an existing competition."""
    try:
        rdf_crud_service.update_competition(competition_id, data)
        return {"success": True, "message": "Competition updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/competitions/{competition_id}", dependencies=[Depends(require_admin)])
async def delete_competition(competition_id: str):
    """Delete a competition."""
    try:
        rdf_crud_service.delete_competition(competition_id)
        return {"success": True, "message": "Competition deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== ORGANIZATION CRUD ====================

@router.post("/organizations", dependencies=[Depends(require_admin)])
async def create_organization(data: Dict):
    """Create a new organization."""
    try:
        organization_id = rdf_crud_service.create_organization(data)
        return {"success": True, "id": organization_id, "message": "Organization created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/organizations/{organization_id}", dependencies=[Depends(require_admin)])
async def update_organization(organization_id: str, data: Dict):
    """Update an existing organization."""
    try:
        rdf_crud_service.update_organization(organization_id, data)
        return {"success": True, "message": "Organization updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/organizations/{organization_id}", dependencies=[Depends(require_admin)])
async def delete_organization(organization_id: str):
    """Delete an organization."""
    try:
        rdf_crud_service.delete_organization(organization_id)
        return {"success": True, "message": "Organization deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
