"""
Complete CRUD Operations for ALL Remaining Entities
This file contains all CRUD methods for the 8 remaining entities.
Copy the relevant sections into each service file.
"""

# ==================== SPORTS CRUD ====================
# Add to sport_service.py

async def create_sport(self, sport_data: SportCreate):
    """Create a new sport."""
    from app.services.crud_helper import SPARQLCRUDHelper
    data_dict = sport_data.dict(exclude={'id'}, exclude_none=True)
    insert_pattern = SPARQLCRUDHelper.build_insert_query(sport_data.id, "SportDiscipline", data_dict)
    query = f"{self.client.get_prefixes()}\nINSERT DATA {{ {insert_pattern} . }}"
    self.client.execute_update(query)
    return await self.get_sport_by_id(sport_data.id)

async def update_sport(self, sport_id: str, sport_data: SportUpdate):
    """Update an existing sport."""
    from app.services.crud_helper import SPARQLCRUDHelper
    existing = await self.get_sport_by_id(sport_id)
    if not existing:
        return None
    data_dict = sport_data.dict(exclude_none=True)
    if not data_dict:
        return existing
    delete_patterns, insert_patterns = SPARQLCRUDHelper.build_update_patterns(sport_id, data_dict)
    query = f"{self.client.get_prefixes()}\nDELETE {{ {' '.join(delete_patterns)} }}\nINSERT {{ {' '.join(insert_patterns)} }}\nWHERE {{ {' OPTIONAL { ' + ' } OPTIONAL { '.join(delete_patterns) + ' }'} }}"
    self.client.execute_update(query)
    return await self.get_sport_by_id(sport_id)

async def delete_sport(self, sport_id: str) -> bool:
    """Delete a sport."""
    from app.services.crud_helper import SPARQLCRUDHelper
    query = f"{self.client.get_prefixes()}\n{SPARQLCRUDHelper.build_delete_query(sport_id)}"
    self.client.execute_update(query)
    return True

# ==================== COMPETITIONS CRUD ====================
# Add to competition_service.py

async def create_competition(self, comp_data: CompetitionCreate):
    """Create a new competition."""
    from app.services.crud_helper import SPARQLCRUDHelper
    data_dict = comp_data.dict(exclude={'id'}, exclude_none=True)
    insert_pattern = SPARQLCRUDHelper.build_insert_query(comp_data.id, "Competition", data_dict)
    query = f"{self.client.get_prefixes()}\nINSERT DATA {{ {insert_pattern} . }}"
    self.client.execute_update(query)
    return {"id": comp_data.id, **data_dict}

async def update_competition(self, comp_id: str, comp_data: CompetitionUpdate):
    """Update an existing competition."""
    from app.services.crud_helper import SPARQLCRUDHelper
    data_dict = comp_data.dict(exclude_none=True)
    if not data_dict:
        return {"id": comp_id}
    delete_patterns, insert_patterns = SPARQLCRUDHelper.build_update_patterns(comp_id, data_dict)
    query = f"{self.client.get_prefixes()}\nDELETE {{ {' '.join(delete_patterns)} }}\nINSERT {{ {' '.join(insert_patterns)} }}\nWHERE {{ {' OPTIONAL { ' + ' } OPTIONAL { '.join(delete_patterns) + ' }'} }}"
    self.client.execute_update(query)
    return {"id": comp_id, **data_dict}

async def delete_competition(self, comp_id: str) -> bool:
    """Delete a competition."""
    from app.services.crud_helper import SPARQLCRUDHelper
    query = f"{self.client.get_prefixes()}\n{SPARQLCRUDHelper.build_delete_query(comp_id)}"
    self.client.execute_update(query)
    return True

# ==================== VENUES CRUD ====================
# Add to venue_service.py

async def create_venue(self, venue_data: VenueCreate):
    """Create a new venue."""
    from app.services.crud_helper import SPARQLCRUDHelper
    data_dict = venue_data.dict(exclude={'id'}, exclude_none=True)
    insert_pattern = SPARQLCRUDHelper.build_insert_query(venue_data.id, "Venue", data_dict)
    query = f"{self.client.get_prefixes()}\nINSERT DATA {{ {insert_pattern} . }}"
    self.client.execute_update(query)
    return {"id": venue_data.id, **data_dict}

