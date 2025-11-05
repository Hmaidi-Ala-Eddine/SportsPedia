"""
Natural Language Search Routes
Allows users to search using natural language queries converted to SPARQL
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.services.ollama_sparql_service import ollama_sparql_service
from app.services.fuseki_client import fuseki_client
from app.utils.json_converter import sparql_results_to_list
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/nl-search", tags=["Natural Language Search"])


class NLSearchResponse(BaseModel):
    """Response model for natural language search."""
    query: str
    sparql_query: str
    explanation: str
    results: List[Dict[str, Any]]
    total: int
    metadata: Dict[str, Any]


class QueryHistory(BaseModel):
    """Model for query history."""
    user_query: str
    sparql_query: str
    result_count: int
    method: str


@router.get("/search", response_model=NLSearchResponse)
async def natural_language_search(
    q: str = Query(..., description="Natural language query", min_length=3),
    limit: int = Query(default=50, ge=1, le=200, description="Maximum results")
):
    """
    **UNIFIED SEARCH** - Handles ALL entity types intelligently.
    
    **Person/Performance Examples:**
    - "show all athletes"
    - "athletes from France"
    - "list coaches with most experience"
    - "show achievements"
    - "find Messi"
    
    **Team/Competition/Organization Examples:**
    - "teams from England"
    - "competitions in 2024"
    - "federations in Switzerland"
    - "leagues with high prize money"
    
    Args:
        q: Natural language query
        limit: Maximum number of results
        
    Returns:
        Search results with generated SPARQL query or direct results
    """
    try:
        logger.info(f"Processing natural language query: {q}")
        
        # Convert natural language to SPARQL (or route to TCO semantic search)
        sparql_query, explanation, metadata = await ollama_sparql_service.convert_to_sparql(q)
        
        logger.info(f"Query processed using {metadata.get('method')}")
        
        # HANDLE TCO SEMANTIC SEARCH RESULTS (special case)
        if sparql_query == "TCO_DIRECT_RESULTS":
            logger.info(f"Returning TCO semantic search results for {metadata.get('entity_type')}")
            # Get the actual SPARQL from metadata
            actual_sparql = metadata.get("sparql", "No SPARQL available")
            return NLSearchResponse(
                query=q,
                sparql_query=actual_sparql,  # Use the actual SPARQL query
                explanation=explanation,
                results=metadata.get("results", []),
                total=metadata.get("total", 0),
                metadata={
                    "method": metadata.get("method"),
                    "entity_type": metadata.get("entity_type"),
                    "sparql": actual_sparql,  # Include in metadata too
                    "service": "tco_semantic_search"
                }
            )
        
        # HANDLE REGULAR SPARQL QUERIES (Person/Performance)
        # Add LIMIT to query if not present
        if "LIMIT" not in sparql_query.upper():
            sparql_query = sparql_query.strip()
            if sparql_query.endswith("}"):
                sparql_query += f"\nLIMIT {limit}"
        
        # Execute SPARQL query
        results = fuseki_client.execute_query(sparql_query)
        results_list = sparql_results_to_list(results)
        
        logger.info(f"Query returned {len(results_list)} results")
        
        return NLSearchResponse(
            query=q,
            sparql_query=sparql_query,
            explanation=explanation,
            results=results_list,
            total=len(results_list),
            metadata={
                **metadata,
                "execution_time_ms": results.get("execution_time", 0)
            }
        )
        
    except Exception as e:
        logger.error(f"Error in natural language search: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing natural language query: {str(e)}"
        )


@router.get("/examples")
async def get_query_examples():
    """
    Get example natural language queries.
    
    Returns:
        List of example queries users can try
    """
    return {
        "examples": [
            {
                "category": "Athletes & Coaches",
                "queries": [
                    "show all athletes",
                    "list athletes from France",
                    "find athletes from Spain",
                    "search for Messi",
                    "athletes with most goals",
                    "show all coaches",
                    "count all athletes"
                ]
            },
            {
                "category": "Teams",
                "queries": [
                    "teams from England",
                    "professional teams with budget over 500",
                    "top 10 ranked teams",
                    "teams in Manchester",
                    "national teams from Europe"
                ]
            },
            {
                "category": "Competitions",
                "queries": [
                    "competitions in 2024",
                    "all leagues",
                    "world cups",
                    "championships with high prize money",
                    "tournaments in France"
                ]
            },
            {
                "category": "Organizations",
                "queries": [
                    "federations in Switzerland",
                    "all sports agencies",
                    "find FIFA",
                    "organizations with high revenue"
                ]
            },
            {
                "category": "Performance",
                "queries": [
                    "show achievements",
                    "list all records",
                    "find Ballon d'Or winners"
                ]
            }
        ],
        "tips": [
            "Use simple, natural language",
            "Mention the entity type (athletes, teams, competitions, organizations)",
            "Use keywords like 'from', 'in', 'with', 'list', 'show'",
            "You can search by name, country, year, or other criteria",
            "The system automatically routes to the right search engine"
        ]
    }


@router.post("/feedback")
async def submit_feedback(
    query: str,
    was_helpful: bool,
    comment: Optional[str] = None
):
    """
    Submit feedback about search results.
    
    Args:
        query: The original query
        was_helpful: Whether the results were helpful
        comment: Optional feedback comment
        
    Returns:
        Confirmation message
    """
    logger.info(f"Feedback received - Query: {query}, Helpful: {was_helpful}, Comment: {comment}")
    
    # In a real application, you'd store this in a database
    return {
        "message": "Thank you for your feedback!",
        "query": query,
        "was_helpful": was_helpful
    }


@router.get("/health")
async def check_ollama_health():
    """
    Check if Ollama service is available.
    
    Returns:
        Health status of Ollama service
    """
    import httpx
    from app.config.settings import settings
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{settings.OLLAMA_URL}/api/tags")
            
            if response.status_code == 200:
                models = response.json().get("models", [])
                has_model = any(
                    settings.OLLAMA_MODEL in model.get("name", "")
                    for model in models
                )
                
                return {
                    "status": "healthy",
                    "ollama_url": settings.OLLAMA_URL,
                    "model": settings.OLLAMA_MODEL,
                    "model_available": has_model,
                    "available_models": [m.get("name") for m in models]
                }
            else:
                return {
                    "status": "unhealthy",
                    "error": f"Ollama returned status {response.status_code}"
                }
                
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "message": "Ollama service is not available. Using fallback pattern matching."
        }
