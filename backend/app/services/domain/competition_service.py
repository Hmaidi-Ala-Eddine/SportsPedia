from typing import List, Optional, Dict, Any
from app.services.fuseki_client import fuseki_client
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri
from app.models.domain.competition import CompetitionCreate, CompetitionUpdate
from app.services.crud_helper import SPARQLCRUDHelper
import logging

logger = logging.getLogger(__name__)


class CompetitionService:
    """Service for Competition-related operations."""
    
    def __init__(self):
        self.client = fuseki_client
    
    async def get_all_competitions(self, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """
        Get all competitions.
        
        Args:
            limit: Maximum number of results
            offset: Number of results to skip
            
        Returns:
            Dict with competitions list and total count
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT ?competition
               (SAMPLE(?competitionType) as ?type)
               (SAMPLE(?competitionName) as ?name)
               (SAMPLE(?season) as ?compSeason)
               (SAMPLE(?startDate) as ?start)
               (SAMPLE(?endDate) as ?end)
        WHERE {{
            ?competition a ?competitionType .
            FILTER(?competitionType IN (sport:League, sport:WorldCup, sport:Championship, sport:Tournament, sport:Olympics))
            OPTIONAL {{ ?competition sport:competitionName ?competitionName . }}
            OPTIONAL {{ ?competition sport:season ?season . }}
            OPTIONAL {{ ?competition sport:startDate ?startDate . }}
            OPTIONAL {{ ?competition sport:endDate ?endDate . }}
        }}
        GROUP BY ?competition
        ORDER BY DESC(?start)
        LIMIT {limit}
        OFFSET {offset}
        """
        
        try:
            results = self.client.execute_query(query)
            competitions_data = sparql_results_to_list(results)
            
            competitions = []
            for data in competitions_data:
                competition = {
                    "id": extract_id_from_uri(data.get('competition', '')),
                    "name": data.get('name'),
                    "season": data.get('compSeason'),
                    "startDate": data.get('start'),
                    "endDate": data.get('end'),
                    "type": extract_id_from_uri(data.get('type', '')) if data.get('type') else None
                }
                competitions.append(competition)
            
            return {"competitions": competitions, "total": len(competitions)}
            
        except Exception as e:
            logger.error(f"Error getting competitions: {str(e)}")
            raise
    
    async def get_competition_by_id(self, competition_id: str) -> Optional[Dict[str, Any]]:
        """
        Get competition by ID.
        
        Args:
            competition_id: Competition identifier
            
        Returns:
            Competition dict or None
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT ?name ?season ?startDate ?endDate ?competitionType ?numberOfTeams ?prizeMoney ?competitionFormat ?description ?country
        WHERE {{
            sport:{competition_id} a ?competitionType .
            FILTER(?competitionType IN (sport:League, sport:WorldCup, sport:Championship, sport:Tournament, sport:Olympics))
            OPTIONAL {{ sport:{competition_id} sport:competitionName ?name . }}
            OPTIONAL {{ sport:{competition_id} sport:season ?season . }}
            OPTIONAL {{ sport:{competition_id} sport:startDate ?startDate . }}
            OPTIONAL {{ sport:{competition_id} sport:endDate ?endDate . }}
            OPTIONAL {{ sport:{competition_id} sport:numberOfTeams ?numberOfTeams . }}
            OPTIONAL {{ sport:{competition_id} sport:prizeMoney ?prizeMoney . }}
            OPTIONAL {{ sport:{competition_id} sport:competitionFormat ?competitionFormat . }}
            OPTIONAL {{ sport:{competition_id} sport:description ?description . }}
            OPTIONAL {{ sport:{competition_id} sport:country ?country . }}
        }}
        LIMIT 1
        """
        
        try:
            results = self.client.execute_query(query)
            comp_data = sparql_results_to_list(results)
            
            if not comp_data:
                return None
            
            data = comp_data[0]
            
            competition = {
                "id": competition_id,
                "name": data.get('name'),
                "competitionName": data.get('name'),
                "season": data.get('season'),
                "startDate": data.get('startDate'),
                "endDate": data.get('endDate'),
                "type": extract_id_from_uri(data.get('competitionType', '')) if data.get('competitionType') else None,
                "country": data.get('country'),
                "numberOfTeams": int(data['numberOfTeams']) if data.get('numberOfTeams') else None,
                "prizeMoney": float(data['prizeMoney']) if data.get('prizeMoney') else None,
                "competitionFormat": data.get('competitionFormat'),
                "description": data.get('description')
            }
            
            return competition
            
        except Exception as e:
            logger.error(f"Error getting competition {competition_id}: {str(e)}")
            raise
    
    async def get_leagues(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all leagues."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?league ?name ?country ?season
        WHERE {{
            ?league a sport:League .
            OPTIONAL {{ ?league sport:competitionName ?name . }}
            OPTIONAL {{ ?league sport:country ?country . }}
            OPTIONAL {{ ?league sport:season ?season . }}
        }}
        LIMIT {limit}
        """
        
        try:
            results = self.client.execute_query(query)
            leagues_data = sparql_results_to_list(results)
            
            leagues = []
            for data in leagues_data:
                league = {
                    "id": extract_id_from_uri(data.get('league', '')),
                    "name": data.get('name'),
                    "country": data.get('country'),
                    "season": data.get('season')
                }
                leagues.append(league)
            
            return leagues
            
        except Exception as e:
            logger.error(f"Error getting leagues: {str(e)}")
            raise
    
    async def get_matches(self, limit: int = 100, competition_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get matches, optionally filtered by competition."""
        competition_filter = f"?match sport:partOfCompetition sport:{competition_id} ." if competition_id else ""
        
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?match ?homeTeam ?awayTeam ?date ?venue ?homeScore ?awayScore
        WHERE {{
            ?match a sport:Match .
            {competition_filter}
            OPTIONAL {{ ?match sport:hasHomeTeam ?homeTeam . }}
            OPTIONAL {{ ?match sport:hasAwayTeam ?awayTeam . }}
            OPTIONAL {{ ?match sport:matchDate ?date . }}
            OPTIONAL {{ ?match sport:playedAt ?venue . }}
            OPTIONAL {{ ?match sport:homeTeamScore ?homeScore . }}
            OPTIONAL {{ ?match sport:awayTeamScore ?awayScore . }}
        }}
        ORDER BY DESC(?date)
        LIMIT {limit}
        """
        
        try:
            results = self.client.execute_query(query)
            matches_data = sparql_results_to_list(results)
            
            matches = []
            for data in matches_data:
                match = {
                    "id": extract_id_from_uri(data.get('match', '')),
                    "homeTeam": extract_id_from_uri(data.get('homeTeam', '')) if data.get('homeTeam') else None,
                    "awayTeam": extract_id_from_uri(data.get('awayTeam', '')) if data.get('awayTeam') else None,
                    "date": data.get('date'),
                    "venue": extract_id_from_uri(data.get('venue', '')) if data.get('venue') else None,
                    "homeScore": int(data['homeScore']) if data.get('homeScore') else None,
                    "awayScore": int(data['awayScore']) if data.get('awayScore') else None
                }
                matches.append(match)
            
            return matches
            
        except Exception as e:
            logger.error(f"Error getting matches: {str(e)}")
            raise
    
    async def create_competition(self, comp_data: CompetitionCreate) -> Dict[str, Any]:
        """Create a new competition."""
        data_dict = comp_data.dict(exclude={'id'}, exclude_none=True)
        insert_pattern = SPARQLCRUDHelper.build_insert_query(
            comp_data.id, "Competition", data_dict
        )
        query = f"{self.client.get_prefixes()}\nINSERT DATA {{ {insert_pattern} . }}"
        try:
            self.client.execute_update(query)
            logger.info(f"Created competition: {comp_data.id}")
            return {"id": comp_data.id, **data_dict}
        except Exception as e:
            logger.error(f"Error creating competition: {str(e)}")
            raise
    
    async def update_competition(self, comp_id: str, comp_data: CompetitionUpdate) -> Optional[Dict[str, Any]]:
        """Update an existing competition."""
        data_dict = comp_data.dict(exclude_none=True)
        if not data_dict:
            return {"id": comp_id}
        delete_patterns, insert_patterns = SPARQLCRUDHelper.build_update_patterns(comp_id, data_dict)
        query = f"{self.client.get_prefixes()}\nDELETE {{ {' '.join(delete_patterns)} }}\nINSERT {{ {' '.join(insert_patterns)} }}\nWHERE {{ {' OPTIONAL { ' + ' } OPTIONAL { '.join(delete_patterns) + ' }'} }}"
        try:
            self.client.execute_update(query)
            logger.info(f"Updated competition: {comp_id}")
            return {"id": comp_id, **data_dict}
        except Exception as e:
            logger.error(f"Error updating competition {comp_id}: {str(e)}")
            raise
    
    async def delete_competition(self, comp_id: str) -> bool:
        """Delete a competition."""
        query = f"{self.client.get_prefixes()}\n{SPARQLCRUDHelper.build_delete_query(comp_id)}"
        try:
            self.client.execute_update(query)
            logger.info(f"Deleted competition: {comp_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting competition {comp_id}: {str(e)}")
            raise


# Global service instance
competition_service = CompetitionService()