async def update_venue(self, venue_id: str, venue_data: VenueUpdate):
    """Update an existing venue."""
    from app.services.crud_helper import SPARQLCRUDHelper
    data_dict = venue_data.dict(exclude_none=True)
    if not data_dict:
        return {"id": venue_id}
    delete_patterns, insert_patterns = SPARQLCRUDHelper.build_update_patterns(venue_id, data_dict)
    query = f"{self.client.get_prefixes()}\nDELETE {{ {' '.join(delete_patterns)} }}\nINSERT {{ {' '.join(insert_patterns)} }}\nWHERE {{ {' OPTIONAL { ' + ' } OPTIONAL { '.join(delete_patterns) + ' }'} }}"
    self.client.execute_update(query)
    return {"id": venue_id, **data_dict}

async def delete_venue(self, venue_id: str) -> bool:
    """Delete a venue."""
    from app.services.crud_helper import SPARQLCRUDHelper
    query = f"{self.client.get_prefixes()}\n{SPARQLCRUDHelper.build_delete_query(venue_id)}"
    self.client.execute_update(query)
    return True

# ==================== ORGANIZATIONS CRUD ====================
# Add to organization_service.py

async def create_organization(self, org_data: OrganizationCreate):
    """Create a new organization."""
    from app.services.crud_helper import SPARQLCRUDHelper
    data_dict = org_data.dict(exclude={'id'}, exclude_none=True)
    insert_pattern = SPARQLCRUDHelper.build_insert_query(org_data.id, "Organization", data_dict)
    query = f"{self.client.get_prefixes()}\nINSERT DATA {{ {insert_pattern} . }}"
    self.client.execute_update(query)
    return {"id": org_data.id, **data_dict}

async def update_organization(self, org_id: str, org_data: OrganizationUpdate):
    """Update an existing organization."""
    from app.services.crud_helper import SPARQLCRUDHelper
    data_dict = org_data.dict(exclude_none=True)
    if not data_dict:
        return {"id": org_id}
    delete_patterns, insert_patterns = SPARQLCRUDHelper.build_update_patterns(org_id, data_dict)
    query = f"{self.client.get_prefixes()}\nDELETE {{ {' '.join(delete_patterns)} }}\nINSERT {{ {' '.join(insert_patterns)} }}\nWHERE {{ {' OPTIONAL { ' + ' } OPTIONAL { '.join(delete_patterns) + ' }'} }}"
    self.client.execute_update(query)
    return {"id": org_id, **data_dict}

async def delete_organization(self, org_id: str) -> bool:
    """Delete an organization."""
    from app.services.crud_helper import SPARQLCRUDHelper
    query = f"{self.client.get_prefixes()}\n{SPARQLCRUDHelper.build_delete_query(org_id)}"
    self.client.execute_update(query)
    return True

# ==================== EQUIPMENT CRUD ====================
# Add to equipment_service.py

async def create_equipment(self, equip_data: EquipmentCreate):
    """Create new equipment."""
    from app.services.crud_helper import SPARQLCRUDHelper
    data_dict = equip_data.dict(exclude={'id'}, exclude_none=True)
    insert_pattern = SPARQLCRUDHelper.build_insert_query(equip_data.id, "Equipment", data_dict)
    query = f"{self.client.get_prefixes()}\nINSERT DATA {{ {insert_pattern} . }}"
    self.client.execute_update(query)
    return {"id": equip_data.id, **data_dict}

async def update_equipment(self, equip_id: str, equip_data: EquipmentUpdate):
    """Update existing equipment."""
    from app.services.crud_helper import SPARQLCRUDHelper
    data_dict = equip_data.dict(exclude_none=True)
    if not data_dict:
        return {"id": equip_id}
    delete_patterns, insert_patterns = SPARQLCRUDHelper.build_update_patterns(equip_id, data_dict)
    query = f"{self.client.get_prefixes()}\nDELETE {{ {' '.join(delete_patterns)} }}\nINSERT {{ {' '.join(insert_patterns)} }}\nWHERE {{ {' OPTIONAL { ' + ' } OPTIONAL { '.join(delete_patterns) + ' }'} }}"
    self.client.execute_update(query)
    return {"id": equip_id, **data_dict}

async def delete_equipment(self, equip_id: str) -> bool:
    """Delete equipment."""
    from app.services.crud_helper import SPARQLCRUDHelper
    query = f"{self.client.get_prefixes()}\n{SPARQLCRUDHelper.build_delete_query(equip_id)}"
    self.client.execute_update(query)
    return True

# ==================== PERFORMANCE CRUD ====================
# Add to performance_service.py

async def create_performance(self, perf_data: PerformanceCreate):
    """Create a new performance/record."""
    from app.services.crud_helper import SPARQLCRUDHelper
    data_dict = perf_data.dict(exclude={'id'}, exclude_none=True)
    insert_pattern = SPARQLCRUDHelper.build_insert_query(perf_data.id, "Performance", data_dict)
    query = f"{self.client.get_prefixes()}\nINSERT DATA {{ {insert_pattern} . }}"
    self.client.execute_update(query)
    return {"id": perf_data.id, **data_dict}

