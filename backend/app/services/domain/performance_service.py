from typing import List, Optional, Dict, Any
from app.services.fuseki_client import fuseki_client
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri
from app.models.domain.performance import PerformanceCreate, PerformanceUpdate
from app.services.crud_helper import SPARQLCRUDHelper
import logging

logger = logging.getLogger(__name__)


class PerformanceService:
    """Service for Performance and Records-related operations."""
    
    def __init__(self):
        self.client = fuseki_client
    
    async def get_all_achievements(self, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """
        Get all achievements.
        
        Args:
            limit: Maximum number of results
            offset: Number of results to skip
            
        Returns:
            Dict with achievements list and total count
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?achievement ?achievementType ?year ?performanceValue ?unit ?athlete ?firstName ?lastName
        WHERE {{
            ?achievement a sport:Achievement .
            OPTIONAL {{ ?achievement sport:achievementType ?achievementType . }}
            OPTIONAL {{ ?achievement sport:year ?year . }}
            OPTIONAL {{ ?achievement sport:performanceValue ?performanceValue . }}
            OPTIONAL {{ ?achievement sport:unit ?unit . }}
            OPTIONAL {{ 
                ?achievement sport:achievedBy ?athlete .
                ?athlete sport:firstName ?firstName .
                ?athlete sport:lastName ?lastName .
            }}
        }}
        ORDER BY DESC(?year)
        LIMIT {limit}
        OFFSET {offset}
        """
        
        try:
            results = self.client.execute_query(query)
            achievements_data = sparql_results_to_list(results)
            
            achievements = []
            for data in achievements_data:
                first_name = data.get('firstName', '')
                last_name = data.get('lastName', '')
                full_name = f"{first_name} {last_name}".strip() if first_name or last_name else None
                
                achievement = {
                    "id": extract_id_from_uri(data.get('achievement', '')),
                    "achievementType": data.get('achievementType'),
                    "year": int(data.get('year')) if data.get('year') else None,
                    "performanceValue": data.get('performanceValue'),
                    "unit": data.get('unit'),
                    "athleteId": extract_id_from_uri(data.get('athlete', '')) if data.get('athlete') else None,
                    "achievedBy": full_name
                }
                achievements.append(achievement)
            
            return {"achievements": achievements, "total": len(achievements)}
            
        except Exception as e:
            logger.error(f"Error getting achievements: {str(e)}")
            raise
    
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
        
        SELECT DISTINCT ?record ?recordType ?value ?athlete ?firstName ?lastName ?date ?sport
        WHERE {{
            ?record a sport:Record .
            OPTIONAL {{ ?record sport:recordType ?recordType . }}
            OPTIONAL {{ ?record sport:recordValue ?value . }}
            OPTIONAL {{ 
                ?record sport:setBy ?athlete .
                ?athlete sport:firstName ?firstName .
                ?athlete sport:lastName ?lastName .
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
                first_name = data.get('firstName', '')
                last_name = data.get('lastName', '')
                full_name = f"{first_name} {last_name}".strip() if first_name or last_name else None
                
                record = {
                    "id": extract_id_from_uri(data.get('record', '')),
                    "recordType": data.get('recordType'),
                    "recordValue": data.get('value'),
                    "athleteId": extract_id_from_uri(data.get('athlete', '')) if data.get('athlete') else None,
                    "setBy": full_name,
                    "setOn": data.get('date'),
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
    
    async def create_performance(self, perf_data: PerformanceCreate) -> Dict[str, Any]:
        """Create a new performance/record."""
        data_dict = perf_data.dict(exclude={'id'}, exclude_none=True)
        insert_pattern = SPARQLCRUDHelper.build_insert_query(perf_data.id, "Performance", data_dict)
        query = f"{self.client.get_prefixes()}\nINSERT DATA {{ {insert_pattern} . }}"
        try:
            self.client.execute_update(query)
            logger.info(f"Created performance: {perf_data.id}")
            return {"id": perf_data.id, **data_dict}
        except Exception as e:
            logger.error(f"Error creating performance: {str(e)}")
            raise
    
    async def update_performance(self, perf_id: str, perf_data: PerformanceUpdate) -> Optional[Dict[str, Any]]:
        """Update an existing performance/record."""
        data_dict = perf_data.dict(exclude_none=True)
        if not data_dict:
            return {"id": perf_id}
        delete_patterns, insert_patterns = SPARQLCRUDHelper.build_update_patterns(perf_id, data_dict)
        query = f"{self.client.get_prefixes()}\nDELETE {{ {' '.join(delete_patterns)} }}\nINSERT {{ {' '.join(insert_patterns)} }}\nWHERE {{ {' OPTIONAL { ' + ' } OPTIONAL { '.join(delete_patterns) + ' }'} }}"
        try:
            self.client.execute_update(query)
            logger.info(f"Updated performance: {perf_id}")
            return {"id": perf_id, **data_dict}
        except Exception as e:
            logger.error(f"Error updating performance {perf_id}: {str(e)}")
            raise
    
    async def delete_performance(self, perf_id: str) -> bool:
        """Delete a performance/record."""
        query = f"{self.client.get_prefixes()}\n{SPARQLCRUDHelper.build_delete_query(perf_id)}"
        try:
            self.client.execute_update(query)
            logger.info(f"Deleted performance: {perf_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting performance {perf_id}: {str(e)}")
            raise


# Global service instance
performance_service = PerformanceService()
