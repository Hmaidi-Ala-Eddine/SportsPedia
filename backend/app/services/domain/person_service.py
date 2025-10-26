from typing import List, Optional, Dict, Any
from app.services.fuseki_client import fuseki_client
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri
from app.models.domain.person import Athlete, AthleteList, Coach
import logging

logger = logging.getLogger(__name__)


class PersonService:
    """Service for Person-related operations."""
    
    def __init__(self):
        self.client = fuseki_client
    
    async def get_all_athletes(self, limit: int = 100, offset: int = 0) -> AthleteList:
        """
        Get all athletes.
        
        Args:
            limit: Maximum number of results
            offset: Number of results to skip
            
        Returns:
            AthleteList with athletes
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?athlete ?firstName ?lastName ?nationality ?position 
                        ?jerseyNumber ?goalsScored ?assists ?matchesPlayed
        WHERE {{
            ?athlete a sport:Athlete .
            OPTIONAL {{ ?athlete sport:firstName ?firstName . }}
            OPTIONAL {{ ?athlete sport:lastName ?lastName . }}
            OPTIONAL {{ ?athlete sport:nationality ?nationality . }}
            OPTIONAL {{ ?athlete sport:position ?position . }}
            OPTIONAL {{ ?athlete sport:jerseyNumber ?jerseyNumber . }}
            OPTIONAL {{ ?athlete sport:goalsScored ?goalsScored . }}
            OPTIONAL {{ ?athlete sport:assists ?assists . }}
            OPTIONAL {{ ?athlete sport:matchesPlayed ?matchesPlayed . }}
        }}
        LIMIT {limit}
        OFFSET {offset}
        """
        
        try:
            results = self.client.execute_query(query)
            athletes_data = sparql_results_to_list(results)
            
            athletes = []
            for data in athletes_data:
                athlete = Athlete(
                    id=extract_id_from_uri(data.get('athlete', '')),
                    firstName=data.get('firstName'),
                    lastName=data.get('lastName'),
                    nationality=data.get('nationality'),
                    position=data.get('position'),
                    jerseyNumber=int(data['jerseyNumber']) if data.get('jerseyNumber') else None,
                    goalsScored=int(data['goalsScored']) if data.get('goalsScored') else None,
                    assists=int(data['assists']) if data.get('assists') else None,
                    matchesPlayed=int(data['matchesPlayed']) if data.get('matchesPlayed') else None,
                )
                athletes.append(athlete)
            
            return AthleteList(athletes=athletes, total=len(athletes))
            
        except Exception as e:
            logger.error(f"Error getting athletes: {str(e)}")
            raise
    
    async def get_athlete_by_id(self, athlete_id: str) -> Optional[Athlete]:
        """
        Get athlete by ID.
        
        Args:
            athlete_id: Athlete identifier
            
        Returns:
            Athlete object or None
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT ?firstName ?lastName ?birthDate ?nationality ?height ?weight 
               ?gender ?jerseyNumber ?position ?marketValue ?goalsScored 
               ?assists ?matchesPlayed ?isCaptain
        WHERE {{
            sport:{athlete_id} a sport:Athlete .
            OPTIONAL {{ sport:{athlete_id} sport:firstName ?firstName . }}
            OPTIONAL {{ sport:{athlete_id} sport:lastName ?lastName . }}
            OPTIONAL {{ sport:{athlete_id} sport:birthDate ?birthDate . }}
            OPTIONAL {{ sport:{athlete_id} sport:nationality ?nationality . }}
            OPTIONAL {{ sport:{athlete_id} sport:height ?height . }}
            OPTIONAL {{ sport:{athlete_id} sport:weight ?weight . }}
            OPTIONAL {{ sport:{athlete_id} sport:gender ?gender . }}
            OPTIONAL {{ sport:{athlete_id} sport:jerseyNumber ?jerseyNumber . }}
            OPTIONAL {{ sport:{athlete_id} sport:position ?position . }}
            OPTIONAL {{ sport:{athlete_id} sport:marketValue ?marketValue . }}
            OPTIONAL {{ sport:{athlete_id} sport:goalsScored ?goalsScored . }}
            OPTIONAL {{ sport:{athlete_id} sport:assists ?assists . }}
            OPTIONAL {{ sport:{athlete_id} sport:matchesPlayed ?matchesPlayed . }}
            OPTIONAL {{ sport:{athlete_id} sport:isCaptain ?isCaptain . }}
        }}
        LIMIT 1
        """
        
        try:
            results = self.client.execute_query(query)
            athletes_data = sparql_results_to_list(results)
            
            if not athletes_data:
                return None
            
            data = athletes_data[0]
            
            athlete = Athlete(
                id=athlete_id,
                firstName=data.get('firstName'),
                lastName=data.get('lastName'),
                birthDate=data.get('birthDate'),
                nationality=data.get('nationality'),
                height=float(data['height']) if data.get('height') else None,
                weight=float(data['weight']) if data.get('weight') else None,
                gender=data.get('gender'),
                jerseyNumber=int(data['jerseyNumber']) if data.get('jerseyNumber') else None,
                position=data.get('position'),
                marketValue=float(data['marketValue']) if data.get('marketValue') else None,
                goalsScored=int(data['goalsScored']) if data.get('goalsScored') else None,
                assists=int(data['assists']) if data.get('assists') else None,
                matchesPlayed=int(data['matchesPlayed']) if data.get('matchesPlayed') else None,
                isCaptain=data.get('isCaptain', '').lower() == 'true' if data.get('isCaptain') else None,
            )
            
            return athlete
            
        except Exception as e:
            logger.error(f"Error getting athlete {athlete_id}: {str(e)}")
            raise


# Global service instance
person_service = PersonService()