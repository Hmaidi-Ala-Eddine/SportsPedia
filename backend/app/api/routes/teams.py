from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.domain.team_service import team_service

router = APIRouter(prefix="/teams", tags=["Teams"])


@router.get("")
async def get_teams(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0)
):
    """
    Get all teams.
    
    - **limit**: Maximum number of results (1-500)
    - **offset**: Number of results to skip
    """
    try:
        return await team_service.get_all_teams(limit=limit, offset=offset)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{team_id}")
async def get_team(team_id: str):
    """
    Get team by ID.
    
    - **team_id**: Unique team identifier (e.g., 'RealMadrid')
    """
    try:
        team = await team_service.get_team_by_id(team_id)
        if not team:
            raise HTTPException(status_code=404, detail=f"Team {team_id} not found")
        return team
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{team_id}/roster")
async def get_team_roster(team_id: str):
    """
    Get team roster (all athletes).
    
    - **team_id**: Unique team identifier
    """
    try:
        roster = await team_service.get_team_roster(team_id)
        return {
            "teamId": team_id,
            "athletes": roster,
            "total": len(roster)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
