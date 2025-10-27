from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.services.domain.team_service import team_service
from app.models.domain.team import TeamCreate, TeamUpdate

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


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_team(team: TeamCreate):
    """
    Create a new team.
    
    - **id**: Unique team identifier
    - **teamName**: Team name (required)
    - **Additional fields**: foundedYear, colors, budget, etc.
    """
    try:
        return await team_service.create_team(team)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{team_id}")
async def update_team(team_id: str, team: TeamUpdate):
    """
    Update an existing team.
    
    - **team_id**: Unique team identifier
    - **Request body**: Fields to update
    """
    try:
        updated = await team_service.update_team(team_id, team)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Team {team_id} not found")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team(team_id: str):
    """
    Delete a team.
    
    - **team_id**: Unique team identifier
    """
    try:
        success = await team_service.delete_team(team_id)
        if not success:
            raise HTTPException(status_code=404, detail=f"Team {team_id} not found")
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
