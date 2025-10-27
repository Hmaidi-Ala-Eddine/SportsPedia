from typing import List, Optional, Dict, Any
from app.services.fuseki_client import fuseki_client
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri
from app.models.domain.organization import OrganizationCreate, OrganizationUpdate
from app.services.crud_helper import SPARQLCRUDHelper
import logging

logger = logging.getLogger(__name__)


class OrganizationService:
    """Service for Organization-related operations."""
    
    def __init__(self):
        self.client = fuseki_client
    
    async def get_all_organizations(self, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """
        Get all organizations.
        
        Args:
            limit: Maximum number of results
            offset: Number of results to skip
            
        Returns:
            Dict with organizations list and total count
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?organization ?name ?foundedYear ?headquarters ?orgType
        WHERE {{
            ?organization a sport:Organization .
            OPTIONAL {{ ?organization sport:organizationName ?name . }}
            OPTIONAL {{ ?organization rdfs:label ?name . }}
            OPTIONAL {{ ?organization sport:foundedYear ?foundedYear . }}
            OPTIONAL {{ ?organization sport:headquarters ?headquarters . }}
            OPTIONAL {{ ?organization a ?orgType . }}
        }}
        ORDER BY ?name
        LIMIT {limit}
        OFFSET {offset}
        """
        
        try:
            results = self.client.execute_query(query)
            orgs_data = sparql_results_to_list(results)
            
            organizations = []
            for data in orgs_data:
                org = {
                    "id": extract_id_from_uri(data.get('organization', '')),
                    "name": data.get('name'),
                    "foundedYear": int(data['foundedYear']) if data.get('foundedYear') else None,
                    "headquarters": data.get('headquarters'),
                    "type": extract_id_from_uri(data.get('orgType', '')) if data.get('orgType') else None
                }
                organizations.append(org)
            
            return {"organizations": organizations, "total": len(organizations)}
            
        except Exception as e:
            logger.error(f"Error getting organizations: {str(e)}")
            raise
    
    async def get_federations(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all federations (governing bodies)."""
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?federation ?name ?foundedYear ?headquarters ?sport
        WHERE {{
            ?federation a sport:Federation .
            OPTIONAL {{ ?federation sport:organizationName ?name . }}
            OPTIONAL {{ ?federation rdfs:label ?name . }}
            OPTIONAL {{ ?federation sport:foundedYear ?foundedYear . }}
            OPTIONAL {{ ?federation sport:headquarters ?headquarters . }}
            OPTIONAL {{ ?federation sport:governs ?sport . }}
        }}
        ORDER BY ?name
        LIMIT {limit}
        """
        
        try:
            results = self.client.execute_query(query)
            federations_data = sparql_results_to_list(results)
            
            federations = []
            for data in federations_data:
                federation = {
                    "id": extract_id_from_uri(data.get('federation', '')),
                    "name": data.get('name'),
                    "foundedYear": int(data['foundedYear']) if data.get('foundedYear') else None,
                    "headquarters": data.get('headquarters'),
                    "sport": extract_id_from_uri(data.get('sport', '')) if data.get('sport') else None
                }
                federations.append(federation)
            
            return federations
            
        except Exception as e:
            logger.error(f"Error getting federations: {str(e)}")
            raise
    
    async def create_organization(self, org_data: OrganizationCreate) -> Dict[str, Any]:
        """Create a new organization."""
        data_dict = org_data.dict(exclude={'id'}, exclude_none=True)
        insert_pattern = SPARQLCRUDHelper.build_insert_query(org_data.id, "Organization", data_dict)
        query = f"{self.client.get_prefixes()}\nINSERT DATA {{ {insert_pattern} . }}"
        try:
            self.client.execute_update(query)
            logger.info(f"Created organization: {org_data.id}")
            return {"id": org_data.id, **data_dict}
        except Exception as e:
            logger.error(f"Error creating organization: {str(e)}")
            raise
    
    async def update_organization(self, org_id: str, org_data: OrganizationUpdate) -> Optional[Dict[str, Any]]:
        """Update an existing organization."""
        data_dict = org_data.dict(exclude_none=True)
        if not data_dict:
            return {"id": org_id}
        delete_patterns, insert_patterns = SPARQLCRUDHelper.build_update_patterns(org_id, data_dict)
        query = f"{self.client.get_prefixes()}\nDELETE {{ {' '.join(delete_patterns)} }}\nINSERT {{ {' '.join(insert_patterns)} }}\nWHERE {{ {' OPTIONAL { ' + ' } OPTIONAL { '.join(delete_patterns) + ' }'} }}"
        try:
            self.client.execute_update(query)
            logger.info(f"Updated organization: {org_id}")
            return {"id": org_id, **data_dict}
        except Exception as e:
            logger.error(f"Error updating organization {org_id}: {str(e)}")
            raise
    
    async def delete_organization(self, org_id: str) -> bool:
        """Delete an organization."""
        query = f"{self.client.get_prefixes()}\n{SPARQLCRUDHelper.build_delete_query(org_id)}"
        try:
            self.client.execute_update(query)
            logger.info(f"Deleted organization: {org_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting organization {org_id}: {str(e)}")
            raise


# Global service instance
organization_service = OrganizationService()
