from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings."""
    
    # Application
    APP_NAME: str = "SportsPedia API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Fuseki Configuration
    FUSEKI_ENDPOINT: str = "http://localhost:3030/sportspedia/query"
    FUSEKI_UPDATE_ENDPOINT: str = "http://localhost:3030/sportspedia/update"
    FUSEKI_GRAPH_STORE: str = "http://localhost:3030/sportspedia/data"
    
    # Ontology
    ONTOLOGY_NAMESPACE: str = "http://example.org/sports-ontology#"
    
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_RELOAD: bool = True
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()