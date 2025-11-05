from typing import List, Optional, Dict, Any
from app.services.fuseki_client import fuseki_client
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri
from app.models.domain.equipment import EquipmentCreate, EquipmentUpdate
from app.services.crud_helper import SPARQLCRUDHelper
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
        
        SELECT DISTINCT ?equipment ?name ?brand ?model ?price ?color ?size ?material ?requiredFor
        WHERE {{
            ?equipment a sport:Equipment .
            OPTIONAL {{ ?equipment sport:equipmentName ?name . }}
            OPTIONAL {{ ?equipment sport:brand ?brand . }}
            OPTIONAL {{ ?equipment sport:model ?model . }}
            OPTIONAL {{ ?equipment sport:price ?price . }}
            OPTIONAL {{ ?equipment sport:color ?color . }}
            OPTIONAL {{ ?equipment sport:size ?size . }}
            OPTIONAL {{ ?equipment sport:material ?material . }}
            OPTIONAL {{ ?equipment sport:requiredFor ?requiredFor . }}
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
                    "brand": data.get('brand'),
                    "model": data.get('model'),
                    "price": int(float(data['price'])) if data.get('price') else None,
                    "color": data.get('color'),
                    "size": data.get('size'),
                    "material": data.get('material'),
                    "sport": data.get('requiredFor')
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
    
    async def create_equipment(self, equip_data: EquipmentCreate) -> Dict[str, Any]:
        """Create new equipment."""
        data_dict = equip_data.dict(exclude={'id'}, exclude_none=True)
        insert_pattern = SPARQLCRUDHelper.build_insert_query(
            equip_data.id, "Equipment", data_dict
        )
        
        query = f"""
        {self.client.get_prefixes()}
        
        INSERT DATA {{
            {insert_pattern} .
        }}
        """
        
        try:
            self.client.execute_update(query)
            logger.info(f"Created equipment: {equip_data.id}")
            return {"id": equip_data.id, **data_dict}
        except Exception as e:
            logger.error(f"Error creating equipment: {str(e)}")
            raise
    
    async def update_equipment(self, equip_id: str, equip_data: EquipmentUpdate) -> Optional[Dict[str, Any]]:
        """Update existing equipment."""
        data_dict = equip_data.dict(exclude_none=True)
        if not data_dict:
            return {"id": equip_id}
        
        delete_patterns, insert_patterns = SPARQLCRUDHelper.build_update_patterns(
            equip_id, data_dict
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
            logger.info(f"Updated equipment: {equip_id}")
            return {"id": equip_id, **data_dict}
        except Exception as e:
            logger.error(f"Error updating equipment {equip_id}: {str(e)}")
            raise
    
    async def delete_equipment(self, equip_id: str) -> bool:
        """Delete equipment."""
        query = f"""
        {self.client.get_prefixes()}
        {SPARQLCRUDHelper.build_delete_query(equip_id)}
        """
        
        try:
            self.client.execute_update(query)
            logger.info(f"Deleted equipment: {equip_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting equipment {equip_id}: {str(e)}")
            raise


# Global service instance
equipment_service = EquipmentService()
