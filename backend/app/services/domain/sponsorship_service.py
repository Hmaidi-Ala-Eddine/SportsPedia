from typing import List, Optional, Dict, Any
from app.services.fuseki_client import fuseki_client
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri
from app.models.domain.sponsorship import SponsorshipCreate, SponsorshipUpdate
from app.services.crud_helper import SPARQLCRUDHelper
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
        
        SELECT DISTINCT ?sponsorship ?sponsorName ?dealValue ?contractDuration ?industry ?sponsors ?endorses
        WHERE {{
            ?sponsorship a sport:Sponsorship .
            OPTIONAL {{ ?sponsorship sport:sponsorName ?sponsorName . }}
            OPTIONAL {{ ?sponsorship sport:dealValue ?dealValue . }}
            OPTIONAL {{ ?sponsorship sport:contractDuration ?contractDuration . }}
            OPTIONAL {{ ?sponsorship sport:industry ?industry . }}
            OPTIONAL {{ ?sponsorship sport:sponsors ?sponsors . }}
            OPTIONAL {{ ?sponsorship sport:endorses ?endorses . }}
        }}
        ORDER BY ?sponsorName
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
                    "sponsorName": data.get('sponsorName'),
                    "amount": int(float(data['dealValue'])) if data.get('dealValue') else None,
                    "dealValue": int(float(data['dealValue'])) if data.get('dealValue') else None,
                    "contractDuration": int(float(data['contractDuration'])) if data.get('contractDuration') else None,
                    "industry": data.get('industry'),
                    "sponsee": data.get('sponsors'),
                    "endorses": data.get('endorses')
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
    
    async def create_sponsorship(self, spon_data: SponsorshipCreate) -> Dict[str, Any]:
        """Create a new sponsorship."""
        data_dict = spon_data.dict(exclude={'id'}, exclude_none=True)
        insert_pattern = SPARQLCRUDHelper.build_insert_query(spon_data.id, "Sponsorship", data_dict)
        query = f"{self.client.get_prefixes()}\nINSERT DATA {{ {insert_pattern} . }}"
        try:
            self.client.execute_update(query)
            logger.info(f"Created sponsorship: {spon_data.id}")
            return {"id": spon_data.id, **data_dict}
        except Exception as e:
            logger.error(f"Error creating sponsorship: {str(e)}")
            raise
    
    async def update_sponsorship(self, spon_id: str, spon_data: SponsorshipUpdate) -> Optional[Dict[str, Any]]:
        """Update an existing sponsorship."""
        data_dict = spon_data.dict(exclude_none=True)
        if not data_dict:
            return {"id": spon_id}
        delete_patterns, insert_patterns = SPARQLCRUDHelper.build_update_patterns(spon_id, data_dict)
        
        # Build WHERE clause with proper OPTIONAL blocks
        where_clause = '\n            '.join([f'OPTIONAL {{ {pattern} }}' for pattern in delete_patterns])
        
        query = f"""
        {self.client.get_prefixes()}
        
        DELETE {{
            {' '.join(delete_patterns)}
        }}
        INSERT {{
            {' '.join(insert_patterns)}
        }}
        WHERE {{
            {where_clause}
        }}
        """
        
        logger.info(f"Update query for {spon_id}: {query}")
        try:
            self.client.execute_update(query)
            logger.info(f"Updated sponsorship: {spon_id}")
            return {"id": spon_id, **data_dict}
        except Exception as e:
            logger.error(f"Error updating sponsorship {spon_id}: {str(e)}")
            raise
    
    async def delete_sponsorship(self, spon_id: str) -> bool:
        """Delete a sponsorship."""
        query = f"{self.client.get_prefixes()}\n{SPARQLCRUDHelper.build_delete_query(spon_id)}"
        try:
            self.client.execute_update(query)
            logger.info(f"Deleted sponsorship: {spon_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting sponsorship {spon_id}: {str(e)}")
            raise


# Global service instance
sponsorship_service = SponsorshipService()
