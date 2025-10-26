from typing import List, Optional, Dict, Any
from app.services.fuseki_client import fuseki_client
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri
import logging

logger = logging.getLogger(__name__)


class SponsorshipService:
    """Service for Sponsorship-related operations."""
    
    def __init__(self):
        self.client = fuseki_client
    
    async def get_all_sponsorships(self, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """
        Get all sponsorships.
        
        Args:
            limit: Maximum number of results
            offset: Number of results to skip
            
        Returns:
            Dict with sponsorships list and total count
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?sponsorship ?sponsor ?sponsorName ?sponsee ?startDate ?endDate ?amount
        WHERE {{
            ?sponsorship a sport:Sponsorship .
            OPTIONAL {{ 
                ?sponsorship sport:sponsor ?sponsor .
                ?sponsor sport:companyName ?sponsorName .
            }}
            OPTIONAL {{ ?sponsorship sport:sponsors ?sponsee . }}
            OPTIONAL {{ ?sponsorship sport:startDate ?startDate . }}
            OPTIONAL {{ ?sponsorship sport:endDate ?endDate . }}
            OPTIONAL {{ ?sponsorship sport:amount ?amount . }}
        }}
        ORDER BY DESC(?startDate)
        LIMIT {limit}
        OFFSET {offset}
        """
        
        try:
            results = self.client.execute_query(query)
            sponsorships_data = sparql_results_to_list(results)
            
            sponsorships = []
            for data in sponsorships_data:
                sponsorship = {
                    "id": extract_id_from_uri(data.get('sponsorship', '')),
                    "sponsorId": extract_id_from_uri(data.get('sponsor', '')) if data.get('sponsor') else None,
                    "sponsorName": data.get('sponsorName'),
                    "sponsee": extract_id_from_uri(data.get('sponsee', '')) if data.get('sponsee') else None,
                    "startDate": data.get('startDate'),
                    "endDate": data.get('endDate'),
                    "amount": float(data['amount']) if data.get('amount') else None
                }
                sponsorships.append(sponsorship)
            
            return {"sponsorships": sponsorships, "total": len(sponsorships)}
            
        except Exception as e:
            logger.error(f"Error getting sponsorships: {str(e)}")
            raise
    
    async def get_team_sponsors(self, team_id: str) -> List[Dict[str, Any]]:
        """Get all sponsors for a specific team."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?sponsorship ?sponsor ?sponsorName ?startDate ?endDate ?amount
        WHERE {{
            ?sponsorship a sport:Sponsorship .
            ?sponsorship sport:sponsors sport:{team_id} .
            OPTIONAL {{ 
                ?sponsorship sport:sponsor ?sponsor .
                ?sponsor sport:companyName ?sponsorName .
            }}
            OPTIONAL {{ ?sponsorship sport:startDate ?startDate . }}
            OPTIONAL {{ ?sponsorship sport:endDate ?endDate . }}
            OPTIONAL {{ ?sponsorship sport:amount ?amount . }}
        }}
        ORDER BY DESC(?startDate)
        """
        
        try:
            results = self.client.execute_query(query)
            sponsorships_data = sparql_results_to_list(results)
            
            sponsorships = []
            for data in sponsorships_data:
                sponsorship = {
                    "id": extract_id_from_uri(data.get('sponsorship', '')),
                    "sponsorId": extract_id_from_uri(data.get('sponsor', '')) if data.get('sponsor') else None,
                    "sponsorName": data.get('sponsorName'),
                    "startDate": data.get('startDate'),
                    "endDate": data.get('endDate'),
                    "amount": float(data['amount']) if data.get('amount') else None
                }
                sponsorships.append(sponsorship)
            
            return sponsorships
            
        except Exception as e:
            logger.error(f"Error getting sponsors for team {team_id}: {str(e)}")
            raise
    
    async def get_athlete_endorsements(self, athlete_id: str) -> List[Dict[str, Any]]:
        """Get all endorsements for a specific athlete."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?endorsement ?sponsor ?sponsorName ?startDate ?endDate ?amount
        WHERE {{
            ?endorsement a sport:Endorsement .
            ?endorsement sport:endorses sport:{athlete_id} .
            OPTIONAL {{ 
                ?endorsement sport:sponsor ?sponsor .
                ?sponsor sport:companyName ?sponsorName .
            }}
            OPTIONAL {{ ?endorsement sport:startDate ?startDate . }}
            OPTIONAL {{ ?endorsement sport:endDate ?endDate . }}
            OPTIONAL {{ ?endorsement sport:amount ?amount . }}
        }}
        ORDER BY DESC(?startDate)
        """
        
        try:
            results = self.client.execute_query(query)
            endorsements_data = sparql_results_to_list(results)
            
            endorsements = []
            for data in endorsements_data:
                endorsement = {
                    "id": extract_id_from_uri(data.get('endorsement', '')),
                    "sponsorId": extract_id_from_uri(data.get('sponsor', '')) if data.get('sponsor') else None,
                    "sponsorName": data.get('sponsorName'),
                    "startDate": data.get('startDate'),
                    "endDate": data.get('endDate'),
                    "amount": float(data['amount']) if data.get('amount') else None
                }
                endorsements.append(endorsement)
            
            return endorsements
            
        except Exception as e:
            logger.error(f"Error getting endorsements for athlete {athlete_id}: {str(e)}")
            raise


# Global service instance
sponsorship_service = SponsorshipService()
