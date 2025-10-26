"""
SPARQL Service - Helper functions for building and executing SPARQL queries
"""
from typing import Dict, Any, Optional
from pathlib import Path
from app.services.fuseki_client import fuseki_client
import logging

logger = logging.getLogger(__name__)


class SPARQLService:
    """Service for SPARQL query building and execution."""
    
    def __init__(self):
        self.client = fuseki_client
        self.queries_path = Path(__file__).parent.parent.parent.parent / "ontology" / "sparql_queries"
    
    def load_query_template(self, category: str, query_name: str) -> Optional[str]:
        """
        Load a SPARQL query template from file.
        
        Args:
            category: Query category (e.g., 'persons', 'teams')
            query_name: Query file name without extension
            
        Returns:
            Query template string or None if not found
        """
        query_file = self.queries_path / category / f"{query_name}.sparql"
        
        try:
            if query_file.exists():
                with open(query_file, 'r', encoding='utf-8') as f:
                    return f.read()
            else:
                logger.warning(f"Query template not found: {query_file}")
                return None
        except Exception as e:
            logger.error(f"Error loading query template: {str(e)}")
            return None
    
    def build_query(self, template: str, **params) -> str:
        """
        Build a SPARQL query from template with parameters.
        
        Args:
            template: Query template string
            **params: Template parameters
            
        Returns:
            Formatted query string
        """
        query = template
        for key, value in params.items():
            placeholder = f"{{{{{key}}}}}"
            query = query.replace(placeholder, str(value))
        
        return query
    
    async def execute_template_query(self, category: str, query_name: str, **params) -> Dict[str, Any]:
        """
        Load and execute a query template.
        
        Args:
            category: Query category
            query_name: Query file name
            **params: Query parameters
            
        Returns:
            Query results
        """
        template = self.load_query_template(category, query_name)
        if not template:
            raise ValueError(f"Query template not found: {category}/{query_name}")
        
        query = self.build_query(template, **params)
        return self.client.execute_query(query)
    
    async def semantic_search(self, search_term: str, limit: int = 50) -> Dict[str, Any]:
        """
        Perform semantic search across all entities.
        
        Args:
            search_term: Search term
            limit: Maximum results
            
        Returns:
            Search results
        """
        query = f"""
        {self.client.get_prefixes()}
        
        SELECT DISTINCT ?entity ?type ?name ?label
        WHERE {{
            ?entity a ?type .
            
            # Get name or label
            OPTIONAL {{ ?entity sport:firstName ?firstName . }}
            OPTIONAL {{ ?entity sport:lastName ?lastName . }}
            OPTIONAL {{ ?entity sport:teamName ?name . }}
            OPTIONAL {{ ?entity sport:competitionName ?name . }}
            OPTIONAL {{ ?entity sport:venueName ?name . }}
            OPTIONAL {{ ?entity sport:sportName ?name . }}
            OPTIONAL {{ ?entity rdfs:label ?label . }}
            
            # Bind full name for persons
            BIND(IF(BOUND(?firstName), CONCAT(?firstName, " ", ?lastName), ?name) as ?displayName)
            BIND(COALESCE(?displayName, ?label, "") as ?searchName)
            
            # Filter by search term
            FILTER(
                CONTAINS(LCASE(?searchName), LCASE("{search_term}")) ||
                CONTAINS(LCASE(STR(?entity)), LCASE("{search_term}"))
            )
        }}
        ORDER BY ?type ?searchName
        LIMIT {limit}
        """
        
        try:
            return self.client.execute_query(query)
        except Exception as e:
            logger.error(f"Error executing semantic search: {str(e)}")
            raise


# Global service instance
sparql_service = SPARQLService()
