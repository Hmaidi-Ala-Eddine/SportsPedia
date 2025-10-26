from typing import List, Optional, Dict, Any
from app.services.fuseki_client import fuseki_client
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri
import logging

logger = logging.getLogger(__name__)


class MediaService:
    """Service for Media-related operations."""
    
    def __init__(self):
        self.client = fuseki_client
    
    async def get_all_media(self, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """
        Get all media.
        
        Args:
            limit: Maximum number of results
            offset: Number of results to skip
            
        Returns:
            Dict with media list and total count
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?media ?name ?mediaType ?broadcastDate ?event ?broadcaster
        WHERE {{
            ?media a sport:Media .
            OPTIONAL {{ ?media sport:mediaTitle ?name . }}
            OPTIONAL {{ ?media rdfs:label ?name . }}
            OPTIONAL {{ ?media a ?mediaType . }}
            OPTIONAL {{ ?media sport:broadcastDate ?broadcastDate . }}
            OPTIONAL {{ ?media sport:covers ?event . }}
            OPTIONAL {{ ?media sport:broadcastBy ?broadcaster . }}
        }}
        ORDER BY DESC(?broadcastDate)
        LIMIT {limit}
        OFFSET {offset}
        """
        
        try:
            results = self.client.execute_query(query)
            media_data = sparql_results_to_list(results)
            
            media_list = []
            for data in media_data:
                media = {
                    "id": extract_id_from_uri(data.get('media', '')),
                    "name": data.get('name'),
                    "type": extract_id_from_uri(data.get('mediaType', '')) if data.get('mediaType') else None,
                    "broadcastDate": data.get('broadcastDate'),
                    "event": extract_id_from_uri(data.get('event', '')) if data.get('event') else None,
                    "broadcaster": data.get('broadcaster')
                }
                media_list.append(media)
            
            return {"media": media_list, "total": len(media_list)}
            
        except Exception as e:
            logger.error(f"Error getting media: {str(e)}")
            raise
    
    async def get_broadcasters(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all broadcasters."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?broadcaster ?name ?country ?foundedYear
        WHERE {{
            ?broadcaster a sport:Broadcaster .
            OPTIONAL {{ ?broadcaster sport:broadcasterName ?name . }}
            OPTIONAL {{ ?broadcaster rdfs:label ?name . }}
            OPTIONAL {{ ?broadcaster sport:country ?country . }}
            OPTIONAL {{ ?broadcaster sport:foundedYear ?foundedYear . }}
        }}
        ORDER BY ?name
        LIMIT {limit}
        """
        
        try:
            results = self.client.execute_query(query)
            broadcasters_data = sparql_results_to_list(results)
            
            broadcasters = []
            for data in broadcasters_data:
                broadcaster = {
                    "id": extract_id_from_uri(data.get('broadcaster', '')),
                    "name": data.get('name'),
                    "country": data.get('country'),
                    "foundedYear": int(data['foundedYear']) if data.get('foundedYear') else None
                }
                broadcasters.append(broadcaster)
            
            return broadcasters
            
        except Exception as e:
            logger.error(f"Error getting broadcasters: {str(e)}")
            raise


# Global service instance
media_service = MediaService()
