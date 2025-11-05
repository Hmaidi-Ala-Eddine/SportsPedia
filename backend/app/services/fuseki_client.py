from SPARQLWrapper import SPARQLWrapper, JSON, POST, GET, BASIC
from typing import Dict, List, Any, Optional
import logging
from app.config.settings import settings

logger = logging.getLogger(__name__)


class FusekiClient:
    """Client for Apache Jena Fuseki SPARQL endpoint."""
    
    def __init__(self):
        self.endpoint = settings.FUSEKI_ENDPOINT
        self.update_endpoint = settings.FUSEKI_UPDATE_ENDPOINT
        self.namespace = settings.ONTOLOGY_NAMESPACE
        self.user = settings.FUSEKI_USER
        self.password = settings.FUSEKI_PASSWORD
        
    def execute_query(self, query: str) -> Dict[str, Any]:
        """
        Execute a SPARQL SELECT query.
        
        Args:
            query: SPARQL query string
            
        Returns:
            Dict containing query results
        """
        try:
            sparql = SPARQLWrapper(self.endpoint)
            sparql.setQuery(query)
            sparql.setReturnFormat(JSON)
            sparql.setMethod(GET)
            
            results = sparql.query().convert()
            logger.info(f"Query executed successfully. Found {len(results.get('results', {}).get('bindings', []))} results")
            return results
            
        except Exception as e:
            logger.error(f"Error executing query: {str(e)}")
            raise Exception(f"SPARQL query failed: {str(e)}")
    
    def execute_update(self, query: str) -> bool:
        """
        Execute a SPARQL UPDATE query (INSERT, DELETE).
        
        Args:
            query: SPARQL update query string
            
        Returns:
            True if successful
        """
        try:
            sparql = SPARQLWrapper(self.update_endpoint)
            sparql.setHTTPAuth(BASIC)
            sparql.setCredentials(self.user, self.password)
            sparql.setQuery(query)
            sparql.setMethod(POST)
            
            sparql.query()
            logger.info("Update query executed successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error executing update: {str(e)}")
            raise Exception(f"SPARQL update failed: {str(e)}")
    
    def execute_ask(self, query: str) -> bool:
        """
        Execute a SPARQL ASK query.
        
        Args:
            query: SPARQL ASK query string
            
        Returns:
            Boolean result
        """
        try:
            sparql = SPARQLWrapper(self.endpoint)
            sparql.setQuery(query)
            sparql.setReturnFormat(JSON)
            sparql.setMethod(GET)
            
            results = sparql.query().convert()
            return results.get('boolean', False)
            
        except Exception as e:
            logger.error(f"Error executing ASK query: {str(e)}")
            raise Exception(f"SPARQL ASK query failed: {str(e)}")
    
    def get_prefixes(self) -> str:
        """
        Get common SPARQL prefixes.
        
        Returns:
            String with PREFIX declarations
        """
        return f"""
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX sport: <{self.namespace}>
        """


# Global Fuseki client instance
fuseki_client = FusekiClient()