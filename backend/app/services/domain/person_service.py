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
               ?assists ?matchesPlayed ?isCaptain ?description ?achievements ?specialties
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
            OPTIONAL {{ sport:{athlete_id} sport:description ?description . }}
            OPTIONAL {{ sport:{athlete_id} sport:achievements ?achievements . }}
            OPTIONAL {{ sport:{athlete_id} sport:specialties ?specialties . }}
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
    
    async def get_all_coaches(self, limit: int = 100, offset: int = 0):
        """Get all coaches."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?coach ?firstName ?lastName ?birthDate ?nationality ?experienceYears ?titlesWon ?coachingStyle
        WHERE {{
            ?coach a sport:Coach .
            OPTIONAL {{ ?coach sport:firstName ?firstName . }}
            OPTIONAL {{ ?coach sport:lastName ?lastName . }}
            OPTIONAL {{ ?coach sport:birthDate ?birthDate . }}
            OPTIONAL {{ ?coach sport:nationality ?nationality . }}
            OPTIONAL {{ ?coach sport:experienceYears ?experienceYears . }}
            OPTIONAL {{ ?coach sport:titlesWon ?titlesWon . }}
            OPTIONAL {{ ?coach sport:coachingStyle ?coachingStyle . }}
        }}
        LIMIT {limit}
        OFFSET {offset}
        """
        
        try:
            results = self.client.execute_query(query)
            coaches_data = sparql_results_to_list(results)
            
            coaches = []
            for data in coaches_data:
                coach = {
                    'id': extract_id_from_uri(data.get('coach', '')),
                    'firstName': data.get('firstName'),
                    'lastName': data.get('lastName'),
                    'birthDate': data.get('birthDate'),
                    'nationality': data.get('nationality'),
                    'experienceYears': int(data['experienceYears']) if data.get('experienceYears') else None,
                    'titlesWon': int(data['titlesWon']) if data.get('titlesWon') else None,
                    'coachingStyle': data.get('coachingStyle'),
                }
                coaches.append(coach)
            
            return {'coaches': coaches, 'total': len(coaches)}
            
        except Exception as e:
            logger.error(f"Error getting coaches: {str(e)}")
            raise
    
    async def get_all_referees(self, limit: int = 100, offset: int = 0):
        """Get all referees."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?referee ?firstName ?lastName ?birthDate ?nationality ?experienceYears ?matchesOfficiated
        WHERE {{
            ?referee a sport:Referee .
            OPTIONAL {{ ?referee sport:firstName ?firstName . }}
            OPTIONAL {{ ?referee sport:lastName ?lastName . }}
            OPTIONAL {{ ?referee sport:birthDate ?birthDate . }}
            OPTIONAL {{ ?referee sport:nationality ?nationality . }}
            OPTIONAL {{ ?referee sport:experienceYears ?experienceYears . }}
            OPTIONAL {{ ?referee sport:matchesOfficiated ?matchesOfficiated . }}
        }}
        LIMIT {limit}
        OFFSET {offset}
        """
        
        try:
            results = self.client.execute_query(query)
            referees_data = sparql_results_to_list(results)
            
            referees = []
            for data in referees_data:
                referee = {
                    'id': extract_id_from_uri(data.get('referee', '')),
                    'firstName': data.get('firstName'),
                    'lastName': data.get('lastName'),
                    'birthDate': data.get('birthDate'),
                    'nationality': data.get('nationality'),
                    'experienceYears': int(data['experienceYears']) if data.get('experienceYears') else None,
                    'matchesOfficiated': int(data['matchesOfficiated']) if data.get('matchesOfficiated') else None,
                }
                referees.append(referee)
            
            return {'referees': referees, 'total': len(referees)}
            
        except Exception as e:
            logger.error(f"Error getting referees: {str(e)}")
            raise
    
    async def get_coach_by_id(self, coach_id: str):
        """Get coach by ID."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT ?firstName ?lastName ?nationality ?experienceYears ?titlesWon ?coachingStyle
        WHERE {{
            sport:{coach_id} a sport:Coach .
            OPTIONAL {{ sport:{coach_id} sport:firstName ?firstName . }}
            OPTIONAL {{ sport:{coach_id} sport:lastName ?lastName . }}
            OPTIONAL {{ sport:{coach_id} sport:nationality ?nationality . }}
            OPTIONAL {{ sport:{coach_id} sport:experienceYears ?experienceYears . }}
            OPTIONAL {{ sport:{coach_id} sport:titlesWon ?titlesWon . }}
            OPTIONAL {{ sport:{coach_id} sport:coachingStyle ?coachingStyle . }}
        }}
        LIMIT 1
        """
        
        try:
            results = self.client.execute_query(query)
            coaches_data = sparql_results_to_list(results)
            
            if not coaches_data:
                return None
            
            data = coaches_data[0]
            return {
                'id': coach_id,
                'firstName': data.get('firstName'),
                'lastName': data.get('lastName'),
                'nationality': data.get('nationality'),
                'experienceYears': int(data['experienceYears']) if data.get('experienceYears') else None,
                'titlesWon': int(data['titlesWon']) if data.get('titlesWon') else None,
                'coachingStyle': data.get('coachingStyle'),
            }
            
        except Exception as e:
            logger.error(f"Error getting coach {coach_id}: {str(e)}")
            raise
    
    async def get_referee_by_id(self, referee_id: str):
        """Get referee by ID."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT ?firstName ?lastName ?nationality ?experienceYears ?matchesOfficiated
        WHERE {{
            sport:{referee_id} a sport:Referee .
            OPTIONAL {{ sport:{referee_id} sport:firstName ?firstName . }}
            OPTIONAL {{ sport:{referee_id} sport:lastName ?lastName . }}
            OPTIONAL {{ sport:{referee_id} sport:nationality ?nationality . }}
            OPTIONAL {{ sport:{referee_id} sport:experienceYears ?experienceYears . }}
            OPTIONAL {{ sport:{referee_id} sport:matchesOfficiated ?matchesOfficiated . }}
        }}
        LIMIT 1
        """
        
        try:
            results = self.client.execute_query(query)
            referees_data = sparql_results_to_list(results)
            
            if not referees_data:
                return None
            
            data = referees_data[0]
            return {
                'id': referee_id,
                'firstName': data.get('firstName'),
                'lastName': data.get('lastName'),
                'nationality': data.get('nationality'),
                'experienceYears': int(data['experienceYears']) if data.get('experienceYears') else None,
                'matchesOfficiated': int(data['matchesOfficiated']) if data.get('matchesOfficiated') else None,
            }
            
        except Exception as e:
            logger.error(f"Error getting referee {referee_id}: {str(e)}")
            raise

    # ============ RELATIONSHIP METHODS ============
    
    async def get_athlete_coaches(self, athlete_id: str):
        """Get coaches who trained this athlete."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?coach ?firstName ?lastName ?nationality ?experienceYears ?titlesWon
        WHERE {{
            ?coach a sport:Coach .
            ?coach sport:coachesAthlete sport:{athlete_id} .
            OPTIONAL {{ ?coach sport:firstName ?firstName }}
            OPTIONAL {{ ?coach sport:lastName ?lastName }}
            OPTIONAL {{ ?coach sport:nationality ?nationality }}
            OPTIONAL {{ ?coach sport:experienceYears ?experienceYears }}
            OPTIONAL {{ ?coach sport:titlesWon ?titlesWon }}
        }}
        """
        
        try:
            results = self.client.execute_query(query)
            coaches_data = sparql_results_to_list(results)
            
            coaches = []
            for data in coaches_data:
                coaches.append({
                    'id': extract_id_from_uri(data.get('coach', '')),
                    'firstName': data.get('firstName'),
                    'lastName': data.get('lastName'),
                    'nationality': data.get('nationality'),
                    'experienceYears': int(data['experienceYears']) if data.get('experienceYears') else None,
                    'titlesWon': int(data['titlesWon']) if data.get('titlesWon') else None,
                })
            
            return {"coaches": coaches, "total": len(coaches)}
            
        except Exception as e:
            logger.error(f"Error getting coaches for athlete {athlete_id}: {str(e)}")
            return {"coaches": [], "total": 0}
    
    async def get_athlete_achievements(self, athlete_id: str):
        """Get achievements for this athlete."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?achievement ?achievementType ?year ?performanceValue ?unit
        WHERE {{
            ?achievement a sport:Achievement .
            ?achievement sport:achievedBy sport:{athlete_id} .
            OPTIONAL {{ ?achievement sport:achievementType ?achievementType }}
            OPTIONAL {{ ?achievement sport:year ?year }}
            OPTIONAL {{ ?achievement sport:performanceValue ?performanceValue }}
            OPTIONAL {{ ?achievement sport:unit ?unit }}
        }}
        ORDER BY DESC(?year)
        """
        
        try:
            results = self.client.execute_query(query)
            achievements_data = sparql_results_to_list(results)
            
            achievements = []
            for data in achievements_data:
                achievements.append({
                    'id': extract_id_from_uri(data.get('achievement', '')),
                    'achievementType': data.get('achievementType'),
                    'year': int(data['year']) if data.get('year') else None,
                    'performanceValue': data.get('performanceValue'),
                    'unit': data.get('unit'),
                })
            
            return {"achievements": achievements, "total": len(achievements)}
            
        except Exception as e:
            logger.error(f"Error getting achievements for athlete {athlete_id}: {str(e)}")
            return {"achievements": [], "total": 0}
    
    async def get_athlete_records(self, athlete_id: str):
        """Get records for this athlete."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?record ?recordType ?recordValue ?setOn
        WHERE {{
            ?record a sport:Record .
            ?record sport:setBy sport:{athlete_id} .
            OPTIONAL {{ ?record sport:recordType ?recordType }}
            OPTIONAL {{ ?record sport:recordValue ?recordValue }}
            OPTIONAL {{ ?record sport:setOn ?setOn }}
        }}
        ORDER BY DESC(?setOn)
        """
        
        try:
            results = self.client.execute_query(query)
            records_data = sparql_results_to_list(results)
            
            records = []
            for data in records_data:
                records.append({
                    'id': extract_id_from_uri(data.get('record', '')),
                    'recordType': data.get('recordType'),
                    'recordValue': data.get('recordValue'),
                    'setOn': data.get('setOn'),
                })
            
            return {"records": records, "total": len(records)}
            
        except Exception as e:
            logger.error(f"Error getting records for athlete {athlete_id}: {str(e)}")
            return {"records": [], "total": 0}
    
    async def get_coach_athletes(self, coach_id: str):
        """Get athletes trained by this coach."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?athlete ?firstName ?lastName ?nationality ?position ?goalsScored
        WHERE {{
            sport:{coach_id} a sport:Coach .
            sport:{coach_id} sport:coachesAthlete ?athlete .
            ?athlete a sport:Athlete .
            OPTIONAL {{ ?athlete sport:firstName ?firstName }}
            OPTIONAL {{ ?athlete sport:lastName ?lastName }}
            OPTIONAL {{ ?athlete sport:nationality ?nationality }}
            OPTIONAL {{ ?athlete sport:position ?position }}
            OPTIONAL {{ ?athlete sport:goalsScored ?goalsScored }}
        }}
        """
        
        try:
            results = self.client.execute_query(query)
            athletes_data = sparql_results_to_list(results)
            
            athletes = []
            for data in athletes_data:
                athletes.append({
                    'id': extract_id_from_uri(data.get('athlete', '')),
                    'firstName': data.get('firstName'),
                    'lastName': data.get('lastName'),
                    'nationality': data.get('nationality'),
                    'position': data.get('position'),
                    'goalsScored': int(data['goalsScored']) if data.get('goalsScored') else None,
                })
            
            return {"athletes": athletes, "total": len(athletes)}
            
        except Exception as e:
            logger.error(f"Error getting athletes for coach {coach_id}: {str(e)}")
            return {"athletes": [], "total": 0}


# Global service instance
person_service = PersonService()