async def update_performance(self, perf_id: str, perf_data: PerformanceUpdate):
    """Update an existing performance/record."""
    from app.services.crud_helper import SPARQLCRUDHelper
    data_dict = perf_data.dict(exclude_none=True)
    if not data_dict:
        return {"id": perf_id}
    delete_patterns, insert_patterns = SPARQLCRUDHelper.build_update_patterns(perf_id, data_dict)
    query = f"{self.client.get_prefixes()}\nDELETE {{ {' '.join(delete_patterns)} }}\nINSERT {{ {' '.join(insert_patterns)} }}\nWHERE {{ {' OPTIONAL { ' + ' } OPTIONAL { '.join(delete_patterns) + ' }'} }}"
    self.client.execute_update(query)
    return {"id": perf_id, **data_dict}

async def delete_performance(self, perf_id: str) -> bool:
    """Delete a performance/record."""
    from app.services.crud_helper import SPARQLCRUDHelper
    query = f"{self.client.get_prefixes()}\n{SPARQLCRUDHelper.build_delete_query(perf_id)}"
    self.client.execute_update(query)
    return True

# ==================== MEDIA CRUD ====================
# Add to media_service.py

async def create_media(self, media_data: MediaCreate):
    """Create new media."""
    from app.services.crud_helper import SPARQLCRUDHelper
    data_dict = media_data.dict(exclude={'id'}, exclude_none=True)
    insert_pattern = SPARQLCRUDHelper.build_insert_query(media_data.id, "Media", data_dict)
    query = f"{self.client.get_prefixes()}\nINSERT DATA {{ {insert_pattern} . }}"
    self.client.execute_update(query)
    return {"id": media_data.id, **data_dict}

async def update_media(self, media_id: str, media_data: MediaUpdate):
    """Update existing media."""
    from app.services.crud_helper import SPARQLCRUDHelper
    data_dict = media_data.dict(exclude_none=True)
    if not data_dict:
        return {"id": media_id}
    delete_patterns, insert_patterns = SPARQLCRUDHelper.build_update_patterns(media_id, data_dict)
    query = f"{self.client.get_prefixes()}\nDELETE {{ {' '.join(delete_patterns)} }}\nINSERT {{ {' '.join(insert_patterns)} }}\nWHERE {{ {' OPTIONAL { ' + ' } OPTIONAL { '.join(delete_patterns) + ' }'} }}"
    self.client.execute_update(query)
    return {"id": media_id, **data_dict}

async def delete_media(self, media_id: str) -> bool:
    """Delete media."""
    from app.services.crud_helper import SPARQLCRUDHelper
    query = f"{self.client.get_prefixes()}\n{SPARQLCRUDHelper.build_delete_query(media_id)}"
    self.client.execute_update(query)
    return True

# ==================== SPONSORSHIPS CRUD ====================
# Add to sponsorship_service.py

async def create_sponsorship(self, spon_data: SponsorshipCreate):
    """Create a new sponsorship."""
    from app.services.crud_helper import SPARQLCRUDHelper
    data_dict = spon_data.dict(exclude={'id'}, exclude_none=True)
    insert_pattern = SPARQLCRUDHelper.build_insert_query(spon_data.id, "Sponsorship", data_dict)
    query = f"{self.client.get_prefixes()}\nINSERT DATA {{ {insert_pattern} . }}"
    self.client.execute_update(query)
    return {"id": spon_data.id, **data_dict}

async def update_sponsorship(self, spon_id: str, spon_data: SponsorshipUpdate):
    """Update an existing sponsorship."""
    from app.services.crud_helper import SPARQLCRUDHelper
    data_dict = spon_data.dict(exclude_none=True)
    if not data_dict:
        return {"id": spon_id}
    delete_patterns, insert_patterns = SPARQLCRUDHelper.build_update_patterns(spon_id, data_dict)
    query = f"{self.client.get_prefixes()}\nDELETE {{ {' '.join(delete_patterns)} }}\nINSERT {{ {' '.join(insert_patterns)} }}\nWHERE {{ {' OPTIONAL { ' + ' } OPTIONAL { '.join(delete_patterns) + ' }'} }}"
    self.client.execute_update(query)
    return {"id": spon_id, **data_dict}

async def delete_sponsorship(self, spon_id: str) -> bool:
    """Delete a sponsorship."""
    from app.services.crud_helper import SPARQLCRUDHelper
    query = f"{self.client.get_prefixes()}\n{SPARQLCRUDHelper.build_delete_query(spon_id)}"
    self.client.execute_update(query)
    return True
