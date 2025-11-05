from typing import List, Optional, Dict, Any
from app.services.fuseki_client import fuseki_client
from app.services.rdf_crud_service import rdf_crud_service
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri
from app.models.domain.team import TeamCreate, TeamUpdate, Team, TeamList
import logging

logger = logging.getLogger(__name__)


class TeamService:
    """Service for Team-related operations."""
    
    def __init__(self):
        self.client = fuseki_client
    
    async def get_all_teams(self, team_type: Optional[str] = None, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """
        Get all teams with optional type filter.
        
        Args:
            team_type: Filter by team type (ProfessionalTeam, NationalTeam, etc.)
            limit: Maximum number of results
            offset: Number of results to skip
            
        Returns:
            Dict with teams list and total count
        """
        # Build type filter
        type_filter = ""
        if team_type:
            type_filter = f"?team a sport:{team_type} ."
        else:
            type_filter = "?team a ?teamType . FILTER(?teamType IN (sport:ProfessionalTeam, sport:NationalTeam, sport:AmateurTeam, sport:YouthTeam, sport:WomenTeam))"
        
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT ?team
               (SAMPLE(?teamType) as ?type)
               (SAMPLE(?teamName) as ?name)
               (SAMPLE(?foundedYear) as ?founded)
               (SAMPLE(?primaryColor) as ?color)
               (SAMPLE(?city) as ?teamCity)
               (SAMPLE(?country) as ?teamCountry)
               (SAMPLE(?budget) as ?teamBudget)
               (SAMPLE(?currentRanking) as ?ranking)
               (SAMPLE(?wins) as ?teamWins)
               (SAMPLE(?losses) as ?teamLosses)
               (SAMPLE(?draws) as ?teamDraws)
               (SAMPLE(?description) as ?desc)
        WHERE {{
            {type_filter}
            OPTIONAL {{ ?team sport:teamName ?teamName . }}
            OPTIONAL {{ ?team sport:foundedYear ?foundedYear . }}
            OPTIONAL {{ ?team sport:primaryColor ?primaryColor . }}
            OPTIONAL {{ ?team sport:city ?city . }}
            OPTIONAL {{ ?team sport:country ?country . }}
            OPTIONAL {{ ?team sport:budget ?budget . }}
            OPTIONAL {{ ?team sport:currentRanking ?currentRanking . }}
            OPTIONAL {{ ?team sport:wins ?wins . }}
            OPTIONAL {{ ?team sport:losses ?losses . }}
            OPTIONAL {{ ?team sport:draws ?draws . }}
            OPTIONAL {{ ?team sport:description ?description . }}
        }}
        GROUP BY ?team
        ORDER BY ?name
        LIMIT {limit}
        OFFSET {offset}
        """
        
        try:
            results = self.client.execute_query(query)
            teams_data = sparql_results_to_list(results)
            
            teams = []
            for data in teams_data:
                team_type_uri = data.get('type', '')
                team_type_name = team_type_uri.split('#')[-1] if '#' in team_type_uri else 'Team'
                
                team = {
                    "id": extract_id_from_uri(data.get('team', '')),
                    "team_type": team_type_name,
                    "teamName": data.get('name'),
                    "foundedYear": int(data['founded']) if data.get('founded') else None,
                    "primaryColor": data.get('color'),
                    "city": data.get('teamCity'),
                    "country": data.get('teamCountry'),
                    "budget": float(data['teamBudget']) if data.get('teamBudget') else None,
                    "currentRanking": int(data['ranking']) if data.get('ranking') else None,
                    "wins": int(data['teamWins']) if data.get('teamWins') else None,
                    "losses": int(data['teamLosses']) if data.get('teamLosses') else None,
                    "draws": int(data['teamDraws']) if data.get('teamDraws') else None,
                    "description": data.get('desc')
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
        
        SELECT ?teamType ?teamName ?foundedYear ?primaryColor ?secondaryColor ?city ?country 
               ?budget ?currentRanking ?wins ?losses ?draws ?description ?majorAchievements
               ?estimatedFans ?homeVenue ?squadSize ?rivals
        WHERE {{
            sport:{team_id} a ?teamType .
            FILTER(?teamType IN (sport:ProfessionalTeam, sport:NationalTeam, sport:AmateurTeam, sport:YouthTeam, sport:WomenTeam))
            OPTIONAL {{ sport:{team_id} sport:teamName ?teamName . }}
            OPTIONAL {{ sport:{team_id} sport:foundedYear ?foundedYear . }}
            OPTIONAL {{ sport:{team_id} sport:primaryColor ?primaryColor . }}
            OPTIONAL {{ sport:{team_id} sport:secondaryColor ?secondaryColor . }}
            OPTIONAL {{ sport:{team_id} sport:city ?city . }}
            OPTIONAL {{ sport:{team_id} sport:country ?country . }}
            OPTIONAL {{ sport:{team_id} sport:budget ?budget . }}
            OPTIONAL {{ sport:{team_id} sport:currentRanking ?currentRanking . }}
            OPTIONAL {{ sport:{team_id} sport:wins ?wins . }}
            OPTIONAL {{ sport:{team_id} sport:losses ?losses . }}
            OPTIONAL {{ sport:{team_id} sport:draws ?draws . }}
            OPTIONAL {{ sport:{team_id} sport:description ?description . }}
            OPTIONAL {{ sport:{team_id} sport:majorAchievements ?majorAchievements . }}
            OPTIONAL {{ sport:{team_id} sport:estimatedFans ?estimatedFans . }}
            OPTIONAL {{ sport:{team_id} sport:homeVenue ?homeVenue . }}
            OPTIONAL {{ sport:{team_id} sport:squadSize ?squadSize . }}
            OPTIONAL {{ sport:{team_id} sport:rivals ?rivals . }}
        }}
        LIMIT 1
        """
        
        try:
            results = self.client.execute_query(query)
            teams_data = sparql_results_to_list(results)
            
            if not teams_data:
                return None
            
            data = teams_data[0]
            
            team_type_uri = data.get('teamType', '')
            team_type_name = team_type_uri.split('#')[-1] if '#' in team_type_uri else 'Team'
            
            team = {
                "id": team_id,
                "team_type": team_type_name,
                "teamName": data.get('teamName'),
                "foundedYear": int(data['foundedYear']) if data.get('foundedYear') else None,
                "primaryColor": data.get('primaryColor'),
                "secondaryColor": data.get('secondaryColor'),
                "city": data.get('city'),
                "country": data.get('country'),
                "budget": float(data['budget']) if data.get('budget') else None,
                "currentRanking": int(data['currentRanking']) if data.get('currentRanking') else None,
                "wins": int(data['wins']) if data.get('wins') else None,
                "losses": int(data['losses']) if data.get('losses') else None,
                "draws": int(data['draws']) if data.get('draws') else None,
                "description": data.get('description'),
                "majorAchievements": data.get('majorAchievements'),
                "estimatedFans": data.get('estimatedFans'),
                "homeVenue": data.get('homeVenue'),
                "squadSize": int(data['squadSize']) if data.get('squadSize') else None,
                "rivals": data.get('rivals')
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
        """Create a new team in RDF file."""
        try:
            data_dict = team_data.dict(exclude_none=True)
            rdf_crud_service.create_team(data_dict)
            logger.info(f"Created team: {team_data.id}")
            return await self.get_team_by_id(team_data.id)
        except Exception as e:
            logger.error(f"Error creating team: {str(e)}")
            raise
    
    async def update_team(self, team_id: str, team_data: TeamUpdate) -> Optional[Dict[str, Any]]:
        """Update an existing team in RDF file."""
        try:
            existing = await self.get_team_by_id(team_id)
            if not existing:
                return None
            
            data_dict = team_data.dict(exclude_none=True)
            if not data_dict:
                return existing
            
            rdf_crud_service.update_team(team_id, data_dict)
            logger.info(f"Updated team: {team_id}")
            return await self.get_team_by_id(team_id)
        except Exception as e:
            logger.error(f"Error updating team {team_id}: {str(e)}")
            raise
    
    async def delete_team(self, team_id: str) -> bool:
        """Delete a team from RDF file."""
        try:
            rdf_crud_service.delete_team(team_id)
            logger.info(f"Deleted team: {team_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting team {team_id}: {str(e)}")
            raise


# Global service instance
team_service = TeamService()
