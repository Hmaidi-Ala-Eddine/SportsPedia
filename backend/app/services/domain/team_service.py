from typing import List, Optional, Dict, Any
from app.services.fuseki_client import fuseki_client
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri
from app.models.domain.team import TeamCreate, TeamUpdate
from app.services.crud_helper import SPARQLCRUDHelper
import logging

logger = logging.getLogger(__name__)


class TeamService:
    """Service for Team-related operations."""
    
    def __init__(self):
        self.client = fuseki_client
    
    async def get_all_teams(self, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """
        Get all teams.
        
        Args:
            limit: Maximum number of results
            offset: Number of results to skip
            
        Returns:
            Dict with teams list and total count
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?team ?name ?foundedYear ?country ?homeStadium ?coachName
        WHERE {{
            ?team a sport:Team .
            OPTIONAL {{ ?team sport:teamName ?name . }}
            OPTIONAL {{ ?team sport:foundedYear ?foundedYear . }}
            OPTIONAL {{ ?team sport:basedIn ?country . }}
            OPTIONAL {{ ?team sport:playsAt ?homeStadium . }}
            OPTIONAL {{ 
                ?team sport:hasCoach ?coach .
                ?coach sport:lastName ?coachName .
            }}
        }}
        LIMIT {limit}
        OFFSET {offset}
        """
        
        try:
            results = self.client.execute_query(query)
            teams_data = sparql_results_to_list(results)
            
            teams = []
            for data in teams_data:
                team = {
                    "id": extract_id_from_uri(data.get('team', '')),
                    "name": data.get('name'),
                    "foundedYear": int(data['foundedYear']) if data.get('foundedYear') else None,
                    "country": data.get('country'),
                    "homeStadium": extract_id_from_uri(data.get('homeStadium', '')) if data.get('homeStadium') else None,
                    "coachName": data.get('coachName')
                }
                teams.append(team)
            
            return {"teams": teams, "total": len(teams)}
            
        except Exception as e:
            logger.error(f"Error getting teams: {str(e)}")
            raise
    
    async def get_team_by_id(self, team_id: str) -> Optional[Dict[str, Any]]:
        """
        Get team by ID.
        
        Args:
            team_id: Team identifier
            
        Returns:
            Team dict or None
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT ?name ?foundedYear ?country ?homeStadium ?teamColors ?league
        WHERE {{
            sport:{team_id} a sport:Team .
            OPTIONAL {{ sport:{team_id} sport:teamName ?name . }}
            OPTIONAL {{ sport:{team_id} sport:foundedYear ?foundedYear . }}
            OPTIONAL {{ sport:{team_id} sport:basedIn ?country . }}
            OPTIONAL {{ sport:{team_id} sport:playsAt ?homeStadium . }}
            OPTIONAL {{ sport:{team_id} sport:teamColors ?teamColors . }}
            OPTIONAL {{ sport:{team_id} sport:competesIn ?league . }}
        }}
        LIMIT 1
        """
        
        try:
            results = self.client.execute_query(query)
            teams_data = sparql_results_to_list(results)
            
            if not teams_data:
                return None
            
            data = teams_data[0]
            
            team = {
                "id": team_id,
                "name": data.get('name'),
                "foundedYear": int(data['foundedYear']) if data.get('foundedYear') else None,
                "country": data.get('country'),
                "homeStadium": extract_id_from_uri(data.get('homeStadium', '')) if data.get('homeStadium') else None,
                "teamColors": data.get('teamColors'),
                "league": extract_id_from_uri(data.get('league', '')) if data.get('league') else None
            }
            
            return team
            
        except Exception as e:
            logger.error(f"Error getting team {team_id}: {str(e)}")
            raise
    
    async def get_team_roster(self, team_id: str) -> List[Dict[str, Any]]:
        """
        Get team roster (all athletes).
        
        Args:
            team_id: Team identifier
            
        Returns:
            List of athlete dicts
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT ?athlete ?firstName ?lastName ?position ?jerseyNumber
        WHERE {{
            ?athlete a sport:Athlete .
            ?athlete sport:playsFor sport:{team_id} .
            OPTIONAL {{ ?athlete sport:firstName ?firstName . }}
            OPTIONAL {{ ?athlete sport:lastName ?lastName . }}
            OPTIONAL {{ ?athlete sport:position ?position . }}
            OPTIONAL {{ ?athlete sport:jerseyNumber ?jerseyNumber . }}
        }}
        ORDER BY ?jerseyNumber ?lastName
        """
        
        try:
            results = self.client.execute_query(query)
            athletes_data = sparql_results_to_list(results)
            
            roster = []
            for data in athletes_data:
                athlete = {
                    "id": extract_id_from_uri(data.get('athlete', '')),
                    "firstName": data.get('firstName'),
                    "lastName": data.get('lastName'),
                    "position": data.get('position'),
                    "jerseyNumber": int(data['jerseyNumber']) if data.get('jerseyNumber') else None
                }
                roster.append(athlete)
            
            return roster
            
        except Exception as e:
            logger.error(f"Error getting roster for team {team_id}: {str(e)}")
            raise
    
    async def create_team(self, team_data: TeamCreate) -> Dict[str, Any]:
        """Create a new team."""
        data_dict = team_data.dict(exclude={'id'}, exclude_none=True)
        insert_pattern = SPARQLCRUDHelper.build_insert_query(
            team_data.id, "Team", data_dict
        )
        
        query = f"""
        {self.client.get_prefixes()}
        
        INSERT DATA {{
            {insert_pattern} .
        }}
        """
        
        try:
            self.client.execute_update(query)
            logger.info(f"Created team: {team_data.id}")
            return await self.get_team_by_id(team_data.id)
        except Exception as e:
            logger.error(f"Error creating team: {str(e)}")
            raise
    
    async def update_team(self, team_id: str, team_data: TeamUpdate) -> Optional[Dict[str, Any]]:
        """Update an existing team."""
        existing = await self.get_team_by_id(team_id)
        if not existing:
            return None
        
        data_dict = team_data.dict(exclude_none=True)
        if not data_dict:
            return existing
        
        delete_patterns, insert_patterns = SPARQLCRUDHelper.build_update_patterns(
            team_id, data_dict
        )
        
        query = f"""
        {self.client.get_prefixes()}
        
        DELETE {{
            {' '.join(delete_patterns)}
        }}
        INSERT {{
            {' '.join(insert_patterns)}
        }}
        WHERE {{
            {' OPTIONAL { ' + ' } OPTIONAL { '.join(delete_patterns) + ' }'}
        }}
        """
        
        try:
            self.client.execute_update(query)
            logger.info(f"Updated team: {team_id}")
            return await self.get_team_by_id(team_id)
        except Exception as e:
            logger.error(f"Error updating team {team_id}: {str(e)}")
            raise
    
    async def delete_team(self, team_id: str) -> bool:
        """Delete a team."""
        query = f"""
        {self.client.get_prefixes()}
        {SPARQLCRUDHelper.build_delete_query(team_id)}
        """
        
        try:
            self.client.execute_update(query)
            logger.info(f"Deleted team: {team_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting team {team_id}: {str(e)}")
            raise


# Global service instance
team_service = TeamService()
