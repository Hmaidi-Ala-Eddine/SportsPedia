"""
Complete CRUD Service for Sports - To be merged into sport_service.py
This file contains CREATE, UPDATE, DELETE methods to be added to SportService class
"""

from app.models.domain.sport import SportCreate, SportUpdate
from app.services.crud_helper import SPARQLCRUDHelper
import logging

logger = logging.getLogger(__name__)

# Add these methods to the SportService class:

async def create_sport(self, sport_data: SportCreate):
    """Create a new sport."""
    data_dict = sport_data.dict(exclude={'id'}, exclude_none=True)
    insert_pattern = SPARQLCRUDHelper.build_insert_query(
        sport_data.id, "SportDiscipline", data_dict
    )
    
    query = f"""
    {self.client.get_prefixes()}
    
    INSERT DATA {{
        {insert_pattern} .
    }}
    """
    
    try:
        self.client.execute_update(query)
        logger.info(f"Created sport: {sport_data.id}")
        return await self.get_sport_by_id(sport_data.id)
    except Exception as e:
        logger.error(f"Error creating sport: {str(e)}")
        raise

async def update_sport(self, sport_id: str, sport_data: SportUpdate):
    """Update an existing sport."""
    existing = await self.get_sport_by_id(sport_id)
    if not existing:
        return None
    
    data_dict = sport_data.dict(exclude_none=True)
    if not data_dict:
        return existing
    
    delete_patterns, insert_patterns = SPARQLCRUDHelper.build_update_patterns(
        sport_id, data_dict
    )
    
    query = f"""
    {self.client.get_prefixes()}
    
    DELETE {{
        {' '.join(delete_patterns)}
    }}
    INSERT {{
        {' '.join(insert_patterns)}
    }}
    WHERE {{
        {' OPTIONAL { ' + ' } OPTIONAL { '.join(delete_patterns) + ' }'}
    }}
    """
    
    try:
        self.client.execute_update(query)
        logger.info(f"Updated sport: {sport_id}")
        return await self.get_sport_by_id(sport_id)
    except Exception as e:
        logger.error(f"Error updating sport {sport_id}: {str(e)}")
        raise

async def delete_sport(self, sport_id: str) -> bool:
    """Delete a sport."""
    query = f"""
    {self.client.get_prefixes()}
    {SPARQLCRUDHelper.build_delete_query(sport_id)}
    """
    
    try:
        self.client.execute_update(query)
        logger.info(f"Deleted sport: {sport_id}")
        return True
    except Exception as e:
        logger.error(f"Error deleting sport {sport_id}: {str(e)}")
        raise
