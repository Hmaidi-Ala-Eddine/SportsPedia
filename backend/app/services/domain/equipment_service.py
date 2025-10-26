from typing import List, Optional, Dict, Any
from app.services.fuseki_client import fuseki_client
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri
import logging

logger = logging.getLogger(__name__)


class EquipmentService:
    """Service for Equipment-related operations."""
    
    def __init__(self):
        self.client = fuseki_client
    
    async def get_all_equipment(self, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """
        Get all equipment.
        
        Args:
            limit: Maximum number of results
            offset: Number of results to skip
            
        Returns:
            Dict with equipment list and total count
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?equipment ?name ?sport ?equipmentType ?description
        WHERE {{
            ?equipment a sport:Equipment .
            OPTIONAL {{ ?equipment sport:equipmentName ?name . }}
            OPTIONAL {{ ?equipment rdfs:label ?name . }}
            OPTIONAL {{ ?equipment sport:usedIn ?sport . }}
            OPTIONAL {{ ?equipment a ?equipmentType . }}
            OPTIONAL {{ ?equipment rdfs:comment ?description . }}
        }}
        ORDER BY ?name
        LIMIT {limit}
        OFFSET {offset}
        """
        
        try:
            results = self.client.execute_query(query)
            equipment_data = sparql_results_to_list(results)
            
            equipment_list = []
            for data in equipment_data:
                equipment = {
                    "id": extract_id_from_uri(data.get('equipment', '')),
                    "name": data.get('name'),
                    "sport": extract_id_from_uri(data.get('sport', '')) if data.get('sport') else None,
                    "type": extract_id_from_uri(data.get('equipmentType', '')) if data.get('equipmentType') else None,
                    "description": data.get('description')
                }
                equipment_list.append(equipment)
            
            return {"equipment": equipment_list, "total": len(equipment_list)}
            
        except Exception as e:
            logger.error(f"Error getting equipment: {str(e)}")
            raise
    
    async def get_equipment_by_sport(self, sport_id: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Get equipment used in a specific sport."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?equipment ?name ?equipmentType ?description
        WHERE {{
            ?equipment a sport:Equipment .
            ?equipment sport:usedIn sport:{sport_id} .
            OPTIONAL {{ ?equipment sport:equipmentName ?name . }}
            OPTIONAL {{ ?equipment rdfs:label ?name . }}
            OPTIONAL {{ ?equipment a ?equipmentType . }}
            OPTIONAL {{ ?equipment rdfs:comment ?description . }}
        }}
        ORDER BY ?name
        LIMIT {limit}
        """
        
        try:
            results = self.client.execute_query(query)
            equipment_data = sparql_results_to_list(results)
            
            equipment_list = []
            for data in equipment_data:
                equipment = {
                    "id": extract_id_from_uri(data.get('equipment', '')),
                    "name": data.get('name'),
                    "type": extract_id_from_uri(data.get('equipmentType', '')) if data.get('equipmentType') else None,
                    "description": data.get('description')
                }
                equipment_list.append(equipment)
            
            return equipment_list
            
        except Exception as e:
            logger.error(f"Error getting equipment for sport {sport_id}: {str(e)}")
            raise


# Global service instance
equipment_service = EquipmentService()
