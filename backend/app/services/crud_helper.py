from typing import Dict, Any, Optional
from datetime import date
import logging

logger = logging.getLogger(__name__)


class SPARQLCRUDHelper:
    """Helper class for generating SPARQL CRUD queries."""
    
    @staticmethod
    def build_insert_query(entity_id: str, entity_type: str, data: Dict[str, Any], namespace: str = "sport") -> str:
        """Build a SPARQL INSERT DATA query."""
        query = f"{namespace}:{entity_id} a {namespace}:{entity_type}"
        
        for key, value in data.items():
            if value is None:
                continue
                
            property_name = key
            
            if isinstance(value, bool):
                query += f' ; {namespace}:{property_name} "{str(value).lower()}"^^xsd:boolean'
            elif isinstance(value, int):
                query += f' ; {namespace}:{property_name} "{value}"^^xsd:integer'
            elif isinstance(value, float):
                query += f' ; {namespace}:{property_name} "{value}"^^xsd:float'
            elif isinstance(value, date):
                query += f' ; {namespace}:{property_name} "{value}"^^xsd:date'
            elif isinstance(value, str):
                # Check if it's a reference to another entity (starts with uppercase or is a known pattern)
                if key in ['team', 'sport', 'homeVenue', 'competition', 'organizedBy', 'achievedBy', 'requiredFor', 'covers', 'sponsors', 'endorses']:
                    # Check if value is already a full URI
                    if value.startswith('http://') or value.startswith('https://'):
                        query += f' ; {namespace}:{property_name} <{value}>'
                    else:
                        query += f' ; {namespace}:{property_name} {namespace}:{value}'
                else:
                    # Escape quotes in string values
                    escaped_value = value.replace('"', '\\"')
                    query += f' ; {namespace}:{property_name} "{escaped_value}"'
        
        return query
    
    @staticmethod
    def build_update_patterns(entity_id: str, data: Dict[str, Any], namespace: str = "sport") -> tuple:
        """Build DELETE and INSERT patterns for UPDATE query."""
        delete_patterns = []
        insert_patterns = []
        
        for key, value in data.items():
            if value is None:
                continue
            
            property_name = key
            delete_patterns.append(f"{namespace}:{entity_id} {namespace}:{property_name} ?old{key.capitalize()} .")
            
            if isinstance(value, bool):
                insert_patterns.append(f'{namespace}:{entity_id} {namespace}:{property_name} "{str(value).lower()}"^^xsd:boolean .')
            elif isinstance(value, int):
                insert_patterns.append(f'{namespace}:{entity_id} {namespace}:{property_name} "{value}"^^xsd:integer .')
            elif isinstance(value, float):
                insert_patterns.append(f'{namespace}:{entity_id} {namespace}:{property_name} "{value}"^^xsd:float .')
            elif isinstance(value, date):
                insert_patterns.append(f'{namespace}:{entity_id} {namespace}:{property_name} "{value}"^^xsd:date .')
            elif isinstance(value, str):
                if key in ['team', 'sport', 'homeVenue', 'competition', 'organizedBy', 'achievedBy', 'requiredFor', 'covers', 'sponsors', 'endorses']:
                    # Check if value is already a full URI
                    if value.startswith('http://') or value.startswith('https://'):
                        insert_patterns.append(f'{namespace}:{entity_id} {namespace}:{property_name} <{value}> .')
                    else:
                        insert_patterns.append(f'{namespace}:{entity_id} {namespace}:{property_name} {namespace}:{value} .')
                else:
                    escaped_value = value.replace('"', '\\"')
                    insert_patterns.append(f'{namespace}:{entity_id} {namespace}:{property_name} "{escaped_value}" .')
        
        return delete_patterns, insert_patterns
    
    @staticmethod
    def build_delete_query(entity_id: str, namespace: str = "sport") -> str:
        """Build a SPARQL DELETE query."""
        return f"""
        DELETE WHERE {{
            {namespace}:{entity_id} ?p ?o .
        }}
        """
