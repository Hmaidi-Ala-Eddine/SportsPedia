from typing import List, Optional, Dict, Any
from app.services.fuseki_client import fuseki_client
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri
import logging

logger = logging.getLogger(__name__)


class PerformanceService:
    """Service for Performance and Records-related operations."""
    
    def __init__(self):
        self.client = fuseki_client
    
    async def get_all_records(self, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """
        Get all records.
        
        Args:
            limit: Maximum number of results
            offset: Number of results to skip
            
        Returns:
            Dict with records list and total count
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?record ?recordType ?value ?athlete ?athleteName ?date ?sport
        WHERE {{
            ?record a sport:Record .
            OPTIONAL {{ ?record sport:recordType ?recordType . }}
            OPTIONAL {{ ?record sport:recordValue ?value . }}
            OPTIONAL {{ 
                ?record sport:setBy ?athlete .
                ?athlete sport:lastName ?athleteName .
            }}
            OPTIONAL {{ ?record sport:setOn ?date . }}
            OPTIONAL {{ ?record sport:inSport ?sport . }}
        }}
        ORDER BY DESC(?date)
        LIMIT {limit}
        OFFSET {offset}
        """
        
        try:
            results = self.client.execute_query(query)
            records_data = sparql_results_to_list(results)
            
            records = []
            for data in records_data:
                record = {
                    "id": extract_id_from_uri(data.get('record', '')),
                    "recordType": data.get('recordType'),
                    "value": data.get('value'),
                    "athleteId": extract_id_from_uri(data.get('athlete', '')) if data.get('athlete') else None,
                    "athleteName": data.get('athleteName'),
                    "date": data.get('date'),
                    "sport": extract_id_from_uri(data.get('sport', '')) if data.get('sport') else None
                }
                records.append(record)
            
            return {"records": records, "total": len(records)}
            
        except Exception as e:
            logger.error(f"Error getting records: {str(e)}")
            raise
    
    async def get_athlete_records(self, athlete_id: str) -> List[Dict[str, Any]]:
        """Get all records for a specific athlete."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?record ?recordType ?value ?date ?sport
        WHERE {{
            ?record a sport:Record .
            ?record sport:setBy sport:{athlete_id} .
            OPTIONAL {{ ?record sport:recordType ?recordType . }}
            OPTIONAL {{ ?record sport:recordValue ?value . }}
            OPTIONAL {{ ?record sport:setOn ?date . }}
            OPTIONAL {{ ?record sport:inSport ?sport . }}
        }}
        ORDER BY DESC(?date)
        """
        
        try:
            results = self.client.execute_query(query)
            records_data = sparql_results_to_list(results)
            
            records = []
            for data in records_data:
                record = {
                    "id": extract_id_from_uri(data.get('record', '')),
                    "recordType": data.get('recordType'),
                    "value": data.get('value'),
                    "date": data.get('date'),
                    "sport": extract_id_from_uri(data.get('sport', '')) if data.get('sport') else None
                }
                records.append(record)
            
            return records
            
        except Exception as e:
            logger.error(f"Error getting records for athlete {athlete_id}: {str(e)}")
            raise
    
    async def get_statistics(self, entity_type: str, entity_id: str) -> Dict[str, Any]:
        """Get performance statistics for an entity (athlete, team, etc.)."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT ?statType ?value
        WHERE {{
            sport:{entity_id} a sport:{entity_type} .
            ?stat sport:forEntity sport:{entity_id} .
            ?stat sport:statisticType ?statType .
            ?stat sport:value ?value .
        }}
        """
        
        try:
            results = self.client.execute_query(query)
            stats_data = sparql_results_to_list(results)
            
            statistics = {}
            for data in stats_data:
                stat_type = data.get('statType', '')
                value = data.get('value')
                statistics[stat_type] = value
            
            return statistics
            
        except Exception as e:
            logger.error(f"Error getting statistics for {entity_type} {entity_id}: {str(e)}")
            raise


# Global service instance
performance_service = PerformanceService()
