from typing import List, Optional, Dict, Any
from app.services.fuseki_client import fuseki_client
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri
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
        
        SELECT DISTINCT ?competition ?name ?season ?startDate ?endDate ?competitionType
        WHERE {{
            ?competition a sport:Competition .
            OPTIONAL {{ ?competition sport:competitionName ?name . }}
            OPTIONAL {{ ?competition sport:season ?season . }}
            OPTIONAL {{ ?competition sport:startDate ?startDate . }}
            OPTIONAL {{ ?competition sport:endDate ?endDate . }}
            OPTIONAL {{ ?competition a ?competitionType . }}
        }}
        ORDER BY DESC(?startDate)
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
                    "season": data.get('season'),
                    "startDate": data.get('startDate'),
                    "endDate": data.get('endDate'),
                    "type": extract_id_from_uri(data.get('competitionType', '')) if data.get('competitionType') else None
                }
                competitions.append(competition)
            
            return {"competitions": competitions, "total": len(competitions)}
            
        except Exception as e:
            logger.error(f"Error getting competitions: {str(e)}")
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


# Global service instance
competition_service = CompetitionService()
