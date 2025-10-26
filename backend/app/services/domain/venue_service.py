from typing import List, Optional, Dict, Any
from app.services.fuseki_client import fuseki_client
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri
import logging

logger = logging.getLogger(__name__)


class VenueService:
    """Service for Venue-related operations."""
    
    def __init__(self):
        self.client = fuseki_client
    
    async def get_all_venues(self, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """
        Get all venues.
        
        Args:
            limit: Maximum number of results
            offset: Number of results to skip
            
        Returns:
            Dict with venues list and total count
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?venue ?name ?city ?country ?capacity ?openedYear
        WHERE {{
            ?venue a sport:Venue .
            OPTIONAL {{ ?venue sport:venueName ?name . }}
            OPTIONAL {{ ?venue sport:city ?city . }}
            OPTIONAL {{ ?venue sport:country ?country . }}
            OPTIONAL {{ ?venue sport:capacity ?capacity . }}
            OPTIONAL {{ ?venue sport:openedYear ?openedYear . }}
        }}
        ORDER BY ?name
        LIMIT {limit}
        OFFSET {offset}
        """
        
        try:
            results = self.client.execute_query(query)
            venues_data = sparql_results_to_list(results)
            
            venues = []
            for data in venues_data:
                venue = {
                    "id": extract_id_from_uri(data.get('venue', '')),
                    "name": data.get('name'),
                    "city": data.get('city'),
                    "country": data.get('country'),
                    "capacity": int(data['capacity']) if data.get('capacity') else None,
                    "openedYear": int(data['openedYear']) if data.get('openedYear') else None
                }
                venues.append(venue)
            
            return {"venues": venues, "total": len(venues)}
            
        except Exception as e:
            logger.error(f"Error getting venues: {str(e)}")
            raise
    
    async def get_venue_by_id(self, venue_id: str) -> Optional[Dict[str, Any]]:
        """
        Get venue by ID.
        
        Args:
            venue_id: Venue identifier
            
        Returns:
            Venue dict or None
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT ?name ?city ?country ?capacity ?openedYear ?surface ?roofType
        WHERE {{
            sport:{venue_id} a sport:Venue .
            OPTIONAL {{ sport:{venue_id} sport:venueName ?name . }}
            OPTIONAL {{ sport:{venue_id} sport:city ?city . }}
            OPTIONAL {{ sport:{venue_id} sport:country ?country . }}
            OPTIONAL {{ sport:{venue_id} sport:capacity ?capacity . }}
            OPTIONAL {{ sport:{venue_id} sport:openedYear ?openedYear . }}
            OPTIONAL {{ sport:{venue_id} sport:surface ?surface . }}
            OPTIONAL {{ sport:{venue_id} sport:roofType ?roofType . }}
        }}
        LIMIT 1
        """
        
        try:
            results = self.client.execute_query(query)
            venues_data = sparql_results_to_list(results)
            
            if not venues_data:
                return None
            
            data = venues_data[0]
            
            venue = {
                "id": venue_id,
                "name": data.get('name'),
                "city": data.get('city'),
                "country": data.get('country'),
                "capacity": int(data['capacity']) if data.get('capacity') else None,
                "openedYear": int(data['openedYear']) if data.get('openedYear') else None,
                "surface": data.get('surface'),
                "roofType": data.get('roofType')
            }
            
            return venue
            
        except Exception as e:
            logger.error(f"Error getting venue {venue_id}: {str(e)}")
            raise
    
    async def get_stadiums(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all stadiums (a subclass of Venue)."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?stadium ?name ?city ?country ?capacity
        WHERE {{
            ?stadium a sport:Stadium .
            OPTIONAL {{ ?stadium sport:venueName ?name . }}
            OPTIONAL {{ ?stadium sport:city ?city . }}
            OPTIONAL {{ ?stadium sport:country ?country . }}
            OPTIONAL {{ ?stadium sport:capacity ?capacity . }}
        }}
        ORDER BY DESC(?capacity)
        LIMIT {limit}
        """
        
        try:
            results = self.client.execute_query(query)
            stadiums_data = sparql_results_to_list(results)
            
            stadiums = []
            for data in stadiums_data:
                stadium = {
                    "id": extract_id_from_uri(data.get('stadium', '')),
                    "name": data.get('name'),
                    "city": data.get('city'),
                    "country": data.get('country'),
                    "capacity": int(data['capacity']) if data.get('capacity') else None
                }
                stadiums.append(stadium)
            
            return stadiums
            
        except Exception as e:
            logger.error(f"Error getting stadiums: {str(e)}")
            raise


# Global service instance
venue_service = VenueService()
