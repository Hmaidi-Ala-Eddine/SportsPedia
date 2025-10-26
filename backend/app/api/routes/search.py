from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.sparql_service import sparql_service
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("")
async def semantic_search(
    q: str = Query(..., description="Search query term"),
    limit: int = Query(default=50, ge=1, le=200)
):
    """
    Perform semantic search across all entities.
    
    - **q**: Search query term
    - **limit**: Maximum number of results (1-200)
    """
    try:
        if not q or len(q.strip()) == 0:
            raise HTTPException(status_code=400, detail="Search query cannot be empty")
        
        results = await sparql_service.semantic_search(search_term=q.strip(), limit=limit)
        results_list = sparql_results_to_list(results)
        
        # Format results
        formatted_results = []
        for result in results_list:
            formatted_results.append({
                "id": extract_id_from_uri(result.get('entity', '')),
                "type": extract_id_from_uri(result.get('type', '')),
                "name": result.get('name') or result.get('label'),
                "uri": result.get('entity')
            })
        
        return {
            "query": q,
            "results": formatted_results,
            "total": len(formatted_results)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/suggest")
async def search_suggestions(
    q: str = Query(..., description="Partial search term"),
    limit: int = Query(default=10, ge=1, le=50)
):
    """
    Get search suggestions based on partial input.
    
    - **q**: Partial search term
    - **limit**: Maximum number of suggestions (1-50)
    """
    try:
        if not q or len(q.strip()) < 2:
            return {"suggestions": [], "total": 0}
        
        results = await sparql_service.semantic_search(search_term=q.strip(), limit=limit)
        results_list = sparql_results_to_list(results)
        
        suggestions = []
        for result in results_list:
            name = result.get('name') or result.get('label')
            if name:
                suggestions.append({
                    "id": extract_id_from_uri(result.get('entity', '')),
                    "name": name,
                    "type": extract_id_from_uri(result.get('type', ''))
                })
        
        return {
            "suggestions": suggestions,
            "total": len(suggestions)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
