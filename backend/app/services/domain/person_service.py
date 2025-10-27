from typing import List, Optional, Dict, Any
from app.services.fuseki_client import fuseki_client
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri
from app.models.domain.person import (
    Athlete, AthleteList, AthleteCreate, AthleteUpdate,
    Coach, CoachList, CoachCreate, CoachUpdate,
    Referee, RefereeList, RefereeCreate, RefereeUpdate
)
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
    
    async def create_athlete(self, athlete_data: AthleteCreate) -> Athlete:
        """Create a new athlete."""
        query = f"""
        {self.client.get_prefixes()}
        
        INSERT DATA {{
            sport:{athlete_data.id} a sport:Athlete ;
                sport:firstName "{athlete_data.firstName}" ;
                sport:lastName "{athlete_data.lastName}" """
        
        if athlete_data.birthDate:
            query += f'; sport:birthDate "{athlete_data.birthDate}"^^xsd:date '
        if athlete_data.nationality:
            query += f'; sport:nationality "{athlete_data.nationality}" '
        if athlete_data.height:
            query += f'; sport:height "{athlete_data.height}"^^xsd:float '
        if athlete_data.weight:
            query += f'; sport:weight "{athlete_data.weight}"^^xsd:float '
        if athlete_data.gender:
            query += f'; sport:gender "{athlete_data.gender}" '
        if athlete_data.jerseyNumber:
            query += f'; sport:jerseyNumber "{athlete_data.jerseyNumber}"^^xsd:integer '
        if athlete_data.position:
            query += f'; sport:position "{athlete_data.position}" '
        if athlete_data.marketValue:
            query += f'; sport:marketValue "{athlete_data.marketValue}"^^xsd:float '
        if athlete_data.salary:
            query += f'; sport:salary "{athlete_data.salary}"^^xsd:float '
        if athlete_data.goalsScored is not None:
            query += f'; sport:goalsScored "{athlete_data.goalsScored}"^^xsd:integer '
        if athlete_data.assists is not None:
            query += f'; sport:assists "{athlete_data.assists}"^^xsd:integer '
        if athlete_data.matchesPlayed is not None:
            query += f'; sport:matchesPlayed "{athlete_data.matchesPlayed}"^^xsd:integer '
        if athlete_data.isCaptain is not None:
            query += f'; sport:isCaptain "{str(athlete_data.isCaptain).lower()}"^^xsd:boolean '
        if athlete_data.team:
            query += f'; sport:playsFor sport:{athlete_data.team} '
        if athlete_data.sport:
            query += f'; sport:practicesSport sport:{athlete_data.sport} '
        
        query += ".\n}"
        
        try:
            self.client.execute_update(query)
            logger.info(f"Created athlete: {athlete_data.id}")
            return await self.get_athlete_by_id(athlete_data.id)
        except Exception as e:
            logger.error(f"Error creating athlete: {str(e)}")
            raise
    
    async def update_athlete(self, athlete_id: str, athlete_data: AthleteUpdate) -> Optional[Athlete]:
        """Update an existing athlete."""
        # First check if athlete exists
        existing = await self.get_athlete_by_id(athlete_id)
        if not existing:
            return None
        
        # Build DELETE/INSERT query for updates
        delete_patterns = []
        insert_patterns = []
        
        if athlete_data.firstName is not None:
            delete_patterns.append(f"sport:{athlete_id} sport:firstName ?oldFirstName .")
            insert_patterns.append(f'sport:{athlete_id} sport:firstName "{athlete_data.firstName}" .')
        if athlete_data.lastName is not None:
            delete_patterns.append(f"sport:{athlete_id} sport:lastName ?oldLastName .")
            insert_patterns.append(f'sport:{athlete_id} sport:lastName "{athlete_data.lastName}" .')
        if athlete_data.nationality is not None:
            delete_patterns.append(f"sport:{athlete_id} sport:nationality ?oldNationality .")
            insert_patterns.append(f'sport:{athlete_id} sport:nationality "{athlete_data.nationality}" .')
        if athlete_data.position is not None:
            delete_patterns.append(f"sport:{athlete_id} sport:position ?oldPosition .")
            insert_patterns.append(f'sport:{athlete_id} sport:position "{athlete_data.position}" .')
        if athlete_data.jerseyNumber is not None:
            delete_patterns.append(f"sport:{athlete_id} sport:jerseyNumber ?oldJersey .")
            insert_patterns.append(f'sport:{athlete_id} sport:jerseyNumber "{athlete_data.jerseyNumber}"^^xsd:integer .')
        if athlete_data.goalsScored is not None:
            delete_patterns.append(f"sport:{athlete_id} sport:goalsScored ?oldGoals .")
            insert_patterns.append(f'sport:{athlete_id} sport:goalsScored "{athlete_data.goalsScored}"^^xsd:integer .')
        if athlete_data.assists is not None:
            delete_patterns.append(f"sport:{athlete_id} sport:assists ?oldAssists .")
            insert_patterns.append(f'sport:{athlete_id} sport:assists "{athlete_data.assists}"^^xsd:integer .')
        if athlete_data.marketValue is not None:
            delete_patterns.append(f"sport:{athlete_id} sport:marketValue ?oldValue .")
            insert_patterns.append(f'sport:{athlete_id} sport:marketValue "{athlete_data.marketValue}"^^xsd:float .')
        
        if not delete_patterns:
            return existing
        
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
            logger.info(f"Updated athlete: {athlete_id}")
            return await self.get_athlete_by_id(athlete_id)
        except Exception as e:
            logger.error(f"Error updating athlete {athlete_id}: {str(e)}")
            raise
    
    async def delete_athlete(self, athlete_id: str) -> bool:
        """Delete an athlete."""
        query = f"""
        {self.client.get_prefixes()}
        
        DELETE WHERE {{
            sport:{athlete_id} ?p ?o .
        }}
        """
        
        try:
            self.client.execute_update(query)
            logger.info(f"Deleted athlete: {athlete_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting athlete {athlete_id}: {str(e)}")
            raise


# Global service instance
person_service = PersonService()