from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.api.routes import (
    persons,
    teams,
    competitions,
    venues,
    sports,
    organizations,
    equipment,
    performance,
    media,
    sponsorships,
    search,
    nl_search,
    auth,
    users,
    admin
)
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="A comprehensive sports encyclopedia API powered by semantic web technology",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers - All 10 domain classes + search + NL search + TCO search + auth + admin
app.include_router(persons.router, prefix="/api")
app.include_router(teams.router, prefix="/api")
app.include_router(competitions.router, prefix="/api")
app.include_router(venues.router, prefix="/api")
app.include_router(sports.router, prefix="/api")
app.include_router(organizations.router, prefix="/api")
app.include_router(equipment.router, prefix="/api")
app.include_router(performance.router, prefix="/api")
app.include_router(media.router, prefix="/api")
app.include_router(sponsorships.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(nl_search.router, prefix="/api")
# TCO search now handled by nl_search.router
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "description": "SportsPedia API - Semantic Sports Encyclopedia",
        "docs": "/docs",
        "redoc": "/redoc"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.API_RELOAD
    )