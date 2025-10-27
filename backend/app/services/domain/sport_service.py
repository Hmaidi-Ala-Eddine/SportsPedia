from typing import List, Optional, Dict, Any
from app.services.fuseki_client import fuseki_client
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri
from app.models.domain.sport import SportCreate, SportUpdate
from app.services.crud_helper import SPARQLCRUDHelper
import logging

logger = logging.getLogger(__name__)


class SportService:
    """Service for SportDiscipline-related operations."""
    
    def __init__(self):
        self.client = fuseki_client
    
    async def get_all_sports(self, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """
        Get all sport disciplines.
        
        Args:
            limit: Maximum number of results
            offset: Number of results to skip
            
        Returns:
            Dict with sports list and total count
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?sport ?name ?category ?isOlympic
        WHERE {{
            ?sport a sport:SportDiscipline .
            OPTIONAL {{ ?sport sport:sportName ?name . }}
            OPTIONAL {{ ?sport rdfs:label ?name . }}
            OPTIONAL {{ ?sport a ?category . }}
            OPTIONAL {{ ?sport sport:isOlympic ?isOlympic . }}
        }}
        ORDER BY ?name
        LIMIT {limit}
        OFFSET {offset}
        """
        
        try:
            results = self.client.execute_query(query)
            sports_data = sparql_results_to_list(results)
            
            sports = []
            for data in sports_data:
                sport_obj = {
                    "id": extract_id_from_uri(data.get('sport', '')),
                    "name": data.get('name'),
                    "category": extract_id_from_uri(data.get('category', '')) if data.get('category') else None,
                    "isOlympic": data.get('isOlympic', '').lower() == 'true' if data.get('isOlympic') else None
                }
                sports.append(sport_obj)
            
            return {"sports": sports, "total": len(sports)}
            
        except Exception as e:
            logger.error(f"Error getting sports: {str(e)}")
            raise
    
    async def get_sport_by_id(self, sport_id: str) -> Optional[Dict[str, Any]]:
        """
        Get sport discipline by ID.
        
        Args:
            sport_id: Sport identifier
            
        Returns:
            Sport dict or None
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT ?name ?description ?isOlympic ?category
        WHERE {{
            sport:{sport_id} a sport:SportDiscipline .
            OPTIONAL {{ sport:{sport_id} sport:sportName ?name . }}
            OPTIONAL {{ sport:{sport_id} rdfs:label ?name . }}
            OPTIONAL {{ sport:{sport_id} rdfs:comment ?description . }}
            OPTIONAL {{ sport:{sport_id} sport:isOlympic ?isOlympic . }}
            OPTIONAL {{ sport:{sport_id} a ?category . }}
        }}
        LIMIT 1
        """
        
        try:
            results = self.client.execute_query(query)
            sports_data = sparql_results_to_list(results)
            
            if not sports_data:
                return None
            
            data = sports_data[0]
            
            sport_obj = {
                "id": sport_id,
                "name": data.get('name'),
                "description": data.get('description'),
                "isOlympic": data.get('isOlympic', '').lower() == 'true' if data.get('isOlympic') else None,
                "category": extract_id_from_uri(data.get('category', '')) if data.get('category') else None
            }
            
            return sport_obj
            
        except Exception as e:
            logger.error(f"Error getting sport {sport_id}: {str(e)}")
            raise
    
    async def get_team_sports(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all team sports."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?sport ?name ?isOlympic
        WHERE {{
            ?sport a sport:TeamSport .
            OPTIONAL {{ ?sport sport:sportName ?name . }}
            OPTIONAL {{ ?sport rdfs:label ?name . }}
            OPTIONAL {{ ?sport sport:isOlympic ?isOlympic . }}
        }}
        ORDER BY ?name
        LIMIT {limit}
        """
        
        try:
            results = self.client.execute_query(query)
            sports_data = sparql_results_to_list(results)
            
            sports = []
            for data in sports_data:
                sport_obj = {
                    "id": extract_id_from_uri(data.get('sport', '')),
                    "name": data.get('name'),
                    "isOlympic": data.get('isOlympic', '').lower() == 'true' if data.get('isOlympic') else None
                }
                sports.append(sport_obj)
            
            return sports
            
        except Exception as e:
            logger.error(f"Error getting team sports: {str(e)}")
            raise
    
    async def get_individual_sports(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all individual sports."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?sport ?name ?isOlympic
        WHERE {{
            ?sport a sport:IndividualSport .
            OPTIONAL {{ ?sport sport:sportName ?name . }}
            OPTIONAL {{ ?sport rdfs:label ?name . }}
            OPTIONAL {{ ?sport sport:isOlympic ?isOlympic . }}
        }}
        ORDER BY ?name
        LIMIT {limit}
        """
        
        try:
            results = self.client.execute_query(query)
            sports_data = sparql_results_to_list(results)
            
            sports = []
            for data in sports_data:
                sport_obj = {
                    "id": extract_id_from_uri(data.get('sport', '')),
                    "name": data.get('name'),
                    "isOlympic": data.get('isOlympic', '').lower() == 'true' if data.get('isOlympic') else None
                }
                sports.append(sport_obj)
            
            return sports
            
        except Exception as e:
            logger.error(f"Error getting individual sports: {str(e)}")
            raise
    
    async def create_sport(self, sport_data: SportCreate) -> Dict[str, Any]:
        """Create a new sport."""
        data_dict = sport_data.dict(exclude={'id'}, exclude_none=True)
        insert_pattern = SPARQLCRUDHelper.build_insert_query(
            sport_data.id, "SportDiscipline", data_dict
        )
        
        query = f"""
        {self.client.get_prefixes()}
        
        INSERT DATA {{
            {insert_pattern} .
        }}
        """
        
        try:
            self.client.execute_update(query)
            logger.info(f"Created sport: {sport_data.id}")
            return await self.get_sport_by_id(sport_data.id)
        except Exception as e:
            logger.error(f"Error creating sport: {str(e)}")
            raise
    
    async def update_sport(self, sport_id: str, sport_data: SportUpdate) -> Optional[Dict[str, Any]]:
        """Update an existing sport."""
        existing = await self.get_sport_by_id(sport_id)
        if not existing:
            return None
        
        data_dict = sport_data.dict(exclude_none=True)
        if not data_dict:
            return existing
        
        delete_patterns, insert_patterns = SPARQLCRUDHelper.build_update_patterns(
            sport_id, data_dict
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
            logger.info(f"Updated sport: {sport_id}")
            return await self.get_sport_by_id(sport_id)
        except Exception as e:
            logger.error(f"Error updating sport {sport_id}: {str(e)}")
            raise
    
    async def delete_sport(self, sport_id: str) -> bool:
        """Delete a sport."""
        query = f"""
        {self.client.get_prefixes()}
        {SPARQLCRUDHelper.build_delete_query(sport_id)}
        """
        
        try:
            self.client.execute_update(query)
            logger.info(f"Deleted sport: {sport_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting sport {sport_id}: {str(e)}")
            raise


# Global service instance
sport_service = SportService()
